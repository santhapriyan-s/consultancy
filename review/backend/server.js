const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'], // Add all your frontend origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sr_electricals';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: v => /\S+@\S+\.\S+/.test(v),
      message: 'Email is invalid'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['lighting', 'wiring', 'switches', 'safety', 'tools', 'solar'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// JWT middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

// Admin middleware
const adminRequired = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Block admin registration attempts
    if (email === 'admin@srelectricals.com') {
      return res.status(400).json({ message: 'This email is reserved for administrative use' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isAdmin: false // Always false for registration
    });

    const savedUser = await user.save();
    const token = jwt.sign(
      { userId: savedUser._id, isAdmin: false },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only set isAdmin to true if email is admin@srelectricals.com
    const isAdmin = email === 'admin@srelectricals.com';
    
    // Update user's admin status if it's incorrect
    if (user.isAdmin !== isAdmin) {
      user.isAdmin = isAdmin;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Product Routes

// Get all products (public)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get single product (public)
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Create product (admin only)
app.post('/api/products', authenticateJWT, adminRequired, async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    // Basic validation
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image: image || ''
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Update product (admin only)
app.put('/api/products/:id', authenticateJWT, adminRequired, async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', authenticateJWT, adminRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Add review to product (authenticated users)
app.post('/api/products/:id/reviews', authenticateJWT, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      userId: req.userId,
      rating,
      comment
    };

    product.reviews.unshift(newReview);
    await product.save();
    res.json(product.reviews);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
});

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@srelectricals.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared all existing products');

    // Seed initial products
    const initialProducts = [
      {
        name: "LED Bulb",
        price: 124,
        category: "lighting",
        description: "Energy-efficient LED bulb.",
        image: "/a.jpg"
      },
      {
        name: "Extension Cord",
        price: 299,
        category: "wiring",
        description: "5-meter extension cord.",
        image: "/b.jpg"
      },
      {
        name: "Smart Plug",
        price: 799,
        category: "switches",
        description: "Wi-Fi-enabled smart plug.",
        image: "/c.jpg"
      },
      {
        name: "Circuit Breaker",
        price: 621,
        category: "safety",
        description: "High-quality circuit breaker for safety.",
        image: "/d.jpg"
      },
      {
        name: "Solar Panel",
        price: 8999,
        category: "solar",
        description: "Eco-friendly solar panel for renewable energy.",
        image: "/e.jpg"
      },
      {
        name: "Battery Backup",
        price: 1999,
        category: "safety",
        description: "Reliable battery backup for power outages.",
        image: "/f.jpg"
      },
      {
        name: "Voltage Stabilizer",
        price: 2300,
        category: "safety",
        description: "Stabilizes voltage to protect appliances.",
        image: "/g.jpg"
      },
      {
        name: "Electric Drill",
        price: 1300,
        category: "tools",
        description: "Powerful electric drill for DIY projects.",
        image: "/h.jpg"
      },
      {
        name: "Cable Tester",
        price: 1575,
        category: "tools",
        description: "Tests electrical cables for faults.",
        image: "/i.jpg"
      },
      {
        name: "LED Strip Lights",
        price: 1099,
        category: "lighting",
        description: "Flexible LED strip lights for decoration.",
        image: "/j.jpg"
      }
    ];

    const result = await Product.insertMany(initialProducts);
    console.log(`✅ Successfully seeded ${result.length} products`);
  } catch (error) {
    console.error('❌ Error in initialization:', error);
  }
};

mongoose.connection.once('open', createAdminUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});