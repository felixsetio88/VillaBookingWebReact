import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user.token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Hotel Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user.firstname} {order.user.lastname}</td>
              <td>{order.hotel.name}</td>
              <td>{new Date(order.startDate).toLocaleDateString()}</td>
              <td>{new Date(order.endDate).toLocaleDateString()}</td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;
