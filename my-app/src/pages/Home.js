/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Home_hero from "../component/Home_hero";
import Navbar from "../component/Navbar";
import Home_explorecard from "../component/Home_explorecard";
import Home_whyus from "../component/Home_whyus";
import Home_testimonials from "../component/Home_testimonials";
import styles from "../style";
import Home_contactus from "../component/Home_contactus";
import Home_weunderstand from "../component/Home_weunderstand";
import Footer from "../component/Footer";
import { bghero } from '../assets';

export default function Home() {
  // State for most viewed villas
  const [mostViewedVillas, setMostViewedVillas] = useState([]);
  const [loadingMostViewed, setLoadingMostViewed] = useState(true);
  const [errorMostViewed, setErrorMostViewed] = useState(null);

  // State for last added villas
  const [lastAddedVillas, setLastAddedVillas] = useState([]);
  const [loadingLastAdded, setLoadingLastAdded] = useState(true);
  const [errorLastAdded, setErrorLastAdded] = useState(null);

  useEffect(() => {
    // Fetch most viewed villas
    const fetchMostViewedVillas = async () => {
      try {
        const res = await axios.get('/villas/most-viewed');
        setMostViewedVillas(res.data.slice(0, 3)); // Get only the top 3 villas
      } catch (err) {
        setErrorMostViewed(err.message);
      } finally {
        setLoadingMostViewed(false);
      }
    };

    // Fetch last added villas
    const fetchLastAddedVillas = async () => {
      try {
        const res = await axios.get('/villas/recently-added');
        setLastAddedVillas(res.data.slice(0, 3)); // Get only the last 3 villas
      } catch (err) {
        setErrorLastAdded(err.message);
      } finally {
        setLoadingLastAdded(false);
      }
    };

    fetchMostViewedVillas();
    fetchLastAddedVillas();
  }, []);

  if (loadingMostViewed || loadingLastAdded) return <div className="flex justify-center items-center min-h-screen">
  <div className="border-[3px] rounded-[30px] w-[300px] h-[300px] mt-10 ml-10">
    <h2 className="font-poppins ml-10 mt-10 font-bold text-[40px]">Loading...</h2>
    <p className="font-poppins mt-10 ml-10 w-[220px]">
      Please wait, try to refresh if this page doesn't load up soon.
    </p>
  </div>
</div>;
  if (errorMostViewed || errorLastAdded) return <p>Error: {errorMostViewed || errorLastAdded}</p>;

  return (
    <>
      <div className="bg-white">
      
        {/* Background Image Wrapper */}
        <div 
          className="bg-cover bg-center w-full"
          style={{ backgroundImage: `url(${bghero})`, height: '900px' }} // Ensures full-screen height for background
        >
          <div className={`${styles.paddingX} ${styles.flexCenter} h-full`}>
            <div className={`${styles.boxWidth}`}>
              {/* Navbar and Home Hero inside the background */}
              <Navbar />
              <Home_hero />
            </div>
        </div>
        </div>

        <div className={`mx-auto max-w-[1380px] justify-center items-center ${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            {/* Explore Most Viewed Villas Section */}
            <div className="mt-[100px]">
              <h1 id="explore" className="text-4xl font-bold font-poppins mb-8">Explore</h1>
              <p className="font-poppins mb-8">Explore our most popular villas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostViewedVillas.map((villa) => (
                  <Home_explorecard
                    key={villa._id}
                    title={villa.name}
                    description={villa.desc}
                    price={`Rp. ${villa.cheapestPrice}`}
                    imageUrl={villa.photos[0]}
                    url={`/result/${villa._id}`}
                  />
                ))}
              </div>
            </div>

            {/* Last Added Villas Section */}
            <div className="mt-[100px]">
              <h1 className="text-4xl font-bold font-poppins mb-8">Recently Added</h1>
              <p className="font-poppins mb-8">Check out our latest additions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lastAddedVillas.map((villa) => (
                  <Home_explorecard
                    key={villa._id}
                    title={villa.name}
                    description={villa.desc}
                    price={`Rp. ${villa.cheapestPrice}`}
                    imageUrl={villa.photos[0]}
                    url={`/result/${villa._id}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-[150px]">
              <Home_weunderstand />
            </div>

            <Home_whyus />
            <Home_testimonials />
            <Home_contactus />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
