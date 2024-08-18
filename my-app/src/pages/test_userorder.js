import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get('/api/my-orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        if (error.response.status === 401) {
          history.push('/login');
        }
      });
  }, [history]);

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map(order => (
        <div key={order._id}>
          <h2>Order ID: {order._id}</h2>
          <p>Rent ID: {order.rent}</p>
          <p>Quantity: {order.quantity}</p>
          <p>Start Date: {new Date(order.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(order.endDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default UserOrdersPage;
