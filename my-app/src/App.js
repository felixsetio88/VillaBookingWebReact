import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyRegister from './pages/verify-process/VerifyRegister';
import Find from './pages/Find';
import Searchresult from "./pages/Searchresult";
import Moreinformation from "./pages/Moreinformation";
import AddProduct from "./pages/Addproduct";
import Test_display from "./pages/test_display";
import AdminOrdersPage from "./pages/Order_Admin";
import OrdersAdmin from "./pages/Order_Admin";
import MyOrders from "./pages/test_order";
import UpdateData from "./pages/UpdateData";
import MyInfo from "./pages/MyInfo";
import MyOrder from "./pages/test_myorder";
import Administrator_home from "./pages/Administrator_home";
import ManageProduct from "./pages/Admin_manageproduct";
import EditProduct from "./pages/Admin_editproduct";
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/update" element={<UpdateData/>}/>
        <Route path="/myinfo" element={<MyInfo/>}/>
        <Route path="/find" element={<Find/>}/>
        <Route path="/result" element={<Searchresult/>} />
        <Route path="/result/:id" element={<Moreinformation/>} />
        <Route path="/addproduct" element={<AddProduct/>} />
        <Route path="/orderdashboard" element={<OrdersAdmin/>} />
        <Route path="/allorder" element={<MyOrders/>} />
        <Route path="/myorder" element={<MyOrder/>} />
        <Route path="/adminhome" element={<Administrator_home/>} />
        <Route path="/manageproduct" element={<ManageProduct/>} />
        <Route path="/editproduct/:id" element={<EditProduct/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
