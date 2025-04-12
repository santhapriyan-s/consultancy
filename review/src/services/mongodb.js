
// This file provides a client-side simulation of MongoDB operations using localStorage
// For a production app, you would need a backend service to interact with MongoDB

// Utility function to get collection from localStorage
const getCollection = (collectionName) => {
    const data = localStorage.getItem(`sr_electricals_${collectionName}`);
    return data ? JSON.parse(data) : [];
  };
  
  // Utility function to save collection to localStorage
  const saveCollection = (collectionName, data) => {
    localStorage.setItem(`sr_electricals_${collectionName}`, JSON.stringify(data));
    console.log(`Saved ${data.length} items to ${collectionName} collection`);
  };
  
  // Initialize collections if they don't exist
  const initializeCollections = () => {
    const collections = ['products', 'carts', 'wishlists', 'orders'];
    collections.forEach(collection => {
      if (!localStorage.getItem(`sr_electricals_${collection}`)) {
        localStorage.setItem(`sr_electricals_${collection}`, JSON.stringify([]));
        console.log(`Initialized ${collection} collection`);
      }
    });
  };
  
  // Initialize collections on load
  initializeCollections();
  
  // Create sample orders if none exist
  const createSampleOrders = () => {
    const orders = getCollection('orders');
    if (orders.length === 0) {
      const sampleOrders = [
        {
          id: '1234abcd5678',
          date: new Date().toISOString(),
          status: 'Processing',
          total: 249.97,
          items: [
            {
              id: 'prod1',
              name: 'LED Smart Bulb',
              price: 49.99,
              quantity: 3,
              image: '/d.jpg'
            },
            {
              id: 'prod2',
              name: 'Wireless Switch',
              price: 99.99,
              quantity: 1,
              image: '/e.jpg'
            }
          ],
          shipping: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-1234',
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            pincode: '12345',
            country: 'USA'
          },
          payment: {
            method: 'card',
            status: 'paid'
          }
        },
        {
          id: '5678efgh9012',
          date: new Date(Date.now() - 86400000).toISOString(), // yesterday
          status: 'Delivered',
          total: 159.98,
          items: [
            {
              id: 'prod3',
              name: 'Smart Power Strip',
              price: 79.99,
              quantity: 2,
              image: '/f.jpg'
            }
          ],
          shipping: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-5678',
            addressLine1: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            pincode: '67890',
            country: 'USA'
          },
          payment: {
            method: 'cod',
            status: 'pending'
          }
        }
      ];
      
      saveCollection('orders', sampleOrders);
      console.log('Created sample orders');
    }
  };
  
  // Create sample data
  createSampleOrders();
  
  // Connection flag - for compatibility with the existing code
  export const connectToMongoDB = async () => {
    console.log('Using localStorage as MongoDB simulation storage');
    return {
      collection: (name) => ({
        find: () => ({
          toArray: async () => {
            const data = getCollection(name);
            console.log(`Retrieved ${data.length} items from ${name} collection`);
            return data;
          }
        }),
        findOne: async (filter) => {
          const items = getCollection(name);
          const item = items.find(item => item.id === filter.id);
          console.log(`Found item in ${name} collection:`, item ? 'yes' : 'no');
          return item;
        },
        insertOne: async (document) => {
          const items = getCollection(name);
          items.push(document);
          saveCollection(name, items);
          return { insertedId: document.id || document._id };
        },
        insertMany: async (documents) => {
          const items = getCollection(name);
          documents.forEach(doc => items.push(doc));
          saveCollection(name, items);
          return { insertedCount: documents.length };
        },
        updateOne: async (filter, update) => {
          const items = getCollection(name);
          const index = items.findIndex(item => item.id === filter.id);
          if (index !== -1) {
            if (update.$set) {
              items[index] = { ...items[index], ...update.$set };
            } else {
              items[index] = { ...items[index], ...update };
            }
            saveCollection(name, items);
            return { modifiedCount: 1 };
          }
          return { modifiedCount: 0 };
        },
        deleteOne: async (filter) => {
          if (!filter || Object.keys(filter).length === 0) {
            // If filter is empty, clear the collection
            saveCollection(name, []);
            return { deletedCount: 1 };
          }
          
          const items = getCollection(name);
          const initialLength = items.length;
          const filtered = items.filter(item => item.id !== filter.id);
          saveCollection(name, filtered);
          return { deletedCount: initialLength - filtered.length };
        }
      })
    };
  };
  
  // Get all documents from a collection
  export const getAll = async (collection) => {
    try {
      const data = getCollection(collection);
      console.log(`Retrieved ${data.length} items from ${collection} using getAll function`);
      return data;
    } catch (error) {
      console.error(`Error getting all documents from ${collection}:`, error);
      return [];
    }
  };
  
  // Get a single document by ID
  export const getById = async (collection, id) => {
    try {
      const items = getCollection(collection);
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`Error getting document by ID from ${collection}:`, error);
      return null;
    }
  };
  
  // Insert a document
  export const insertOne = async (collection, document) => {
    try {
      const items = getCollection(collection);
      items.push(document);
      saveCollection(collection, items);
      return { insertedId: document.id || document._id };
    } catch (error) {
      console.error(`Error inserting document into ${collection}:`, error);
      throw error;
    }
  };
  
  // Insert multiple documents
  export const insertMany = async (collection, documents) => {
    try {
      const items = getCollection(collection);
      documents.forEach(doc => items.push(doc));
      saveCollection(collection, items);
      return { insertedCount: documents.length };
    } catch (error) {
      console.error(`Error inserting documents into ${collection}:`, error);
      throw error;
    }
  };
  
  // Update a document
  export const updateOne = async (collection, filter, update) => {
    try {
      const items = getCollection(collection);
      const index = items.findIndex(item => item.id === filter.id);
      if (index !== -1) {
        items[index] = { ...items[index], ...update };
        saveCollection(collection, items);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      throw error;
    }
  };
  
  // Delete a document
  export const deleteOne = async (collection, filter) => {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        // If filter is empty, clear the collection
        saveCollection(collection, []);
        return { deletedCount: 1 };
      }
      
      const items = getCollection(collection);
      const initialLength = items.length;
      const filtered = items.filter(item => item.id !== filter.id);
      saveCollection(collection, filtered);
      return { deletedCount: initialLength - filtered.length };
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      throw error;
    }
  };
  
  // Close the connection - just a dummy function for compatibility
  export const closeConnection = async () => {
    console.log('No actual connection to close when using localStorage');
    return true;
  };
  