import { useContext } from 'react'
import {Route,Navigate,Outlet } from 'react-router-dom'
import AuthContext from '../components/context/AuthContext'

const PrivateRoute=({children})=>{
    const { user } = useContext(AuthContext);
    // console.log('Private Route')
    // console.log(user)

  if (!user) {
    // If no user, redirect to signin page
    return <Navigate to="/signin" replace />;
  }
  
  // If user exists, render the children components (protected page)
  return <Outlet/>;
}
export default PrivateRoute