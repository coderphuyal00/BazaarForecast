import { useState, useEffect, useContext } from "react";
import { useAuth } from "./context/AuthContext";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function useLocalStorage(baseKey, initialValue) {
  const { user, userDetails } = useAuth();
  const [userSpecificKey, setUserSpecificKey] = useState(null);
  // console.log(userDetails);
  // const userSpecificKey=userDetails?.id ? `${baseKey}_${userDetails.id}` : null;
  // useEffect(()=>{
  //   setUserSpecificKey(()=>{
  //     userDetails?.id
  //   },[userDetails])
  // })
  useEffect(() => {
    async function setKeyWithDelay() {
      await sleep(5000); // wait 5 seconds
      if (userDetails!=undefined && (userDetails.id!="")) {
        setUserSpecificKey(`${baseKey}_${userDetails.id || userDetails.first_name}`);
      } else {
        setUserSpecificKey(baseKey);
      }
    }
    setKeyWithDelay();
  }, [userDetails, baseKey]);
  const [storedValue, setStoredValue] = useState(() => {
    if(userSpecificKey){
    try {
      const item = window.localStorage.getItem(userSpecificKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }
  });

  useEffect(() => {
    if (userDetails.id === undefined) return;
    if (storedValue === undefined) return;
    if(userSpecificKey){
    try {
      window.localStorage.setItem(userSpecificKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }
  }, [userSpecificKey, storedValue, userDetails?.id]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
