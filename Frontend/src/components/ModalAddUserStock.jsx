import React, { useRef, useEffect, useContext, useState } from "react";
import Transition from "../utils/Transition";
import StockDataContext from "./context/StockDataContext";
import CompanyTicker from "../../company_list.json";
import { CloseIcon } from "../icons";
import AuthContext from "./context/AuthContext";
import useLocalStorage from "./LocalStorageHandler";
import { Button, Input } from "@material-tailwind/react";
// import fetchStocks from '../pages/StockDetails'
function ModalAddUserStock({ id, modalOpen, setModalOpen }) {
  const { fetchStocks } = useContext(StockDataContext);
  const modalContent = useRef(null);
  const { authTokens } = useContext(AuthContext);
  const [inputStock, setInputStock] = useState("");
  const [inputStockQuantity, setInputStockQuantity] = useState("");
  const [inputStockBuyPrice, setInputStockBuyPrice] = useState("");
  const [inputStockPurchaseDate, setInputStockPurchaseDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionId, setSuggestionID] = useState();
//   const [inputValue, setInputValue] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [stocks, setStocks] = useLocalStorage("stockWatchlist", []);

  // Load watchlist from local storage on initial mount

  // close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target,e }) => {
  //     if (!modalOpen || modalContent.current.contains(target)) return;
  //     setInputValue("")
  //     setModalOpen(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setInputValue("");
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  // close if the enter key is pressed
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (!modalOpen || key !== "Enter") return;
      setInputValue("");
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleCloseButton=()=>{

  }
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputStock(value);

    if (value.length > 0) {
      const filteredSuggestions = CompanyTicker.filter((obj) =>
        obj.item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, suggestion_id) => {
    setInputStock(suggestion);
    if (suggestion_id != "") {
      setSuggestionID(suggestion_id);
    }

    setSuggestions([]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (suggestionId != "") {
      try {
        let response = await fetch(
          "http://127.0.0.1:8000/api/user/stocks/add/",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + authTokens?.access,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: suggestionId,
              quantity:inputStockQuantity,
              buy_price:inputStockBuyPrice,
              purchase_date:inputStockPurchaseDate
            }),
          }
        );
        let data = await response.json();
        if (response.status === 200) {
          console.log("Stock added on user stock list.");
          console.log(data);
        } else {
          console.error("Error:", data);
        }
      } catch (error) {
        console.error(error);
      }
      
    }
    // console.log(inputStockPurchaseDate)

    // if (suggestionId != "") {
    //   let apiData = await fetchStocks(inputValue);
    //   // console.log(apiData)
    //   addStock(inputValue);
    //   window.location.reload();
    // }
    //  console.log(stocks)
  };
  const handleSubmit = async (e) => {
    if (inputStock == "") {
      alert("Please select a stock");
    } else {
      await handleClick(e);
      window.location.reload();
    }
    // if (user) {
    //   navigate("/", { replace: true });
    // }
  };
  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white flex justify-between dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-ful max-h-full rounded-lg shadow-lg"
        >
          {/* Search form */}

          <div className="items-center justify-between relative">
            <button
              title="Close"
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-300/50  dark:lg:hover:bg-gray-700/50 rounded-full ml-3 absolute top-0 right-0`}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
                setInputStock("")
                setInputStockQuantity("")
                setInputStockBuyPrice("")
                setInputStockPurchaseDate("")
              }}
              aria-controls="close-search-modal"
            >
              <CloseIcon className="text-gray-900 dark:text-gray-100 text-xl" />
            </button>
            <form
              className="p-5 items-center justify-between"
              action=""
              onSubmit={handleSubmit}
            >
              <label className="font-semibold text-xs" for="stock-ticker">
                Stock
              </label>
              <Input
                variant="outlined"
                type="text"
                placeholder="Stock Ticker"
                value={inputStock}
                name="stock-ticker"
                // onChange={onChange}
                className="pr-20 rounded-md dark:text-gray-100"
                containerProps={{
                  className: "min-w-0",
                }}
                onChange={handleInputChange}
              />
              <label className="font-semibold text-xs" for="stockField">
                Stock Quantity
              </label>
              <Input
                variant="outlined"
                type="number"
                placeholder="Stock Quantity"
                name="stock-quantity"
                value={inputStockQuantity}
                onChange={e=>setInputStockQuantity(e.target.value)}
                className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <label className="font-semibold text-xs" for="stockField">
                Stock Buy Price
              </label>
              <Input
                variant="outlined"
                type="number"
                placeholder="Stock Buy Price"
                name="stock-buy-price"
                value={inputStockBuyPrice}
                onChange={e=>setInputStockBuyPrice(e.target.value)}
                className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <label className="font-semibold text-xs" for="stockField">
                Stock Purchase Date
              </label>
              <Input
                variant="outlined"
                type="date"
                placeholder="Stock Purchase Date"
                name="stock-purchase-date"
                value={inputStockPurchaseDate}
                onChange={e=>setInputStockPurchaseDate(e.target.value)}
                className="pr-20 rounded-md appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <button
                name=""
                type="submit"
                className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
              >
                Add
              </button>

              {suggestions.length > 0 && (
                <ul
                  style={{
                    padding: "0",
                    marginTop: "0",
                  }}
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      style={{
                        listStyleType: "none",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                      className=" hover:bg-gray-300/50 dark:text-gray-100 dark:hover:bg-gray-700/50"
                      onClick={() =>
                        handleSuggestionClick(suggestion.item, suggestion.id)
                      }
                    >
                      {suggestion.item}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalAddUserStock;
