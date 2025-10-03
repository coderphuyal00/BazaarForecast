import { createContext, useState, useEffect } from "react";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const tokensFromStorage = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

  const [authTokens, setAuthTokens] = useState(tokensFromStorage);
  const [user, setUser] = useState(
    tokensFromStorage ? tokensFromStorage.access : null
  );
  const [loading, setLoading] = useState(true);
  const [userDetailData, setUserDetailData] = useState({
    id:"",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });
  // const history=useHistory()

  let loginUser = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.email.value,
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      if (!response.ok) {
        // Handle errors
        const errorData = await response.json();
        console.error("Error:", errorData);
      } else {
        const result = await response.json();
        setAuthTokens(result);
        setUser(result.access);
        // console.log(result.access)
        localStorage.setItem("authTokens", JSON.stringify(result));

        // console.log('Success:', result);
      }
    } catch {
      alert("Please start backend server i.e. django");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };
  useEffect(() => {
    if (authTokens) {
      localStorage.setItem("authTokens", JSON.stringify(authTokens));
      setUser(authTokens.access);
    } else {
      localStorage.removeItem("authTokens");
      setUser(null);
    }
  }, [authTokens]);
  //  const login = (userData) => setUser(userData);
  // console.log(user)
  const updateTokens = async () => {
    // console.log('Updated Token.')
    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });
    if (!response.ok) {
      // Handle errors
      // const errorData = await response.json();

      logoutUser();

      // console.error("Error:", errorData);
    } else {
      const result = await response.json();
      setAuthTokens(result);
      setUser(result.access);
      // console.log(result.access)
      localStorage.setItem("authTokens", JSON.stringify(result));

      // console.log('Success:', result);
    }
    if (loading) {
      setLoading(false);
    }
  };
  // const userDetails =  () => {
  //   const response =  fetch("http://127.0.0.1:8000/api/user/detail/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + authTokens?.access,
  //     },
  //   });
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }
  //   const data =  response.json();
  //   setUserDetailData(data);
  //   return apiData;
  // };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/detail/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authTokens?.access,
          },
        });
        let data = await response.json();
        if (response.status === 200) {
          setUserDetailData({
            id:data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            username: data.username,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, [user]);
  const fetchDataOncePerDay = async () => {
    const cacheKey = "nepseChartData";
    const cacheTimestampKey = "nepseChartDataTimestamp";

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    const now = new Date();

    if (cachedData && cachedTimestamp) {
      const cachedDate = new Date(cachedTimestamp);
      const diffInDays = (now - cachedDate) / (1000 * 60 * 60 * 24);

      if (diffInDays < 1) {
        return JSON.parse(cachedData);
      }
    }

    // Fetch new data from API
    const response = await fetch(
      "http://127.0.0.1:8000/api/index-price/nepse/"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();

    // Save to localStorage with current timestamp
    localStorage.setItem(cacheKey, JSON.stringify(apiData));
    localStorage.setItem(cacheTimestampKey, now.toISOString());

    return apiData;
  };

  useEffect(() => {
    if (loading) {
      updateTokens();
    }
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateTokens();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    fetchDataOncePerDay: fetchDataOncePerDay,
    userDetails: userDetailData,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
