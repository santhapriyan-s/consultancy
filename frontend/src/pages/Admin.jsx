
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  User,
  Package,
  ShoppingBag,
  DollarSign,
  Search,
  LogOut,
  Edit,
  Trash2,
  PlusCircle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
  Mail,
  Phone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// AdminNavbar component
const AdminNavbar = ({ logout, user }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">SR Electricals Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <span className="hidden md:block">{user?.name || 'Admin'}</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-gray-700">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main admin component
const Admin = () => {
  const { user, logout, products, setProducts, orders, setOrders, users, storeSettings, updateStoreSettings } = useProduct();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });
  const [adminOperationInProgress, setAdminOperationInProgress] = useState(false);
  const [settings, setSettings] = useState({
    storeName: storeSettings?.storeName || "SR Electricals",
    storeEmail: storeSettings?.storeEmail || "info@srelectricals.com",
    storePhone: storeSettings?.storePhone || "+91 9876543210",
    enableCod: storeSettings?.enableCod ?? true,
    enableRazorpay: storeSettings?.enableRazorpay ?? true,
    enableUpi: storeSettings?.enableUpi ?? true,
    razorpayKey: storeSettings?.razorpayKey || "rzp_test_pYO1RxhwzDCppY"
  });
  
  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Update settings from context when storeSettings change
  useEffect(() => {
    if (storeSettings) {
      setSettings({
        storeName: storeSettings.storeName || "SR Electricals",
        storeEmail: storeSettings.storeEmail || "info@srelectricals.com",
        storePhone: storeSettings.storePhone || "+91 9876543210",
        enableCod: storeSettings.enableCod ?? true,
        enableRazorpay: storeSettings.enableRazorpay ?? true,
        enableUpi: storeSettings.enableUpi ?? true,
        razorpayKey: storeSettings.razorpayKey || "rzp_test_pYO1RxhwzDCppY"
      });
    }
  }, [storeSettings]);

  // Stats for dashboard
  const totalUsers = users?.filter(user => !user.isAdmin).length || 0;
  const totalOrders = orders.length;
  const totalProductsSold = orders.reduce((total, order) => 
    total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);

  // Format price to 2 decimal places with ₹ symbol
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Generate actual sales data from orders
  const generateSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Initialize sales data with zero values for all months
    const monthlySales = months.map(month => ({ name: month, sales: 0 }));
    
    // Populate with actual order data
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate.getFullYear() === currentYear) {
        const monthIndex = orderDate.getMonth();
        monthlySales[monthIndex].sales += order.total;
      }
    });
    
    return monthlySales;
  };

  // Sales data for charts - now uses actual order data
  const salesData = generateSalesData();

  // Get top selling products
  const getTopSellingProducts = () => {
    // Create a map to track sales by product ID
    const productSales = {};
    
    // Calculate total sales for each product
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { 
            productId: item.id, 
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    // Convert to array and sort by quantity sold
    const salesArray = Object.values(productSales);
    salesArray.sort((a, b) => b.quantity - a.quantity);
    
    // Get product details for top sellers
    const topProducts = salesArray.slice(0, 5).map(sale => {
      const productDetails = products.find(p => p.id === sale.productId);
      return {
        ...productDetails,
        unitsSold: sale.quantity,
        totalRevenue: sale.revenue
      };
    }).filter(product => product.name); // Filter out undefined products
    
    return topProducts;
  };

  // Product category data
  const categoryData = products.reduce((acc, product) => {
    const existingCategory = acc.find(item => item.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

  // Generate order PDF
  const downloadOrderPDF = (orderId) => {
    setAdminOperationInProgress(true);
    
    toast({
      title: "Downloading PDF",
      description: `Order #${orderId} PDF is being generated.`
    });
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    
    // If the field is price, ensure it's a valid number
    if (name === 'price') {
      const numValue = value === '' ? '' : parseFloat(value);
      setNewProduct({
        ...newProduct,
        [name]: numValue
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  // Handle settings change
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Save settings
  const handleSaveSettings = () => {
    setAdminOperationInProgress(true);
    
    // Update settings in context
    updateStoreSettings(settings);
    
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully."
    });
    
    // Store settings in localStorage to ensure persistence
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Add or update product
  const handleSaveProduct = () => {
    setAdminOperationInProgress(true);
    
    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      isFavorite: false,
      reviews: []
    };

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...productData } 
          : product
      );
      setProducts(updatedProducts);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully."
      });
    } else {
      // Add new product
      const newProductWithId = {
        ...productData,
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
      };
      setProducts([...products, newProductWithId]);
      toast({
        title: "Product added",
        description: "New product has been added successfully."
      });
    }

    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      description: '',
      image: ''
    });
    setIsAddProductDialogOpen(false);
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image
    });
    setIsAddProductDialogOpen(true);
  };

  // Delete product
  const handleDeleteProduct = () => {
    setAdminOperationInProgress(true);
    
    if (productToDelete) {
      const updatedProducts = products.filter(product => product.id !== productToDelete.id);
      setProducts(updatedProducts);
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully."
      });
    }
    
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Confirm delete product
  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Open status update dialog
  const openStatusDialog = (order) => {
    setStatusOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
  };

  // Update order status
  const updateOrderStatus = () => {
    setAdminOperationInProgress(true);
    
    if (statusOrder && newStatus) {
      const updatedOrders = orders.map(order => 
        order.id === statusOrder.id 
          ? { ...order, status: newStatus } 
          : order
      );
      setOrders(updatedOrders);
      toast({
        title: "Order status updated",
        description: `Order #${statusOrder.id} status changed to ${newStatus}`
      });
    }
    
    setStatusOrder(null);
    setNewStatus('');
    setIsStatusDialogOpen(false);
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Get filtered users/orders based on search term
  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'users') {
      return users?.filter(user => 
        !user.isAdmin && // Filter out admin users
        (user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term))
      ) || [];
    }
    
    if (activeTab === 'orders') {
      return orders.filter(order => 
        order.id.toString().includes(term) || 
        (order.address && order.address.name.toLowerCase().includes(term))
      );
    }
    
    return data;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar logout={logout} user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
              <h2 className="font-semibold text-lg mb-6 px-2">Admin Dashboard</h2>
              
              {/* Admin Profile Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.name || 'Admin'}</h3>
                    <p className="text-sm text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Last login: {new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'dashboard' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'analytics' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Analytics
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'users' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  <User className="h-5 w-5 mr-3" />
                  Users
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'orders' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'products' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('products')}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Products
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-left ${
                    activeTab === 'settings' ? 'bg-srblue text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                      <User className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-semibold">{totalUsers}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-500">Orders</h3>
                      <Package className="h-6 w-6 text-orange-500" />
                    </div>
                    <p className="text-3xl font-semibold">{totalOrders}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-500">Products Sold</h3>
                      <ShoppingBag className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-3xl font-semibold">{totalProductsSold}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-500">Revenue</h3>
                      <DollarSign className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-3xl font-semibold">₹{totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Admin activity overview */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Admin Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{user?.name || 'Admin User'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{user?.email || 'admin@example.com'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Role</label>
                        <p className="font-medium">Administrator</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Store Settings</label>
                        <p className="font-medium">{settings.storeName}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Contact</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <p>{settings.storeEmail}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <p>{settings.storePhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.slice(0, 5).map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>#{order.id}</TableCell>
                              <TableCell>{order.address ? order.address.name : 'N/A'}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                  ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                                  ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell>₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          {orders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">No orders yet</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#1E88E5" name="Sales (₹)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          width={500}
                          height={300}
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#1E88E5" 
                            activeDot={{ r: 8 }} 
                            name="Sales (₹)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
                                { name: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length },
                                { name: 'Processing', value: orders.filter(o => o.status === 'Processing').length },
                                { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
                                { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4CAF50" /> {/* Delivered */}
                              <Cell fill="#2196F3" /> {/* Shipped */}
                              <Cell fill="#FFC107" /> {/* Processing */}
                              <Cell fill="#9E9E9E" /> {/* Pending */}
                              <Cell fill="#F44336" /> {/* Cancelled */}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Units Sold</TableHead>
                            <TableHead>Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getTopSellingProducts().map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>{formatPrice(product.price)}</TableCell>
                              <TableCell>{product.unitsSold}</TableCell>
                              <TableCell>{formatPrice(product.totalRevenue)}</TableCell>
                            </TableRow>
                          ))}
                          {getTopSellingProducts().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                No sales data available yet
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Users Management</h2>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-900">Total Registered Users</h3>
                      <p className="text-3xl font-bold text-blue-700">
                        {users?.filter(user => !user.isAdmin).length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredData(users?.filter(user => !user.isAdmin) || []).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{orders.filter(order => order.userId === user.id).length}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                        {getFilteredData(users?.filter(user => !user.isAdmin) || []).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              {searchTerm ? 'No users match your search' : 'No users registered yet'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
                
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-green-900">Total Orders</h3>
                      <p className="text-3xl font-bold text-green-700">{orders.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search orders..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredData(orders).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.address ? order.address.name : 'N/A'}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                                ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                              `}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>₹{order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openStatusDialog(order)}
                                  className="h-8"
                                >
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => downloadOrderPDF(order.id)}
                                  className="h-8"
                                >
                                  <FileText className="h-4 w-4 text-green-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getFilteredData(orders).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              {searchTerm ? 'No orders match your search' : 'No orders placed yet'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Products Management</h2>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-purple-900">Total Products</h3>
                      <p className="text-3xl font-bold text-purple-700">{products.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search products..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        image: ''
                      });
                      setIsAddProductDialogOpen(true);
                    }}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="capitalize">{product.category}</TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditProduct(product)}
                                  className="h-8"
                                >
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => confirmDeleteProduct(product)}
                                  className="h-8"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {products.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No products available yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">General Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="storeName">Store Name</Label>
                          <Input 
                            id="storeName" 
                            name="storeName"
                            value={settings.storeName} 
                            onChange={handleSettingChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storeEmail">Store Email</Label>
                          <Input 
                            id="storeEmail" 
                            name="storeEmail"
                            type="email"
                            value={settings.storeEmail} 
                            onChange={handleSettingChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storePhone">Store Phone</Label>
                          <Input 
                            id="storePhone" 
                            name="storePhone"
                            value={settings.storePhone} 
                            onChange={handleSettingChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="enableCod"
                              name="enableCod"
                              checked={settings.enableCod}
                              onChange={handleSettingChange}
                              className="rounded text-srblue focus:ring-srblue"
                            />
                            <Label htmlFor="enableCod">Enable Cash on Delivery</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="enableUpi"
                              name="enableUpi"
                              checked={settings.enableUpi}
                              onChange={handleSettingChange}
                              className="rounded text-srblue focus:ring-srblue"
                            />
                            <Label htmlFor="enableUpi">Enable UPI Payment</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="enableRazorpay"
                              name="enableRazorpay"
                              checked={settings.enableRazorpay}
                              onChange={handleSettingChange}
                              className="rounded text-srblue focus:ring-srblue"
                            />
                            <Label htmlFor="enableRazorpay">Enable Razorpay</Label>
                          </div>
                          {settings.enableRazorpay && (
                            <div className="mt-2">
                              <Label htmlFor="razorpayKey">Razorpay Key</Label>
                              <Input
                                id="razorpayKey"
                                name="razorpayKey"
                                value={settings.razorpayKey}
                                onChange={handleSettingChange}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Form Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Edit the product details below and click save to update.'
                : 'Fill in the product details below and click add to create a new product.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductChange}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleProductChange}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleProductChange}
                    placeholder="Electronics, Cables, etc."
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={newProduct.image}
                  onChange={handleProductChange}
                  placeholder="http://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleProductChange}
                  placeholder="Describe the product features and details."
                  className="mt-1 h-24"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for Order #{statusOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateOrderStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;