import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, Filter, ChevronDown, ChevronUp, X, Eye } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';
import ReportGenerator from '../../components/admin/ReportGenerator';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useShop();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      // Filter by search term
      const searchFields = [
        order.id,
        order.shipping?.name,
        order.shipping?.email,
        order.shipping?.phone,
      ].join(' ').toLowerCase();
      
      const matchesSearch = searchTerm === '' || searchFields.includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      const { key, direction } = sortConfig;
      
      if (key === 'date') {
        return direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      
      if (key === 'total') {
        return direction === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      }
      
      return 0;
    });
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
  };
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order Status Updated",
      description: `Order #${orderId} status has been updated to ${newStatus}.`,
    });
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      
      {/* Report Generator */}
      <ReportGenerator orders={orders} />
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-gray-500">Filter:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={handleStatusFilter}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('total')}>
                  <div className="flex items-center">
                    <span>Amount</span>
                    {sortConfig.key === 'total' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.shipping?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹ {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-brand-purple hover:text-brand-deep-purple"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-2">Order Items</h3>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 text-sm">
                                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                        <img 
                                          src={item.image || "https://via.placeholder.com/40x40?text=Product"}
                                          alt={item.name} 
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-gray-500 text-xs"> ₹ {item.price.toFixed(2)} x {item.quantity}</p>
                                      </div>
                                      <div className="text-gray-700">₹ {(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <div className="text-sm text-gray-700">
                                  <p>{order.shipping?.name}</p>
                                  <p>{order.shipping?.phone}</p>
                                  <p>{order.shipping?.addressLine1}</p>
                                  {order.shipping?.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                                  <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.pincode}</p>
                                  <p>{order.shipping?.country}</p>
                                </div>
                                
                                <h3 className="font-semibold mt-4 mb-2">Payment Information</h3>
                                <div className="text-sm text-gray-700">
                                  <p>Method: {order.payment?.method === 'cod' ? 'Cash on Delivery' : order.payment?.method}</p>
                                  <p>Status: {order.payment?.status}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-500 text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
