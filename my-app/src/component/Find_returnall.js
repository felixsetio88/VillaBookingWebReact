import "./Find_returnall.css"
import useFetch from "../hooks/useFetch";
import { batubelig_bg, denpasar_bg, pererenan_bg } from "../assets";

const Find_returnall = () => {
  const { data } = useFetch(
    "/hotels/countByCity?cities=Denpasar,Pererenan,Batubolong"
  );
 return (
   <div>
    <h1 className="font-poppins text-[35px] font-bold mt-[60px]">Popular villas in Bali</h1>
   <div className="return">
    
       <div className="returnItem">
       <img
         src={denpasar_bg}
         alt=""
         className="returnImg"
       />
       <div className="returnTitles">
         <h1>{data[0]} Villas available</h1>
        
       </div>
       <h1 className="returnPrice">Denpasar area</h1>
     </div>
    
    
     <div className="returnItem">
       <img
         src={pererenan_bg}
         alt=""
         className="returnImg"
       />
       <div className="returnTitles">
         <h1>{data[1]} Villas available</h1>


       </div>
       <h1 className="returnPrice">Pererenan area</h1>
     </div>
     <div className="returnItem">
       <img
         src={batubelig_bg}
         alt=""
         className="returnImg"
       />
       <div className="returnTitles">
         <h1>{data[2]} Villas available</h1>


       </div>
       <h1 className="returnPrice">Batu Bolong area</h1>
     </div>
     
   </div>
   </div>
 )
}


export default Find_returnall
