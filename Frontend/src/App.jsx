import React, { useEffect } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages

import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/AuthPages/SignIn";
import SignInForm2 from "./components/auth/SignInForm2";
import { AuthProvider } from "./components/context/AuthContext";
import { StockDataProvider } from "./components/context/StockDataContext";
import PrivateRoute from './utils/PrivateRoute'
import UserDetails from "./pages/UserDetails";
import SignUpForm from './components/auth/SignUpForm'
import UserProfile1 from "./components/UserProfile"
import UserInfoCard from "./components/UserProfile/UserInfoDetails";
import UserProfile from "./pages/UserProfile";
import StockDetails from "./pages/StockDetails";
import UserStocks from "./pages/UserStocks";
function App() {
  // const location = useLocation();

  // useEffect(() => {
  //   document.querySelector('html').style.scrollBehavior = 'auto'
  //   window.scroll({ top: 0 })
  //   document.querySelector('html').style.scrollBehavior = ''
  // }, [location.pathname]); // triggered on route change

  return (
    <>
    
      <AuthProvider>
        <StockDataProvider>
        <Router>
          <Routes>
              <Route element={<PrivateRoute />}>

                <Route exact path="/" element={<Dashboard />} />
                
                <Route path="/user-details" element={<UserDetails />} />
                <Route path="profile/" element={<UserProfile />} />
                <Route path="stock/:ticker" element={<StockDetails />} />
                <Route path="my-stocks/" element={<UserStocks />} />
              </Route>
              <Route path="signin/" element={<SignIn />} />
              <Route path="signup/" element={<SignUpForm />} />
          </Routes> 
        </Router>
        </StockDataProvider>
      </AuthProvider>
    </>
  );
}

export default App;

