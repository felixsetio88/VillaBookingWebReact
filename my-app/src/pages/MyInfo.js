
import Navbar from "../component/Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../style";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MyInfo() {
    const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    Swal.fire({
        title: "Success",
        text: "Log out success!",
        icon: "success"
      });
  };
  return (
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
    <div className={`${styles.boxWidth}`}>
        <Navbar />
    <div>
      <div className="px-4 sm:px-0">
        <h1 className=" font-poppins mt-5 text-[35px] font-semibold text-gray-900">Your Information</h1>
        <p className="mt-1 max-w-2xl font-poppins text-sm leading-6 text-gray-500">Your personal information</p>
      </div>
      <div className="mt-6 border-t font-poppins border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">First name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.firstname}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Last name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.lastname}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Passport number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.passportNo}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Country</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.country}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Phone number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.phone}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Member since</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.createdAt}</dd>
          </div>
        <div className="px-4 sm:px-0">
            <h1 className="font-poppins mt-10 text-[35px] font-semibold text-gray-900">Need something regarding your account?</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Need to update your information? <a className="font-bold" href="/update"> click here </a></p> 
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Want to logout? <a className="font-bold" onClick={handleLogout}> click here</a> to logout </p> 
        </div>
        <div className="px-4 sm:px-0">
            <h1 className="font-poppins mt-10 text-[35px] font-semibold text-gray-900">Frequently asked questions</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Q: I have updated my information successfully, but why my information shown in this website is not updated? </p> 
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">A: You have to log out, and then log in again. Afterwards, your information shown in this website will be updated.</p> 
        </div>
        </dl>
      </div>
    </div>
    </div>
    </div>
  )
}