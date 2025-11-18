import { useState, useContext, useEffect } from "react";
import { AngleUpIcon, AngleDownIcon, MinusIcon } from "../icons";
import AuthContext from "../components/context/AuthContext";
import { setsEqual } from "chart.js/helpers";
export function StockClosePrice({ TickerPrice, displayLocation }) {
  const [closePrice, setclosePrice] = useState();
  useEffect(() => {
    try {
      const prices = TickerPrice;
      const todayClosePrice = prices.at(-1).close_price.toFixed(2);
      setclosePrice(todayClosePrice);
    } catch (error) {
      return error;
    }
  }, [TickerPrice]);

  return <p>Rs.{closePrice != null ? closePrice : "Loading.."}</p>;
}

export function StockPriceDiff({ TickerPrices, displayLocation }) {
  const [priceDiff, setPriceDiff] = useState();
  const [isGain, setGain] = useState();
  const [isEqual, setEqual] = useState();

  useEffect(() => {
    try {
      const prices = TickerPrices;
      const todayClosePrice = prices[prices.length - 1].close_price;
      const yesterdayClosePrice = prices[prices.length - 2].close_price;

      const priceDifference =
        ((todayClosePrice - yesterdayClosePrice) / yesterdayClosePrice) * 100;
      // console.log(secondLastElement);

      if (todayClosePrice > yesterdayClosePrice) {
        setGain(true);
      } else if (todayClosePrice == yesterdayClosePrice) {
        setEqual(true);
      } else {
        setGain(false);
      }

      setPriceDiff(priceDifference.toFixed(2));
    } catch (error) {
      return error;
    }
  }, [TickerPrices]);

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
            <div className="font-black rotate-90 ml-3">|</div>
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
export function StockValue({ TickerPrices, stockQuantity }) {
  // const [priceDiff, setPriceDiff] = useState();
  const [stockValue, setstockValue] = useState();
  useEffect(() => {
    try {
      const prices = TickerPrices;
      const todayClosePrice = prices[prices.length - 1].close_price;      

      const calculateStockValue = () => {
        const quantity = stockQuantity;
        const total_value = todayClosePrice * quantity;
        return total_value.toFixed(2);
      };
      setstockValue(calculateStockValue());
    } catch (error) {
      return error;
    }
  }, [TickerPrices]);
  //   setPriceDiff(fetchStockPricesDiff(currentTicker));
  return <p>{stockValue != null ? "Rs. " + stockValue : "Loading.."}</p>;
}
// export default StockClosePrice
