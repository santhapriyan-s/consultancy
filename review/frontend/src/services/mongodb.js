// services/mongodb.js
// This file provides a client-side simulation of MongoDB operations using localStorage

// Utility function to get collection from localStorage
const getCollection = (collectionName) => {
  const data = localStorage.getItem(`sr_electricals_${collectionName}`);
  return data ? JSON.parse(data) : [];
};

// Utility function to save collection to localStorage
const saveCollection = (collectionName, data) => {
  try {
    localStorage.setItem(`sr_electricals_${collectionName}`, JSON.stringify(data));
    console.log(`Saved ${data.length} items to ${collectionName} collection`);
  } catch (error) {
    console.error(`Failed to save to ${collectionName}:`, error);
    if (error.name === 'QuotaExceededError') {
      // Implement fallback strategy - maybe keep only the most recent items
      const reducedData = data.slice(-10); // Keep only last 10 items
      localStorage.setItem(`sr_electricals_${collectionName}`, JSON.stringify(reducedData));
      console.warn(`Reduced ${collectionName} collection to 10 items due to storage limits`);
    }
  }
};

// Initialize collections if they don't exist
const initializeCollections = () => {
  const defaultProducts = [
    { id: 1, name: "LED Bulb", price: 124, category: "lighting", description: "Energy-efficient LED bulb.", image: "/a.jpg", isFavorite: false, reviews: [] },
    { id: 2, name: "Extension Cord", price: 299, category: "wiring", description: "5-meter extension cord.", image: "/b.jpg", isFavorite: false, reviews: [] },
    { id: 3, name: "Smart Plug", price: 799, category: "switches", description: "Wi-Fi-enabled smart plug.", image: "/c.jpg", isFavorite: false, reviews: [] },
    { id: 4, name: "Circuit Breaker", price: 621, category: "safety", description: "High-quality circuit breaker for safety.", image: "/d.jpg", isFavorite: false, reviews: [] },
    { id: 5, name: "Solar Panel", price: 8999, category: "solar", description: "Eco-friendly solar panel for renewable energy.", image: "/e.jpg", isFavorite: false, reviews: [] },
    { id: 6, name: "Battery Backup", price: 1999, category: "safety", description: "Reliable battery backup for power outages.", image: "/f.jpg", isFavorite: false, reviews: [] },
    { id: 7, name: "Voltage Stabilizer", price: 2300, category: "safety", description: "Stabilizes voltage to protect appliances.", image: "/g.jpg", isFavorite: false, reviews: [] },
    { id: 8, name: "Electric Drill", price: 1300, category: "tools", description: "Powerful electric drill for DIY projects.", image: "/h.jpg", isFavorite: false, reviews: [] },
    { id: 9, name: "Cable Tester", price: 1575, category: "tools", description: "Tests electrical cables for faults.", image: "/i.jpg", isFavorite: false, reviews: [] },
    { id: 10, name: "LED Strip Lights", price: 1099, category: "lighting", description: "Flexible LED strip lights for decoration.", image: "/j.jpg", isFavorite: false, reviews: [] },
  ].map(p => ({ ...p, price: Number(p.price) })); // Ensure all prices are numbers

  const collections = [
    { name: 'products', defaultData: defaultProducts },
    { name: 'carts', defaultData: [] },
    { name: 'wishlists', defaultData: [] },
    { name: 'orders', defaultData: [] }
  ];

  collections.forEach(({ name, defaultData }) => {
    if (!localStorage.getItem(`sr_electricals_${name}`)) {
      saveCollection(name, defaultData);
    }
  });
};

// Initialize collections on load
initializeCollections();

// MongoDB-style operations for compatibility
export const getAll = async (collection) => {
  return getCollection(collection);
};

export const getOne = async (collection, filter) => {
  const items = getCollection(collection);
  return items.find(item => item.id === filter.id);
};

export const insertOne = async (collection, document) => {
  const items = getCollection(collection);
  items.push(document);
  saveCollection(collection, items);
  return { insertedId: document.id };
};

export const insertMany = async (collection, documents) => {
  const items = getCollection(collection);
  documents.forEach(doc => items.push(doc));
  saveCollection(collection, items);
  return { insertedCount: documents.length };
};

export const updateOne = async (collection, filter, update) => {
  const items = getCollection(collection);
  const index = items.findIndex(item => item.id === filter.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...update };
    saveCollection(collection, items);
    return { modifiedCount: 1 };
  }
  return { modifiedCount: 0 };
};

export const deleteOne = async (collection, filter) => {
  const items = getCollection(collection);
  const newItems = items.filter(item => item.id !== filter.id);
  saveCollection(collection, newItems);
  return { deletedCount: items.length - newItems.length };
};

export const deleteMany = async (collection, filter) => {
  if (Object.keys(filter).length === 0) {
    // If empty filter, clear the collection
    saveCollection(collection, []);
    return { deletedCount: getCollection(collection).length };
  }
  const items = getCollection(collection);
  const newItems = items.filter(item => item.id !== filter.id);
  saveCollection(collection, newItems);
  return { deletedCount: items.length - newItems.length };
};

// For compatibility with existing code
export const connectToMongoDB = async () => {
  console.log('Using localStorage as MongoDB simulation storage');
  return {
    collection: (name) => ({
      find: () => ({
        toArray: async () => getCollection(name)
      }),
      findOne: async (filter) => {
        const items = getCollection(name);
        return items.find(item => item.id === filter.id);
      },
      insertOne: async (document) => insertOne(name, document),
      insertMany: async (documents) => insertMany(name, documents),
      updateOne: async (filter, update) => updateOne(name, filter, update),
      deleteOne: async (filter) => deleteOne(name, filter),
      deleteMany: async (filter) => deleteMany(name, filter)
    })
  };
};