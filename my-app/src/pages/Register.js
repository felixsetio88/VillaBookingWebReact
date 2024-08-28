import { useContext, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import styles from '../style'
import Navbar from '../component/Navbar'
import { eachMonthOfInterval } from 'date-fns'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Register() {
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({
    firstname: false,
    email: false,
    passportNo: false,
    country: false,
    phone: false,
    password: false,
  })
  const [credentials, setCredentials] = useState({
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    passportNo: undefined,
    country: undefined,
    phone: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErrors({
      firstname: false,
      email: false,
      passportNo: false,
      country: false,
      phone: false,
      password: false,
    });

    dispatch({ type: "REGISTER_START" });
    try {
      const res = await axios.post("/auth/register", credentials);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data.details });
      localStorage.setItem('registeredEmail', credentials.email);
      Swal.fire({
        title: "Success",
        text: "Succesfully created the account! Please complete the verification process to finalize your account.",
        icon: "success"
      });
      navigate("/verify-account"); // Change it to navigate("/verify-account");
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE", payload: err.response.data });
      Swal.fire({
        title: "Error",
        text: err.response.data.message || "Registration Failed.",
        icon: "error"
      })

      const validationErrors = {};
      let hasError = false;
      if (!credentials.firstname) {
        validationErrors.firstname = true;
        hasError = true;
      }
      if (!credentials.email) {
        validationErrors.email = true;
        hasError = true;
      }
      if (!credentials.passportNo) {
        validationErrors.passportNo = true;
        hasError = true;
      }
      if (!credentials.phone) {
        validationErrors.phone = true;
        hasError = true;
      }
      if (!credentials.country){
        validationErrors.country = true;
        hasError = true;
      }
      if (!credentials.password) {
        validationErrors.password = true;
        hasError = true;
      }
      setErrors(validationErrors);
      if(hasError){
        return;
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
        <h2 className="text-[30px] font-poppins font-bold tracking-tight text-gray-900 sm:text-4xl">Register</h2>
        <p className="mt-2 text-[20px] font-poppins leading-8 text-gray-600">
          Fill in all the blank to register a new account
        </p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstname" className="block font-poppins text-sm font-semibold leading-6 text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="firstname"
                id="firstname"
                onChange={handleChange}
                autoComplete="given-name"
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.firstname ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="lastname"
                id="lastname"
                onChange={handleChange}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder='example@mail.com'
                autoComplete="email"
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.email ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
            
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2.5">
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                autoComplete="password"
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.password ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
            
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="country" className="block text-sm font-semibold font-poppins leading-6 text-gray-900">
              Country of origin
            </label>
            <div className="mt-2.5">
              <input
                type="country"
                name="country"
                id="country"
                onChange={handleChange}
                autoComplete="organization"
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.country ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
          </div>
          
          

          <div className="sm:col-span-2">
            <label htmlFor="passportNo" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Passport or ID Number 
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="passportNo"
                id="passportNo"
                onChange={handleChange}
                placeholder=''
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.passportNo ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
            
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                autoComplete="phone"
                onChange={handleChange}
                placeholder='Format: Country code + Phone number'
                className={classNames(
                  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.phone ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-indigo-600"
                )}
              />
            </div>
          </div>
          
         
          <div as="div" className="flex gap-x-4 sm:col-span-2">
            
            <label className="text-sm font-poppins leading-6 text-gray-600">
              By clicking "Register" button, you're agree with our {' '}
              <a href="/privacypolicy" className="font-bold font-poppins hover:bg-grey-100">
                privacy&nbsp;policy
              </a>
              .
            </label>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading} onClick={handleClick}
            className="block w-full rounded-md bg-cyan-300 px-3.5 py-2.5 text-center text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
          {error && <span>{error.message}</span>}
        </div>
      </form>
    </div>
    </div>
    </div>
  )
}