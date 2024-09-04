import { Link } from "react-router-dom";
import "./Searchitem.css";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img src={`http://localhost:8800${item.photos[0]}`} alt="" className="siImg" />
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
          <Link to={`/result/${item._id}`}>
            <button className="siCheckButton mt-10 font-poppins">More Information</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
