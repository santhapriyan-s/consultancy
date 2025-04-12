import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Package, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminHome = () => {
  const { orders, products } = useShop();
  
  // Calculate statistics
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = [...new Set(orders.map(order => order.shipping?.name))].length;
  
  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];
  
  // Calculate category distribution for pie chart
  const categoryMap = {};
  products.forEach(product => {
    if (categoryMap[product.category]) {
      categoryMap[product.category]++;
    } else {
      categoryMap[product.category] = 1;
    }
  });
  
  const categoryData = Object.keys(categoryMap).map(category => ({
    name: category,
    value: categoryMap[category],
  }));
  
  // Colors for pie chart
  const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#1A1F2C', '#F1F0FB', '#8E9196'];
  
  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors">
          Generate Reports
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Sales</p>
              <p className="text-3xl font-bold mt-1">${totalSales.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CreditCard className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-green-500 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Orders</p>
              <p className="text-3xl font-bold mt-1">{totalOrders}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-blue-500 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>+8.2% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Products</p>
              <p className="text-3xl font-bold mt-1">{totalProducts}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Package className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-yellow-500 text-sm">
            <Clock size={16} className="mr-1" />
            <span>+2 added this week</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Customers</p>
              <p className="text-3xl font-bold mt-1">{totalCustomers}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-purple-500 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>+5.1% from last month</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#9b87f5" fill="#D6BCFA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <div className="h-80">
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
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shipping?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {recentOrders.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/admin/orders" className="text-sm font-medium text-brand-purple hover:underline">
              View All Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
