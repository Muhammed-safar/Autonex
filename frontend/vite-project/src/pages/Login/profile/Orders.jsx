import React from 'react';

const Orders = ({ setActiveTab }) => {
  const orders = [
    { id: '#AT-84920', date: 'Jul 15, 2026', total: '$143.98', status: 'In Transit' },
    { id: '#AT-73911', date: 'May 20, 2026', total: '$89.20', status: 'Delivered' }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <span className="font-bold text-gray-800">{order.id}</span>
              <p className="text-xs text-gray-500 mt-0.5">Placed on {order.date}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">Total: {order.total}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                order.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {order.status}
              </span>
              <button 
                onClick={() => setActiveTab('tracking')}
                className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded transition-colors"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;