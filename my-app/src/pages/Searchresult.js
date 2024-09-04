import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import { DateRange } from "react-date-range";
import axios from "axios";
import SearchItem from "../pages/Searchitem";
import useFetch from "../hooks/useFetch";
import "./Searchresult.css";
import styles from "../style"
import Navbar from "../component/Navbar"

const Searchresult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(location.state?.dates || [{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0, room: 1 });
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [sort, setSort] = useState(""); // New state for sorting

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 0}&max=${max || 999}&sort=${sort}`
  );

  const handleClick = () => {
    reFetch();
  };
  useEffect(() => {
    if (!dates[0]) {
      setDates([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    }
  }, [dates]);

  const handleNavigate = async (id) => {
    navigate(`/result/${id}`, { state: { dates, options } });
  };

  return (
    <div className={`mx-auto max-w-[1380px] justify-center items-center ${styles.paddingX} ${styles.flexCenter}`}>
    <div className={`${styles.boxWidth}`}>
        <Navbar />
    <div className="listContainer">
      <div className="listWrapper ">
        <div className=" flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <h1 className="font-poppins font-semibold text-[30px]">Search</h1>
          <div className="lsItem">
            <label className="font-poppins font-semibold">What you are looking for?</label>
            <input
              placeholder={destination}
              className="font-poppins font-semibold bg-gray-100 rounded-[10px]"
              type="text"
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="lsItem">
            <label className="font-poppins font-semibold">Check-in Date</label>
            <div className="bg-gray-100 rounded-[10px] font-poppins text-center">
              <span onClick={() => setOpenDate(!openDate)}>
                {dates[0] ? `${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}` : "Select dates"}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
          </div>
          <div className="lsItem">
            <label className="font-poppins text-[20px] font-semibold">Options</label>
            <div className="lsOptions">
              {/* Sorting Options */}
              <div className="lsItem">
                <label className="font-poppins text-[20px] font-semibold">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-gray-100 rounded-[10px] font-poppins"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Added</option>
                  <option value="type">Type</option>
                </select>
              </div>
              {/* Existing Options */}
              <div className="lsOptionItem">
                <span className="lsOptionText font-poppins">Min price</span>
                <input
                  type="number"
                  onChange={(e) => setMin(e.target.value)}
                  className="lsOptionInput bg-gray-100 rounded-[10px] text-center font-poppins"
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText font-poppins">Max price</span>
                <input
                  type="number"
                  onChange={(e) => setMax(e.target.value)}
                  className="lsOptionInput bg-gray-100 rounded-[10px] text-center font-poppins"
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText font-poppins">Adult</span>
                <input
                  type="number"
                  min={1}
                  className="lsOptionInput  bg-gray-100 rounded-[10px] text-center font-poppins"
                  placeholder={options.adult}
                  onChange={(e) => setOptions((prev) => ({ ...prev, adult: e.target.value }))}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText font-poppins">Children</span>
                <input
                  type="number"
                  min={0}
                  className="lsOptionInput  bg-gray-100 rounded-[10px] text-center font-poppins"
                  placeholder={options.children}
                  onChange={(e) => setOptions((prev) => ({ ...prev, children: e.target.value }))}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText font-poppins">Room</span>
                <input
                  type="number"
                  min={1}
                  className="lsOptionInput  bg-gray-100 rounded-[10px] text-center font-poppins"
                  placeholder={options.room}
                  onChange={(e) => setOptions((prev) => ({ ...prev, room: e.target.value }))}
                />
                </div>
              {/* Additional Options like Adult, Children, Room */}
            </div>
          </div>
          <button className="bg-cyan-300 h-10 w-[80px] rounded-[10px] font-poppins" onClick={handleClick}>Search</button>
        </div>

        <div className="listResult">
          {loading ? (
            "loading"
          ) : (
            <>
              {data.map((item) => (
                <div key={item._id} onClick={() => handleNavigate(item._id)}>
                  <SearchItem item={item} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
    </div>

    </div>
  );
};

export default Searchresult;
