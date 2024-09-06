import { useState } from "react";
import { naviLinks } from "../constant";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logo } from "../assets/";
export default function Navbar(){
  const {user} = useContext(AuthContext);
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const loggedInUser = user ? user.firstname : 'Guest'; 

    return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="villa nyaman" className="w-[225px] h-[123px]"></img>

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {naviLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-semibold cursor-pointer text-[16px] ${
              active === nav.title ? "text-black" : "text-black"
            } ${index === naviLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`${nav.id}`}>{nav.title}</a>
          </li>
        ))}
       
        {
          
          user ? <p className="font-poppins font-bold ml-10"> <a href="/myinfo">Welcome back! {loggedInUser}</a></p> : (
            <p className="font-poppins font-bold ml-10">Login for more</p>
          )
        }
    
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <button
          onClick={() => setToggle(!toggle)}
          className="text-black font-bold text-[20px] focus:outline-none"
        >
          {toggle ? "Close" : "Menu"}
        </button>

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-blue-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="bg-cyan-300 w-[130px] h-[250px] rounded-[10px] list-none flex justify-end items-start flex-1 flex-col">
            {naviLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins ml-5 font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-black" : "text-black"
                } ${index === naviLinks.length - 1 ? "mb-0" : "mb-5"}`}
                onClick={() => {
                  setActive(nav.title);
                  setToggle(false); 
                }}
              >
                <a href={`${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
    )
}