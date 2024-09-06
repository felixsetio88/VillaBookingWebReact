import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "./Find.css";
import Find_searchbar from "../component/Find_searchbar";
import Find_returnall from "../component/Find_returnall";
import styles from "../style";
import Navbar from "../component/Navbar";
const Find = () => {

  return (
    <div className={`mx-auto max-w-[1380px] justify-center items-center ${styles.paddingX} ${styles.flexCenter}`}>
    <div className={`${styles.boxWidth}`}>
    <>
    <Navbar />
    <Find_searchbar />
    <Find_returnall /></>
    </div>
    </div> 

  );
};

export default Find;
