
import React from 'react';

const Home_weunderstand = ({ title, description, price }) => {
  return (
<div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="mx-auto max-w-2xl lg:text-center">

        <p className="mt-[50px] text-[30px] font-poppins font-bold tracking-tight text-gray-900 sm:text-[60px]">
            We Understand Your Needs
        </p>
        <p className="mt-6 font-poppins text-lg leading-8 text-gray-600">
        Our villa offer a comfortable place to stay with strategic location, complete facility, with easy access to restaurants, tourist attraction, and beaches.
        </p>
        <div className="mt-10 flex  gap-x-6">
            <a href="/find" className="text-lg font-poppins font-semibold leading-6 text-gray-900">
                  Find available villas <span aria-hidden="true">→</span>
            </a>
        </div>
    </div>
    
</div>
  );
};

export default Home_weunderstand;
