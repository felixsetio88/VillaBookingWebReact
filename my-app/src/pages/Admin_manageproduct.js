import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "../style";
import Navbar from "../component/Navbar";
const ManageProduct = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("/hotels");
        setHotels(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${styles.paddingX} ${styles.flexCenter} h-full`}>
    <div className={`${styles.boxWidth}`}>
    <Navbar />
    <h1 className="font-poppins mt-5 text-[35px] font-semibold text-gray-900">Manage Product</h1>
      {hotels.map((item) => (
        <div className="searchItem mt-10" key={item._id}>
          <img src={item.photos[0]} alt="" className="siImg" />
          <div className="siDesc font-poppins">
            <h1 className="text-[25px] font-bold color-gray">{item.name}</h1>
            <span className="text-[15px]">{item.distance}m from nearest beach</span>
            <span className="text-[15px]">{item.desc}</span>
            <span className="text-[15px]">Viewed {item.viewed} times</span>
            <span className="text-[15px]">{item.sold} rooms sold</span>
          </div>
          <div className="siDetails">
            {item.rating && (
              <div className="siRating">
                <span>Excellent</span>
                <button>{item.rating}</button>
              </div>
            )}
            <div className="siDetailTexts">
              <span className="siPrice">Rp. {item.cheapestPrice}</span>
              <Link to={`/editproduct/${item._id}`}>
                <button className="w-[150px] h-[50px] rounded-[10px] bg-cyan-300 mt-10 font-poppins">Edit</button>
              </Link>
              <Link>
              <button
                className="w-[150px] ml-[200px] h-[50px] rounded-[10px] bg-red-500 font-poppins"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
              </Link>
              
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ManageProduct;
