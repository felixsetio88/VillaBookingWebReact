import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { villaInputs } from "../constant";
import { FileInput, Label } from "flowbite-react";
import { AuthContext } from "../context/AuthContext";
import { useContext} from "react";
import Swal from 'sweetalert2'
import useFetch from "../hooks/useFetch";
import styles from "../style";
import Navbar from "../component/Navbar";
import axios from "axios";

const Addproduct = () => {
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/api/villas");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for(const e in info){
        formData.append(e, info[e]);
      }

      files.forEach(file => formData.append('photos', file));
      await axios.post("/villas/createWithPhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      Swal.fire({
        title: "Success",
        text: "Your product registration success!",
        icon: "success"
      });
      navigate("/adminhome");
    } catch (err) {
      console.error(err);
      if(err.response && err.response.data && err.response.data.message){
        Swal.fire({
          title: "Failed",
          text: err.response.data.message,
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: "Sorry, your product has not been added, it is possible that you are not using an admin account.",
          icon: "error"
        });
      }
    }
  };

  return (
    <div className={`bg-white ${styles.paddingX} ${styles.flexCenter}`}>
    <div className={`${styles.boxWidth}`}>
        <Navbar />
    <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[30px] font-poppins font-bold tracking-tight text-gray-900 sm:text-4xl">New Product Registration</h2>
        <p className="mt-2 text-[20px] font-poppins leading-8 text-gray-600">
          You must have an admin account to continue.
        </p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstname" className="block font-poppins text-sm font-semibold leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Type
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="type"
                id="type"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="firstname" className="block font-poppins text-sm font-semibold leading-6 text-gray-900">
              City
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="city"
                id="city"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Address
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="address"
                id="address"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="firstname" className="block font-poppins text-sm font-semibold leading-6 text-gray-900">
              Distance from nearest beach
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="distance"
                id="distance"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="title"
                id="title"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2.5">
              <textarea
                type="text"
                name="description"
                id="desc"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            
          </div>
  
          <div className="sm:col-span-2">
            <label htmlFor="country" className="block text-sm font-semibold font-poppins leading-6 text-gray-900">
              Price
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="Price"
                id="cheapestPrice"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
                <label
                  htmlFor="featured"
                  className="block text-sm font-poppins font-semibold leading-6 text-gray-900"
                >
                  Featured?
                </label>
                <div className="mt-2.5">
                  <select
                    name="featured"
                    id="featured"
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

          
          
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Upload Image
            </label>
            <FileInput
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileChange}
                />
           <img
            className="mt-5 w-[300px]"
              src={
                files.length > 0
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          
         

        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading} onClick={handleClick}
            className="block w-full rounded-md bg-cyan-300 px-3.5 py-2.5 text-center text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
          
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Addproduct;
