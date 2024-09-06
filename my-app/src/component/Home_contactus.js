import React, { useState } from 'react';
import { location, phone, gmail } from '../assets';
import axios from 'axios';

const Home_contactus = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/send-email/', formData);
      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send the message. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-poppins font-bold mb-8">Contact Us</h1>
      <p className="text-[16px] font-poppins">Do you have any questions or concern? We will answer to your questions shortly.</p>
      <div className="flex flex-col md:flex-row w-full max-w-4xl">
        <div className="flex flex-col items-start p-4 space-y-4 w-full md:w-1/2">
          <div className="flex mt-20 items-center space-x-4">
            <img src={location} alt="Address Icon" className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-lg font-bold font-poppins">Address</h2>
              <p className="font-poppins">Jl. Munduk Batu Belah, Gg Pendawa No. 4, Banjar Kelod Padonan, Pererenan, Badung, Bali 80351.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src={phone} alt="Phone Icon" className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-lg font-bold">Phone Number</h2>
              <p>+62 813-2605-8136</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src={gmail} alt="Email Icon" className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-lg font-bold">Email</h2>
              <p>villanyaman2024@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="p-4 w-full md:w-1/2">
          <div className="bg-white p-8 mt-5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-poppins font-bold mb-4">Send Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 font-poppins py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
      
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 font-poppins py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type Your Message..."
                  className="w-full px-4 font-poppins py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-300 text-black py-2 rounded-lg hover:bg-cyan-500"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_contactus;
