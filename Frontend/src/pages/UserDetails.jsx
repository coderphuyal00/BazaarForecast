import {useEffect,useState,useContext} from 'react';
import AuthContext from '../components/context/AuthContext';

function UserDetails(){
    const[userDetails,setUserDetails]=useState()
    const {authTokens,logoutUser}=useContext(AuthContext)

    useEffect(()=>{
        getUserDetails()
    },[authTokens])

    const getUserDetails = async()=>{
        let response =await fetch('http://127.0.0.1:8000/api/user-detail/',{
            method:'GET',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ String(authTokens.access)
            }
        })
        let data=await response.json()
        if(response.status===200){
            console.log(data)
            setUserDetails(data)
        }else{
            // logoutUser()
        }
        
    }
    console.log(userDetails)
    return(
        <div>
            <ul>                
                    {/* <li key={userDetails.id}>{userDetails[0].email}</li> */}
                    {/* <li>Name</li> */}
            </ul>
        </div>
    )
}

export default UserDetails