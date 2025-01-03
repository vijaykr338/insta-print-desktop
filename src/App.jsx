import React, { useState } from 'react';
import './styles/dashboard.css'


// Mock initial data
const initialOrders = [
  {
    id: 1,
    customerName: "John Doe",
    rollNo: "R123",
    numberOfFiles: 3,
    date: "2025-01-02",
    time: "14:30",
    totalAmount: 6,
    status: "pending",
    files: [
      { name: "File A", pages: 2, color: true, orientation: "portrait" },
      { name: "File B", pages: 1, color: false, orientation: "landscape" },
      { name: "File C", pages: 3, color: true, orientation: "portrait" },
    ]
  },
];

const Dashboard = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('pending');

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filterOrders = (status) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Print Shop Dashboard</h1>
      </header>

      <nav className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'ready' ? 'active' : ''}`}
          onClick={() => setActiveTab('ready')}
        >
          Ready for Pickup
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Orders
        </button>
      </nav>

      <div className="orders-container">
        {activeTab === 'pending' && (
          <OrdersList 
            orders={filterOrders('pending')}
            onUpdateStatus={(id) => updateOrderStatus(id, 'ready')}
            actionButtonText="Mark as Ready"
            showFileDetails
          />
        )}
        {activeTab === 'ready' && (
          <OrdersList 
            orders={filterOrders('ready')}
            onUpdateStatus={(id) => updateOrderStatus(id, 'completed')}
            actionButtonText="Mark as Collected"
          />
        )}
        {activeTab === 'completed' && (
          <OrdersList 
            orders={filterOrders('completed')}
            showStatus
          />
        )}
      </div>
    </div>
  );
};

const OrdersList = ({ orders, onUpdateStatus, actionButtonText, showFileDetails, showStatus }) => {
  return (
    <div className="orders-list">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h2>Order #{order.id}</h2>
            <span className="order-timestamp">{order.date} at {order.time}</span>
          </div>
          
          <div className="order-content">
            <div className="order-details">
              <div className="detail-item">
                <span className="label">Customer:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Roll No:</span>
                <span>{order.rollNo}</span>
              </div>
              <div className="detail-item">
                <span className="label">Files:</span>
                <span>{order.numberOfFiles}</span>
              </div>
              <div className="detail-item">
                <span className="label">Total Amount:</span>
                <span>${order.totalAmount}</span>
              </div>
              {showStatus && (
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="status">{order.status}</span>
                </div>
              )}
            </div>

            {showFileDetails && (
              <div className="files-details">
                <h3>File Details:</h3>
                {order.files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <span>{file.pages} pages</span>
                    <span>{file.color ? 'Color' : 'B&W'}</span>
                    <span>{file.orientation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {onUpdateStatus && (
            <div className="order-actions">
              <button 
                className="action-button"
                onClick={() => onUpdateStatus(order.id)}
              >
                {actionButtonText}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;