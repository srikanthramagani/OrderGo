import React, { useEffect, useState } from 'react';
import '../../styles/AllOrders.css';
import axios from 'axios';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-orders');
      const filteredOrders = response.data
        .filter(order => order.restaurantName === username)
        .reverse();
      setOrders(filteredOrders);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put('http://localhost:6001/cancel-order', { id });
      alert('Order cancelled!');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const updateOrderStatus = async (id) => {
    const updateStatus = statusUpdates[id];
    if (!updateStatus) return alert("Select a status first.");

    try {
      await axios.put('http://localhost:6001/update-order-status', { id, updateStatus });
      alert('Order status updated!');
      fetchOrders();
    } catch (err) {
      alert('Order update failed!');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  return (
    <div className="all-orders-page">
      <h3>Orders</h3>
      <div className="all-orders">
        {orders.map((order) => (
          <div className="all-orders-order" key={order._id}>
            <img src={order.foodItemImg} alt={order.foodItemName} />
            <div className="all-orders-order-data">
              <h4>{order.foodItemName}</h4>
              <p>{order.restaurantName}</p>
              <div>
                <p><b>UserId:</b> {order.userId}</p>
                <p><b>Name:</b> {order.name}</p>
                <p><b>Mobile:</b> {order.mobile}</p>
                <p><b>Email:</b> {order.email}</p>
              </div>
              <div>
                <p><b>Quantity:</b> {order.quantity}</p>
                <p><b>Total Price:</b> ₹{parseInt(order.price - (order.price * order.discount) / 100) * order.quantity} <s>₹{order.price * order.quantity}</s></p>
                <p><b>Payment mode:</b> {order.paymentMethod}</p>
              </div>
              <div>
                <p><b>Address:</b> {order.address}</p>
                <p><b>Pincode:</b> {order.pincode}</p>
                <p><b>Ordered on:</b> {order.orderDate.slice(0, 10)} Time: {order.orderDate.slice(11, 16)}</p>
              </div>
              <div>
                <p><b>Status:</b> {order.orderStatus}</p>
              </div>

              {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                <div style={{ marginTop: '10px' }}>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={statusUpdates[order._id] || ""}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="" disabled>Update order status</option>
                    <option value="order placed">Order Accepted</option>
                    <option value="In-transit">In-transit</option>
                    <option value="delivered">Delivered</option>
                  </select>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => updateOrderStatus(order._id)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantOrders;
