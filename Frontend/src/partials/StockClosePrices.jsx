import { useState, useContext } from "react";
import { AngleUpIcon, AngleDownIcon,MinusIcon } from "../icons";
import AuthContext from "../components/context/AuthContext";
import { setsEqual } from "chart.js/helpers";
export function StockClosePrice({ currentTicker, displayLocation }) {
  const [closePrice, setclosePrice] = useState();
  const fetchStockPrices = (ticker) => {
    //   const close_prices = [];
    try {
      fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
        .then((response) => response.json())
        .then((data) => {
          const close_prices = data.map((item) => item.close_price);
          let lastIndex = close_prices.length;
          let lastElement = close_prices[lastIndex - 1];
          setclosePrice(lastElement);
          //   return lastElement;
        });
    } catch (error) {
      return error;
    }
  };
  fetchStockPrices(currentTicker);
  return <p>Rs.{closePrice != null ? closePrice : "Loading.."}</p>;
}
// export function StockDetails({currentTicker}){
//   const [apiData,setapiData]=useState();
//   const {authTokens}=useContext(AuthContext)
//   const fetchStockDetails=(ticker)=>{
//     try{
//     const response = fetch(`http://127.0.0.1:8000/api/stock/${ticker}/`, {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + authTokens?.access,
//       },
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data =  response.json();
//     setapiData(data)
//   }
//  catch(error){
//   return error
// }

//   return()
// }
// }
export function StockPriceDiff({ currentTicker, displayLocation }) {
  const [priceDiff, setPriceDiff] = useState();
  const [isGain, setGain] = useState();
  const [isEqual,setEqual] = useState();
  const fetchStockPricesDiff = (ticker) => {
    //   const close_prices = [];
    try {
      fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
        .then((response) => response.json())
        .then((data) => {
          const close_prices = data.map((item) => item.close_price);
          let lastIndex = close_prices.length;
          let lastElement = close_prices[lastIndex - 1];
          // console.log(secondLastElement);
          const diffPercentage = () => {
            let secondLastElement = close_prices[lastIndex - 2];
            // console.log(secondLastElement);
            let percentageDiff =
              ((lastElement - secondLastElement) / secondLastElement) * 100;
            if (lastElement > secondLastElement) {
              setGain(true);
            } else if (lastElement == secondLastElement) {
              setEqual(true);
            } else {
              setGain(false);
            }
            function truncateDecimals(num, digits) {
              const multiplier = Math.pow(10, digits);
              return ~~(num * multiplier) / multiplier;
            }
            return truncateDecimals(percentageDiff, 2);
          };
          setPriceDiff(diffPercentage());
        });
    } catch (error) {
      return error;
    }
  };
  fetchStockPricesDiff(currentTicker);
  //   setPriceDiff(fetchStockPricesDiff(currentTicker));
  // return <p>{priceDiff!=null?priceDiff+"%":"Loading.."}</p>;
  if (displayLocation === "competitors-table") {
    return (
      <div>
        {isGain ? (
          <div className="flex items-center justify-center text-green-700">
            <div className="text-sm ">
              {priceDiff}
              {" %"}
            </div>
            <div className="font-bold">
              <AngleUpIcon className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-red-700">
            <div className="text-sm ">
              {priceDiff}
              {" %"}
            </div>
            <div className="font-bold ">
              <AngleDownIcon className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    );
  }
  if (displayLocation === "user-stock-table") {
    return (
      <div>
        {isGain ? (
          <div className="flex items-center justify-center text-green-700">
            <div className="text-sm ">
              +{priceDiff}
              {" %"}
            </div>
            <div className="font-bold">
              <AngleUpIcon className="h-4 w-4" />
            </div>
          </div>
        ) : isEqual ? (
          <div className="flex items-center justify-center text-black-700">
            <div className="text-sm ">
              {priceDiff}
              {" %"}
            </div>
            <div className="font-black rotate-90 ml-3">
              |
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-red-700">
            <div className="text-sm ">
              {priceDiff}
              {" %"}
            </div>
            <div className="font-bold ">
              <AngleDownIcon className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export function StockValue({ currentTicker, stockQuantity }) {
  // const [priceDiff, setPriceDiff] = useState();
  const [stockValue, setstockValue] = useState();
  const fetchStockPricesDiff = (ticker) => {
    //   const close_prices = [];
    try {
      fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
        .then((response) => response.json())
        .then((data) => {
          const close_prices = data.map((item) => item.close_price);
          let lastIndex = close_prices.length;
          let lastElement = close_prices[lastIndex - 1];
          // console.log(secondLastElement);
          function truncateDecimals(num, digits) {
            const multiplier = Math.pow(10, digits);
            return ~~(num * multiplier) / multiplier;
          }

          const calculateStockValue = () => {
            const quantity = stockQuantity;
            const total_value = lastElement * quantity;
            return truncateDecimals(total_value, 2);
          };
          setstockValue(calculateStockValue());
        });
    } catch (error) {
      return error;
    }
  };
  fetchStockPricesDiff(currentTicker);
  //   setPriceDiff(fetchStockPricesDiff(currentTicker));
  return <p>{stockValue != null ? "Rs. " + stockValue : "Loading.."}</p>;
}
// export default StockClosePrice
