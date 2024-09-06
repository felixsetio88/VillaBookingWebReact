import { useState } from "react";
import { naviLinks } from "../constant";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logo } from "../assets/";

export default function Navbar(){
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const loggedInUser = user ? user.firstname : 'Guest'; 

  const filteredNaviLinks = user ? [...naviLinks.filter((e) => e.title !== "Login" && e.title !== "Register")] : naviLinks.filter((e) => e.title !== "My Orders");

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="villa nyaman" className="w-[225px] h-[123px]"></img>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {filteredNaviLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-semibold cursor-pointer text-[16px] ${
              active === nav.title ? "text-black" : "text-dimWhite"
            } ${index === filteredNaviLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`${nav.id}`}>{nav.title}</a>
          </li>
        ))}   
        {
          user ? <p className="font-poppins font-bold ml-10"> <a href="/myinfo">{loggedInUser}</a></p> : (
            <p className="font-poppins font-bold ml-10">Guest</p>
          )
        }
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <button
          onClick={() => setToggle(!toggle)}
          className="text-dimWhite focus:outline-none"
        >
          {toggle ? "Close" : "Menu"}
        </button>

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-blue-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {filteredNaviLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === filteredNaviLinks.length - 1 ? "mb-0" : "mb-4"}`}
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