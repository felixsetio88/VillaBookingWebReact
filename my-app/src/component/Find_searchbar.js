import { faBed, faCalendarDays, faCar, faPerson, faPlane, faTaxi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Find_searchbar.css";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { DateRange } from 'react-date-range';
import {useState} from 'react'
import {format} from "date-fns";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { people, search } from "../assets";
import { calendar } from "../assets";
const Find_searchbar = ({type}) => {
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [openDate,setOpenDate] = useState(false)

  const [openOptions,setOpenOptions]= useState(false)
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(SearchContext);
  const [options,setOptions]=useState({
    adult:1,
    children:0,
    room:1
  })

  const handleOption=(name,operation)=>{
    setOptions((prev)=>{
      return{
        ...prev,
        [name]:operation==="d"?options[name]-1:options[name]+1
      }
    })
  }


  const [destination,setDestination]=useState("")

  const navigate=useNavigate();


  const handleSearch=()=>{
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
      navigate("/result",{state:{destination,dates,options}})
  }

  return (
    <div className="header">
      <div className={type==="list"?"headerContainer listMode":"headerContainer"}>


        {type!=="list" && <>

    


        <div className="headerSearch">
            <div className="headerSearchItem">
                <img src={search} className="max-h-[18px]"></img>
                
                <input type="text" placeholder="Type here to search" className="headerSearchInput text-black" onChange={(e)=>setDestination(e.target.value)} />
            </div>

            <div className="headerSearchItem">
                <img src={calendar} className="max-h-[18px]"></img>
                <span onClick={()=>setOpenDate(!openDate)} className="headerSearchText">
                    {`${format(dates[0].startDate,"MM/dd/yyyy")} to ${format(dates[0].endDate,"MM/dd/yyyy")}`}
                </span>
                {
                  openDate && <DateRange
                  editableDateInputs={true}
                  onChange={item => setDates([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  className="date"
                  minDate={new Date()}
                />
                }
            </div>

            <div className="headerSearchItem">
            <img src={people} className="max-h-[18px]"></img>
                <span onClick={()=>setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adults · ${options.children} children · ${options.room} room}`}</span>
              {openOptions &&  <div className="options">
                    <div className="optionItem">
                        <span className="optionText">Adult</span>
                        <div className="optionCounter">
                          <button onClick={()=>handleOption("adult","d")} disabled={options.adult<=1} className="optionCounterButton">-</button>
                          <span className="optionCounterNumber">{options.adult}</span>
                          <button onClick={()=>handleOption("adult","i")} className="optionCounterButton">+</button>
                        </div>

                    </div>

                    <div className="optionItem">
                        <span className="optionText">Children</span>
                        <div className="optionCounter">
                          <button onClick={()=>handleOption("children","d")} disabled={options.children<=0}  className="optionCounterButton">-</button>
                          <span className="optionCounterNumber">{options.children}</span>
                          <button onClick={()=>handleOption("children","i")} className="optionCounterButton">+</button>
                        </div>

                    </div>

                    <div className="optionItem">
                        <span className="optionText">Room</span>
                        <div className="optionCounter">
                          <button onClick={()=>handleOption("room","d")} disabled={options.room<=1} className="optionCounterButton">-</button>
                          <span className="optionCounterNumber">{options.room}</span>
                          <button onClick={()=>handleOption("room","i")} className="optionCounterButton">+</button>
                        </div>

                    </div>
                </div>}
            </div>

            <div className="headerSearchItem">
                <img src={search} className="max-h-[18px]" onClick={()=>handleSearch()}></img>
            </div>
        </div>
        </>}
      </div>
        
    </div>
  )
}

export default Find_searchbar