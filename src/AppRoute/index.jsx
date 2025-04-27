import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from '../Navbar/Navbar';
import Login from '../pages/Login';
import Registers from '../pages/Registers';
import PageNot from '../pages/PageNot';
import Dashboard from '../Admin/Dashboard';
import Home from '../pages/Home'

const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
   
    <Router>
      <MyNavbar/>
     {/* Navbar will be displayed on all pages */}
      <Routes>
        <Route path="/hackathon" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/registers" element={<Registers/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='*' element={<PageNot/>}/>
      
      </Routes>
    </Router>
  );
};

export default AppRoutes;
