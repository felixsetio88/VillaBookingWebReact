import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from "../../style";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function VerifyPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ 
    email: false,
    token: false,
    newPassword: false,
    confirmPassword: false 
  });
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('targetedEmail');
    if(storedEmail){
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    if(e.target.id === "token"){
      setToken(e.target.value);
    } else if(e.target.id === "newPassword"){
      setNewPassword(e.target.value);
    } else if(e.target.id === "confirmPassword"){
      setConfirmPassword(e.target.value);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErrors({ 
      email: false,
      token: false,
      newPassword: false,
      confirmPassword: false
    });
    dispatch({ type: "VERIFY_RESET_PASSWORD_START" });
    try {
      const res = await axios.post("/auth/verify-reset-password", { email, token, newPassword, confirmPassword });
      dispatch({ type: "VERIFY_RESET_PASSWORD_SUCCESS", payload: res.data });
      Swal.fire({
        title: "Success",
        text: "Password has been resetted. Redirect to the login page.",
        icon: "success"
      });
      navigate("/login");
    } catch(err){
      dispatch({ type: "VERIFY_RESET_PASSWORD_FAILURE", payload: err.response.data });
      if(err.response.data.message === "Invalid reset password token! Please try again!"){
        Swal.fire({
          title: "Error",
          text: err.response.data.message || "Failed to reset the password.",
          icon: "error"
        });
      } else if(err.response.data.message === "Too many incorrect attempts! Please try it again later."){
        Swal.fire({
          title: "Error",
          text: err.response.data.message || "Failed to reset the password.",
          icon: "error"
        });
        navigate("/login");
      } else if(err.response.data.message === "New password and confirmation password does not match."){
        Swal.fire({
          title: "Error",
          text: err.response.data.message || "Failed to reset the password.",
          icon: "error"
        });
      }

      const validationErrors = {};
      let hasError = false;

      if(!token || isNaN(token)){
        validationErrors.token = true;
        hasError = true;
      }
      if(!newPassword){
        validationErrors.newPassword = true;
        hasError = true;
      }
      if(!confirmPassword){
        validationErrors.confirmPassword = true;
        hasError = true;
      }
      setErrors(validationErrors);
      if(hasError){
        return;
      }
    }
  };

  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center font-poppins text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Verify Your Account's Password
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
                      placeholder="Example: drake@gmail.com"
                      id="email"
                      value={email}
                      onChange={handleChange}
                      readOnly={true}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.email ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
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
                      placeholder="Example: 829211"
                      id="token"
                      value={token}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.token ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium font-poppins leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="newPassword"
                      placeholder="Your New Password"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.newPassword ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium font-poppins leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      placeholder="Confirmation New Password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      className={classNames(
                        "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        errors.confirmPassword ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleClick}
                    className="flex w-full justify-center rounded-md bg-cyan-300 px-3 py-1.5 text-sm font-semibold font-poppins leading-6 text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
