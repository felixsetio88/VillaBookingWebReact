import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import styles from '../style';
import Swal from 'sweetalert2';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/order/orders/');
        const ordersData = res.data;
        setOrders(ordersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    try {
      const res = await axios.patch(`/order/confirm/${orderId}`);
      setOrders(orders.map(order => order._id === orderId ? res.data : order));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const res = await axios.patch(`/order/cancel/${orderId}`);
      setOrders(orders.map(order => order._id === orderId ? res.data : order));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`/order/delete/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
        <div>
          <h1 className="font-poppins mt-5 text-[35px] font-semibold text-gray-900">All Orders</h1>
          <div className="mt-6 border-t border-gray-100">
            {orders.map((order) => (
              <div key={order._id} className="py-6 border-[3px] rounded-[20px] mt-5 border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between">

                <div className="ml-10  sm:ml-0 sm:mr-10">
                    <h2 className="text-lg ml-5 font-medium text-gray-900">Order ID: {order._id}</h2>
                    <p className="text-sm ml-5 text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <div className="mt-4 ml-10">
                      <h3 className="font-semibold text-gray-900">User Information</h3>
                      <p>First Name: {order.user.firstname}</p>
                      <p>Last Name: {order.user.lastname}</p>
                      <p>Email: {order.user.email}</p>
                      <p>Passport No: {order.user.passportNo}</p>
                      <p>Country: {order.user.country}</p>
                      <p>Phone: {order.user.phone}</p>
                    </div>
                    <div className="mt-4 ml-10">
                      <h3 className="font-semibold text-gray-900">Order Details</h3>
                      <p>Start Date: {new Date(order.startDate).toLocaleDateString()}</p>
                      <p>End Date: {new Date(order.endDate).toLocaleDateString()}</p>
                      <p>Rooms: {order.roomNumber}</p>
                      <p>Total: Rp. {order.total}</p>
                    </div>
                    <div className="mt-4 ml-10">
                      <h3 className="font-semibold text-gray-900">Status</h3>
                      <p>Confirmed: {order.confirmed ? 'Yes' : 'No'}</p>
                      <p>Canceled: {order.canceled ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="mt-4 ml-10 flex space-x-4">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => 
                      
                      Swal.fire({
                        title: "Confirm Order",
                        text: "Are you sure you want to confirm this order?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Continue"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleConfirm(order._id)
                          Swal.fire({
                            title: "Confirmed!",
                            text: "Order has been confirmed!",
                            icon: "success"
                          });
                        }
                      })
                      
                      }
                  >
                    Confirm
                  </button>
                  <button 
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                    onClick={() => 
                      
                      Swal.fire({
                        title: "Cancel Order",
                        text: "Are you sure you want to cancel this order?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Continue"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleCancel(order._id)
                          Swal.fire({
                            title: "Canceled!",
                            text: "Order has been canceled!",
                            icon: "success"
                          });
                        }
                      })

                     }
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => 
                      
                      Swal.fire({
                        title: "Delete Order",
                        text: "Are you sure you want to delete this order?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Continue"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDelete(order._id)
                          Swal.fire({
                            title: "Deleted!",
                            text: "Order has been deleted from database!",
                            icon: "success"
                          });
                        }
                      })
                      
                      }
                  >
                    Delete
                  </button>
                </div>
                  </div>

                  <div className="sm:ml-10 mb-4 sm:mb-0">
                    {order.villa && order.villa.photos && order.villa.photos.length > 0 ? (
                      <img
                        src={`http://localhost:8800${order.villa.photos[0]}`}
                        alt="Villa"
                        className="w-full sm:w-[320px] h-[240px] md:w-[400px] h-[300px] lg:w-[400px] h-[300px] object-cover rounded-[10px]"
                      />
                    ) : (
                      <p className="font-poppins">No photo available to show, please try to reload.</p>
                    )}
                  </div>
           
                  
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
