import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import useFetch from "../hooks/useFetch";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import axios from "axios";

const Checkout = ({ setOpen, roomCount, startDate, endDate, days, villaId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(`/villas/find/${id}`);
  const { user } = useContext(AuthContext);

  const handleOrderCreation = async () => {
    const order = {
      user: user._id,
      villa: id,
      startDate: startDate,
      endDate: endDate,
      total: roomCount * days * data.cheapestPrice,
      roomNumber: roomCount,
    };

    try {
      const response = await axios.post('/order/create-order', order);
      console.log(response.data); // handle response as needed

      // Update the "sold" field in the villa schema
      const updatedSold = data.sold + roomCount;
      await axios.put(`/villas/update-sold/${id}`, { sold: updatedSold });

      setOpen(false);
      Swal.fire({
        title: "Success",
        text: "Order success! For now, please wait until your room is confirmed",
        icon: "success"
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error creating order", error);
      // handle error as needed
    }
  };

  return (
    <div className="reserve">
      <div className="w-[350px] h-[360px] bg-white rounded-[30px] relative">
        <p className="font-poppins ml-5 font-bold mt-5">Sold to</p>
        <p className="font-poppins font-semibold ml-10">Mr/Ms. {user.firstname}</p>
        <p className="font-poppins ml-10">{user.email}</p>
        <p className="font-poppins ml-10">{user.country}</p>
        <p className="font-bold font-poppins ml-5 mt-5">Booking information</p>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose absolute top-5 right-5 cursor-pointer"
          onClick={() => setOpen(false)}
        />
        <p className="font-poppins ml-10">
          {`Stay Duration: ${days} days`} 
        </p>
        <p className="font-poppins ml-10">
          {`Check-in Date: ${format(new Date(startDate), "MM/dd/yyyy")}`}
        </p>
        <p className="font-poppins ml-10">
          {`Check-out Date: ${format(new Date(endDate), "MM/dd/yyyy")}`}
        </p>
        <p className="font-poppins ml-10">
          {`Rooms: ${roomCount}`}
        </p>
        <p className="font-poppins mt-5 font-bold ml-5">{`Total: Rp.${roomCount * days * data.cheapestPrice}`}</p>
        <button className="ml-[25px] mt-[10px] font-poppins bg-blue-300 w-[300px] h-[30px] rounded-[20px] hover:bg-blue-500" onClick={handleOrderCreation}>Proceed to payment</button>
      </div>
    </div>
  );
};

export default Checkout;
