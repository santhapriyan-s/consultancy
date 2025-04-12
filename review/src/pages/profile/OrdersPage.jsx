import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ChevronRight, Package, ShoppingBag } from 'lucide-react';

const OrdersPage = () => {
  const { orders } = useShop();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">My Orders</h2>
      </div>

      {orders.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm">
                    Order #{order.id} - {new Date(order.date).toLocaleDateString()}
                  </p>
                  <h3 className="font-medium text-lg">{order.items.length} items</h3>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <img
                        src={item.image || "https://via.placeholder.com/48x48?text=Product"}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}

                {order.items.length > 3 && (
                  <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                    <p className="text-gray-500 text-sm">+{order.items.length - 3} more items</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
                <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                <div className="flex space-x-3 mt-3 sm:mt-0">
                  <Link
                    to={`/profile/orders/${order.id}`}
                    className="flex items-center text-sm text-brand-purple hover:underline"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
