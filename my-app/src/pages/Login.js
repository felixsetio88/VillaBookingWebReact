import logo from "../assets/logo.png"
import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../component/Navbar"
import styles from "../style"
export default function Login() {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });
  const { user } = useContext(AuthContext); 
  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      Swal.fire({
        title: "Success",
        text: "Login success, you will be redirected to home page!",
        icon: "success"
      });
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">
  <div className="border-[3px] rounded-[30px] w-[300px] h-[300px] mt-10 ml-10">
    <h2 className="font-poppins ml-10 mt-10 font-bold text-[40px]">Loading...</h2>
    <p className="font-poppins mt-10 ml-10 w-[220px]">
      Please wait, try to refresh if this page doesn't load up soon.
    </p>
  </div>
</div>;
  if (error) return <p>Error: {error}</p>;
  if (user.firstname)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-[3px] rounded-[30px] w-[300px] h-[300px] mt-10 ml-10">
          <h2 className="font-poppins ml-10 mt-10 font-bold text-[40px]">Sorry</h2>
          <p className="font-poppins mt-5 ml-10 w-[220px]">
            You cannot access this page because you're already logged in! <a className="font-bold" href="/">Click here </a> 
            to go back to home screen. If you need to log out, go to <a className="font-bold" href="/myinfo">My info </a> page
          </p>
        </div>
      </div>
    );

    return (
      
      <>
<div className={`${styles.paddingX} ${styles.flexCenter}`}>
    <div className={`${styles.boxWidth}`}>
        <Navbar />
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            
            <h2 className="mt-10 text-center font-poppins text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium font-poppins leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="email"
                    id="email"
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 font-poppins shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium font-poppins leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold font-poppins text-black hover:text-cyan-300">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                     type="password"
                     placeholder="password"
                     id="password"
                     onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 font-poppins shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  disabled={loading} onClick={handleClick}
                  className="flex w-full justify-center rounded-md bg-cyan-300 px-3 py-1.5 text-sm font-semibold font-poppins leading-6 text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
                {error && <span>{error.message}</span>}
              </div>
            </form>
  
            <p className="mt-10 text-center font-poppins text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/register" className="rounded-md bg-cyan-300 px-3.5 py-2.5 text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign Up
              </a>
            </p>
          </div>
        </div>
        </div>
    </div>
      </>
    )
  }