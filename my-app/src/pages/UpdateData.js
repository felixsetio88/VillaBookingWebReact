import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from '../style';
import Navbar from '../component/Navbar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function UpdateUserInfo() {
  const [disabledFields, setDisabledFields] = useState(true); 
  const [isValidated, setIsValidated] = useState(false);
  const [emailPassword, setEmailPassword] = useState({ email: '', password: '' });
  const [credentials, setCredentials] = useState({
    firstname: '',
    lastname: '',
    email: '',
    passportNo: '',
    country: '',
    phone: ''
  });

  const { user, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleEmailPasswordChange = (e) => {
    setEmailPassword((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    if(user){
      setCredentials({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        passportNo: user.passportNo,
        country: user.country,
        phone: user.phone
      })
    }
  }, [user]);

  const handleValidation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/check/", emailPassword);
      if(res.status === 200){
        Swal.fire({
            title: "Success",
            text: "You can now update your information!",
            icon: "success"
          });
        setDisabledFields(false);
        setIsValidated(true);
      } 
    } catch (err){
      if(err.response){
        Swal.fire({
          title: "Error",
          text: err.response.data.message,
          icon: "error"
        })
      } else {
        Swal.fire({
          title: "Error",
          text: "Validation failed!",
          icon: "error"
        });
      }
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (credentials.firstname === "" && credentials.lastname  === "" && credentials.email  === "" && credentials.passportNo === "" && credentials.country === "" && credentials.phone === ""){
        Swal.fire({
            title: "Error",
            text: "You must fill in all the field!",
            icon: "error"
        })
    }
    else {
      try {
        const res = await axios.put(`/users/${user._id}`, credentials);
        if(res.status === 200){
          Swal.fire({
            title: "Success",
            text: "Successfully updated the information! Please re-login from the system to ensure that your biodata has been updated.",
            icon: "success"
          });
          navigate("/myinfo");
        }
      } catch (err) {
        console.log(err);
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
            <h2 className="text-[30px] font-poppins font-bold tracking-tight text-gray-900 sm:text-4xl">Update Information</h2>
            <p className="mt-2 text-[20px] font-poppins leading-8 text-gray-600">
              Confirm your email and password to edit your information.
            </p>
          </div>
          <form className="mx-auto mt-16 max-w-xl sm:mt-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleEmailPasswordChange}
                    disabled={isValidated}
                    placeholder='example@mail.com'
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="password" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="password"
                    name="password"
                    id="password"
                    onChange={handleEmailPasswordChange}
                    disabled={isValidated}
                    placeholder='Enter your password'
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  onClick={handleValidation}
                  disabled={isValidated}
                  className="block w-full rounded-md bg-cyan-300 px-3.5 py-2.5 text-center text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Confirm
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mt-10">
              <div>
                <label htmlFor="firstname" className="block font-poppins text-sm font-semibold leading-6 text-gray-900">
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={credentials.firstname}
                    onChange={handleChange}
                    disabled={disabledFields}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={credentials.lastname}
                    onChange={handleChange}
                    disabled={disabledFields}
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
                    required
                    type="email"
                    name="email"
                    id="email"
                    value={credentials.email}
                    onChange={handleChange}
                    disabled={disabledFields}
                    placeholder='example@mail.com'
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="passportNo" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Passport or ID Number
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="passportNo"
                    id="passportNo"
                    value={credentials.passportNo}
                    onChange={handleChange}
                    disabled={disabledFields}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Country of origin
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="country"
                    id="country"
                    value={credentials.country}
                    onChange={handleChange}
                    disabled={disabledFields}
                    autoComplete="organization"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-poppins font-semibold leading-6 text-gray-900">
                  Phone number
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="tel"
                    name="phone"
                    id="phone"
                    value={credentials.phone}
                    onChange={handleChange}
                    disabled={disabledFields}
                    placeholder='Format: Country code + Phone number'
                    autoComplete="phone"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading || disabledFields} 
                  onClick={handleClick}
                  className="block w-full rounded-md bg-cyan-300 px-3.5 py-2.5 text-center text-sm font-poppins font-semibold text-black shadow-sm hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update Information
                </button>
                {error && <span>{error.message}</span>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
