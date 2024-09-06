import { useState } from "react";
import { hotelInputs } from "../constant";
import useFetch from "../hooks/useFetch";
import axios from "axios";

const Newproduct = () => {
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);

  const { data, loading, error } = useFetch("/api/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const base64Files = await Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }));

      const newHotel = {
        ...info,
        rooms,
        photos: base64Files,
      };

      await axios.post("/hotels", newHotel);
      alert("Hotel added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add hotel");
    }
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length > 0
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <select multiple id="rooms" onChange={(e) => setRooms([...e.target.selectedOptions].map(o => o.value))}>
                  {loading ? "loading..." : data && data.map(room => (
                    <option key={room._id} value={room._id}>{room.title}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newproduct;
