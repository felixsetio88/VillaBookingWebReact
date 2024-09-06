import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const responseRevenue = await axios.get('/order/revenue-graph');
        setRevenueData(responseRevenue.data);
        console.log(responseRevenue.data);
      } catch (error) {
        console.error('Error fetching revenue data', error);
      }
    };

    const fetchRoom = async () => {
      try {
        const responseRoom = await axios.get('/order/room-graph');
        setRoomData(responseRoom.data);
        console.log(responseRoom.data);
      } catch (error) {
        console.error('Error fetching room data', error);
      }
    };

    fetchRevenue();
    fetchRoom();
  }, []);

  return (
    <div>
      <h2 className="font-poppins font-bold mt-5 text-[25px]">Revenue</h2>
      {revenueData ? (
        <Line
          data={revenueData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
                reverse: false,
              },
              y: {
                title: {
                  display: true,
                  text: 'Revenue (in Rp.)',
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading Revenue Data...</p>
      )}

      <h2 className="font-poppins mt-5 font-bold text-[25px]">Room Sold</h2>
      {roomData ? (
        <Line
          data={roomData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
                reverse: false,
              },
              y: {
                title: {
                  display: true,
                  text: 'Room Sold',
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading Room Data...</p>
      )}
    </div>
  );
};

export default LineChart;
