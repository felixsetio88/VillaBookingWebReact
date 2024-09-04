import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useFetch from "../hooks/useFetch";
import { AuthContext } from "../context/AuthContext";
import Checkout from "./Checkout";
import axios from "axios";

import Navbar from "../component/Navbar";
import styles from "../style";
const Moreinformation = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0, room: 1 });
  const { data, loading, error } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  
  const startDate = location.state?.dates[0].startDate ? new Date(location.state.dates[0].startDate) : new Date();
  const endDate = location.state?.dates[0].endDate ? new Date(location.state.dates[0].endDate) : new Date(startDate.getTime() + MILLISECONDS_PER_DAY);
  const days = dayDifference(startDate, endDate);
  const roomCount = options.room;
  
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    console.log("useEffect called");
    const updateViewCount = async () => {
      if (data) {
        try {
          
          var viewed = data.viewed;
          if (viewed === undefined || viewed === 0){
            viewed = 1
          }
          viewed +=1;
          await axios.put(`/hotels/update-view/${id}`, { viewed: viewed});
          console.log("View count updated to:" + data.viewed); // Logs the new view count
          
        } catch (error) {
          console.error("Error updating views", error);
          // handle error as needed
        }
      }
    };

    updateViewCount();
  }, [data, id]);
  return (
    <div>
      {loading ? (
        "loading"
      ) : (
        
        <><div className={`mx-auto max-w-[1380px] justify-center items-center ${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>

              <Navbar />
            </div>
          </div><div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">



              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="font-poppins font-semibold text-[30px] ml-10">{data.name}</h1>
                <div className="hotelAddress ml-10">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span className="font-poppins text-[20px]">{data.address}</span>
                </div>
                <span className="font-poppins text-blue-700 ml-10">
                  Amazing location, just {data.distance}m from nearest beach!
                </span>
                <span className="font-poppins text-green-800 ml-10">
                  Starting at Rp. {data.cheapestPrice} for each room.
                </span>
                <div className="mt-10">
                  {data.photos?.map((photo, i) => (
                    <div className="hotelImgWrapper" key={i}>
                      <img
                        onClick={() => handleOpen(i)}
                        src={`http://localhost:8800${photo}`}
                        alt=""
                        className="hotelImg"/>
                    </div>
                  ))}
                </div>
                <p className="font-poppins text-[15px] mt-10 ml-10">{data.desc}</p>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-[20px] lg:mt-0">
                <div className="flex px-[20px] flex-col gap-[20px] bg-blue-100 max-w-[300px] h-[320px] rounded-[20px]">
                  <h1 className="font-poppins text-center mt-10">Great choice for a {days}-night stay!</h1>
                  <span className="font-poppins text-center">
                    {`Check-in date: ${format(startDate, "MM/dd/yyyy")}, Check-out date: ${format(endDate, "MM/dd/yyyy")}`}
                  </span>
                  <h2>
                    <b className="font-poppins text-center">Total Rp. {days * data.cheapestPrice * options.room} for {days} day(s) stay, and {options.room} room(s)</b>
                  </h2>
                  <button className="w-100 h-10 bg-blue-300 mt-10 font-poppins font-semibold rounded-[20px] hover:bg-blue-500" onClick={handleClick}>Book Now!</button>
                </div>

              </div>
            </div></>


      )}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <Checkout 
            setOpen={setOpenModal} 
            roomCount={roomCount}
            startDate={startDate}
            endDate={endDate}
            days={days}
            hotelId={id}
          />
        </div>
      )}
      
    </div>
  );
};

export default Moreinformation;
