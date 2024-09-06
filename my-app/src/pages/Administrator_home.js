import React from 'react';
import useOrderStats from '../hooks/useOrderStats';

import Navbar from "../component/Navbar";
import styles from "../style";
import LineChart from '../component/Admin_linechart';

export default function Administrator_home() {
  const { stats, loading, error } = useOrderStats();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const callouts = [
    { name: 'Total Room Number', description: `${stats.totalRoomNumber} Rooms` },
    { name: 'All Time Total Amount', description: `Rp. ${stats.totalAmount}` },
    { name: 'All Time Total Canceled', description: stats.totalCanceled },
    { name: 'Total Room Sold This Week', description: `${stats.totalRoomNumberThisWeek} Rooms` },
    { name: 'Total Revenue This Week', description: `Rp. ${stats.totalAmountThisWeek}` },
    { name: 'Total Canceled This Week', description: stats.totalCanceledThisWeek },
    { name: 'Total Confirmed ', description: stats.totalConfirmed },
    { name: 'Total Confirmed This Week', description: stats.totalConfirmedThisWeek },
    { name: 'Orders not confirmed', description: stats.totalNotConfirmed },
    { name: 'Total product listed', description: stats.totalProductListed },
    { name: 'Total product viewed', description: stats.totalProductViewed },
    { name: 'Total account registered', description: stats.totalAccountRegistered },
  ];

  return (
    <div className={`${styles.paddingX} ${styles.flexCenter} h-full`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-24 lg:max-w-none lg:py-8">
            <h2 className="font-poppins text-[60px] font-bold text-gray-900">Administrator Dashboard</h2>
            <h2 className="font-poppins text-[30px] font-bold text-gray-900">Statistics</h2>

            {/* Callouts */}
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:space-y-0">
              {callouts.map((callout) => (
                <div key={callout.name} className="font-poppins group relative">
                  <div className="relative h-80 mt-6 w-full overflow-hidden bg-white border-[3px] border-black rounded-[20px] sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <h2 className="mt-6 ml-5 font-bold text-[20px] text-gray-900">
                      <a>
                        <span className="absolute inset-0" />
                        {callout.name}
                      </a>
                    </h2>
                    <p className="ml-5 font-poppins text-[35px] mt-6 text-gray-900">{callout.description}</p>
                  </div>
                </div>
              ))}
            </div>
              <LineChart />
            {/* Action Section */}
            <h2 className="font-poppins text-[30px] mt-8 font-bold text-gray-900">Action</h2>
            <div className="mt-4 h-[50px] font-poppins flex space-x-4">
              <button className="bg-cyan-300 text-black px-4 py-2 rounded">
                <a href="/addproduct">Add product</a>
              </button>
              <button className="bg-cyan-300 text-black px-4 py-2 rounded">
                <a href="/allorder">All Orders</a>
              </button>
              <button className="bg-cyan-300 text-black px-4 py-2 rounded">
                <a href="/manageproduct">Manage Product</a>
              </button>
              <button className="bg-cyan-300 text-black px-4 py-2 rounded">
                <a href="/myinfo">Account info</a>
              </button>
              <button className="bg-cyan-300 text-black px-4 py-2 rounded">
                <a href="/update">Update account info</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
