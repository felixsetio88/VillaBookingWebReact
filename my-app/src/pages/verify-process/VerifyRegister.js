import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import styles from "../style";

function classNames(...classes){
    return classes.filter(Boolean).join(' ');
}

export default async function VerifyRegister(){
    const [credentials, setCredentials] = useState({
        email: undefined,
        verifyToken: undefined
    });
    const { user } = useContext(AuthContext);
    const { loading, error, dispatch } = useContext(AuthContext);
    const [errors, setErrors] = useState({
        email: false,
        verifyToken: false
    });
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setErrors({
            email: false,
            verifyToken: false
        });
    }
    const tokenAsNumber = Number(credentials.token);
    if(isNaN(tokenAsNumber)){
        Swal.fire({
            title: "Error",
            text: "Invalid token! Token must be a number.",
            icon: "error"
        });
        setErrors((prev) => ({ ...prev, verifyToken: true }));
        return;
    }
    dispatch({ type: "VERIFY_REGISTER_START" });
    try {
        const res = await axios.post("/auth/verify-register", {
            email: credentials.email,
            token: tokenAsNumber
        });
        dispatch({ type: "VERIFY_REGISTER_SUCCESS", payload: res.data.details });
        Swal.fire({
          title: "Success",
          text: "Verification successful! You will be redirected to the login page.",
          icon: "success",
        });
        navigate("/login");
    } catch(err){
        dispatch({ type: "VERIFY_REGISTER_FAILURE", payload: err.response.data });
        Swal.fire({
            title: "Error",
            text: err.response.data.message,
            icon: "error",
        });

        const validationErrors = {};
        let hasError = false;
        if(!credentials.email){
            validationErrors.email = true;
            hasError = true;
        }
        if(!credentials.token){
            validationErrors.token = true;
            hasError = true;
        }
        setErrors(validationErrors);
        if(hasError){
            return;
        }
    }

    if (loading)
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="border-[3px] rounded-[30px] w-[300px] h-[300px] mt-10 ml-10">
              <h2 className="font-poppins ml-10 mt-10 font-bold text-[40px]">
                Loading...
              </h2>
              <p className="font-poppins mt-10 ml-10 w-[220px]">
                Please wait, try to refresh if this page doesn't load up soon.
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
                Please Verify Your Account's Registration
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium font-poppins leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="email"
                      id="email"
                      value={credentials.email}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.email
                          ? "ring-red-500 focus:ring-red-600"
                          : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium font-poppins leading-6 text-gray-900"
                  >
                    Verification Token
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="token"
                      id="token"
                      value={credentials.token}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.token
                          ? "ring-red-500 focus:ring-red-600"
                          : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <button
                    disabled={loading}
                    onClick={handleClick}
                    className="flex w-full justify-center rounded-md bg-cyan-300 px-3 py-1.5 text-sm font-semibold font-poppins leading-6 text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Verify
                  </button>
                  {error && (
                    <span>
                      {error.message ||
                        (typeof error === "object" &&
                          JSON.stringify(error)) ||
                        "An unknown error occurred."}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    );
}