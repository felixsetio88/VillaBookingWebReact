import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Navbar from '../component/Navbar';
import styles from '../style';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [sortOption, setSortOption] = useState('default'); // New state for sorting/filtering

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/order/myorder/');
        const ordersData = await Promise.all(
          res.data.map(async (order) => {
            const userRes = await axios.get(`/users/${order.user}`);
            const hotelRes = await axios.get(`/hotels/find/${order.hotel._id}`);

            return {
              ...order,
              user: userRes.data,
              hotel: hotelRes.data,
            };
          })
        );
        setOrders(ordersData);
        setFilteredOrders(ordersData); // Set initial orders for display
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    let sortedOrders = [...orders];

    switch (option) {
      case 'newest':
        sortedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case 'oldest':
        sortedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case 'canceledTrue':
        sortedOrders = orders.filter(order => order.canceled === true);
        break;
      case 'canceledFalse':
        sortedOrders = orders.filter(order => order.canceled === false);
        break;
      case 'confirmedTrue':
        sortedOrders = orders.filter(order => order.confirmed === true);
        break;
      case 'confirmedFalse':
        sortedOrders = orders.filter(order => order.confirmed === false);
        break;
      default:
        sortedOrders = [...orders];
    }

    setFilteredOrders(sortedOrders); // Update the filteredOrders state with the new sort/filter
  };

  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Order Details', 10, 10);
    doc.text('Villa Nyaman', 10, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 10, 30);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 10, 36);
    doc.text(`Hotel: ${order.hotel.name}`, 10, 42);
    doc.text(`Start Date: ${new Date(order.startDate).toLocaleDateString()}`, 10, 48);
    doc.text(`End Date: ${new Date(order.endDate).toLocaleDateString()}`, 10, 54);
    doc.text(`Total: Rp. ${order.total}`, 10, 60);
    doc.text(`Confirmed: ${order.confirmed ? 'Yes' : 'No'}`, 10, 66);
    doc.text(`Canceled: ${order.canceled ? 'Yes' : 'No'}`, 10, 72);

    doc.text(`Sold to:`, 10, 80);
    doc.text(`First Name: ${order.user.firstname}`, 10, 86);
    doc.text(`Last Name: ${order.user.lastname}`, 10, 92);
    doc.text(`Email: ${order.user.email}`, 10, 98);
    doc.text(`Passport No: ${order.user.passportNo}`, 10, 104);
    doc.text(`Country: ${order.user.country}`, 10, 110);
    doc.text(`Phone: ${order.user.phone}`, 10, 116);

    doc.save(`order_${order._id}.pdf`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user.firstname)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-[3px] rounded-[30px] w-[300px] h-[300px] mt-10 ml-10">
          <h2 className="font-poppins ml-10 mt-10 font-bold text-[40px]">Sorry</h2>
          <p className="font-poppins mt-10 ml-10">
            You are not logged in! <a href="/login">Click here</a> to login page
          </p>
        </div>
      </div>
    );

  return (
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
        <div>
          <h1 className="font-poppins mt-5 text-[35px] font-semibold text-gray-900">My Order</h1>

          {/* Dropdown for sorting/filtering */}
          <div className="mt-4">
            <label htmlFor="sort" className="font-poppins text-lg">Sort/Filter by: </label>
            <select
              id="sort"
              className="ml-2 p-2 border rounded"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="canceledTrue">Show Canceled Orders</option>
              <option value="canceledFalse">Show Active Orders</option>
              <option value="confirmedTrue">Show Confirmed Orders</option>
              <option value="confirmedFalse">Show Unconfirmed Orders</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="mt-6 border-t border-gray-100">
            {filteredOrders.map((order) => (
              <div key={order._id} className="py-6 border-[3px] mt-5 rounded-[20px] border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between">
                  
                  <div className="ml-10 sm:ml-0 sm:mr-10">
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
                  </div>

                  <div className="mt-5 sm:ml-10 mb-4 sm:mb-0">
                    <img
                      src={order.hotel.photos[0]}
                      alt="Hotel"
                      className="w-full sm:w-[320px] h-[240px] md:w-[400px] h-[300px] lg:w-[400px] h-[300px] object-cover rounded-[10px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-5 mr-5">
                  <button
                    className="bg-blue-500 text-white font-poppins py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => handleDownloadPDF(order)}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
