import React from 'react';

const Home_explorecard = ({ title, description, price, imageUrl, url }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto sm:mx-0">
      <img src={`http://localhost:8800${imageUrl}`} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <h2 className="text-lg font-bold font-poppins mb-2">{title}</h2>
        <p className="text-black font-poppins mb-4">{description}</p>
        <p className="text-lg font-semibold font-poppins mb-4">{price}</p>
        <div className="flex space-x-4">
          <button className="bg-black text-white py-2 px-4 font-poppins rounded"><a href={url}>See more</a></button>
          <button className="border border-black text-black font-poppins py-2 px-4 rounded">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Home_explorecard;
