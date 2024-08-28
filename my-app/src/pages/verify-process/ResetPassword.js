import { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navbar";
import styles from "../../style";

function classNames(...classes){
  return classes.filter(Boolean).join(' ');
}

export default function ResetPassword(){
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    email: false,
  });
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setErrors({
      email: false,
    });
    dispatch({ type: "RESET_PASSWORD_START" });

    try {
      const res = await axios.post("/auth/reset-password", { email });
      dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: res.data.details });
      localStorage.setItem('targetedEmail', email);
      Swal.fire({
        title: "Success",
        text: "Reset password token has been sent. Please check your email inbox.",
        icon: "success"
      });
      navigate("/verify-reset-password");
    } catch(err){
      dispatch({ type: "RESET_PASSWORD_FAILURE", payload: err.response.data });
      Swal.fire({
        title: "Error",
        text: err.response.data.message || "Failed to proceed Reset Password.",
        icon: "error"
      });

      let hasError = false;
      if(!email){
        setErrors({
          email: true
        });
        hasError = true;
      }

      if(hasError){
        return;
      }
    }
  }

  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center font-poppins text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Your Password
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
                      value={email}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.email ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleClick}
                    className="flex w-full justify-center rounded-md bg-cyan-300 px-3 py-1.5 text-sm font-semibold font-poppins leading-6 text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Reset Password
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center font-poppins text-sm text-gray-500">
                Remember your password?{' '}
                <a
                  href="/login"
                  className="rounded-md bg-cyan-300 px-3.5 py-2.5 text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
