import { React, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarChart from "../../charts/BarChart03";
import AuthContext from "../../components/context/AuthContext";
import StockDataContext from "../../components/context/StockDataContext";
import { StockPriceDiff, StockClosePrice } from "../StockClosePrices";
import { PlusIcon2, TrashBinIcon } from "../../icons";
import SearchModal from "../../components/ModalAddStock";
import useLocalStorage from "../../components/LocalStorageHandler";
// Import utilities
import { getCssVariable } from "../../utils/Utils";

function DashboardCard11() {
  const { authTokens } = useContext(AuthContext);
  const { fetchStocks } = useContext(StockDataContext);
  const [userWatchList, setUserWatchList] = useState();
  // const [watchList, setWatchList] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [trashIcon, setTrashIcon] = useState(null);
  const [isStock, setStock] = useState();
  const [stocks,setStocks] = useLocalStorage("stockWatchlist", []);
  const navigate = useNavigate();
  const chartData = {
    labels: ["Reasons"],
    datasets: [
      {
        label: "Having difficulties using the product",
        data: [131],
        backgroundColor: getCssVariable("--color-violet-500"),
        hoverBackgroundColor: getCssVariable("--color-violet-600"),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: "Missing features I need",
        data: [100],
        backgroundColor: getCssVariable("--color-violet-700"),
        hoverBackgroundColor: getCssVariable("--color-violet-800"),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: "Not satisfied about the quality of the product",
        data: [81],
        backgroundColor: getCssVariable("--color-sky-500"),
        hoverBackgroundColor: getCssVariable("--color-sky-600"),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: "The product doesn’t look as advertised",
        data: [65],
        backgroundColor: getCssVariable("--color-green-500"),
        hoverBackgroundColor: getCssVariable("--color-green-600"),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: "Other",
        data: [72],
        backgroundColor: getCssVariable("--color-gray-200"),
        hoverBackgroundColor: getCssVariable("--color-gray-300"),
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  };
  // const addStock=(newStock)=>{
  //   setUserWatchList(prev=>{
  //     [...prev,newStock]
  //   });
  // }

  // useEffect(() => {
  //   const temp_stock_details_arr=[]
  //   const UserWatchlist = async (stock) => {
  //       const response = await fetchStocks(stock);

  //         // addStock(response);
  //         temp_stock_details_arr.push(response)
  //         // setUserWatchlist(JSON.parse(localStorage.getItem("user_stockWatchlist")));
  //         // console.log(userWatchlist);
  //         // console.log(response);
  //         // setWatchList(response)

  //         // localStorage.setItem("user_watchlist", JSON.stringify(apiData));
  //         // console.log(apiData);
  //       }
  //       if(temp_stock_details_arr===""){
  //       setUserWatchList(temp_stock_details_arr);
  //       localStorage.setItem("stock_details",JSON.stringify(temp_stock_details_arr))
  //       }
  //       else{
  //         setUserWatchList()
  //       }
  //       // console.log(temp_stock_details_arr)
  //     // addStock(userWatchlist)
  //   stocks.map((stock) => {
  //     // UserWatchlist(stock);

  //   });
  //   // console.log(stocks);
  //   console.log(userWatchList)
  // }, [stocks]);
  const deleteStock = (stock) => {
    const index = stocks.indexOf(`${stock}`);
    const updatedItems = stocks.filter((item) => item !== stock);
    setStocks(updatedItems);
     window.location.reload();
    // localStorage.setItem("items", JSON.stringify(updatedItems));
    // if(isStock!=""){
    //   console.log(stocks.indexOf(`${stock}`))
    // }
  };
  const handleClick = (ticker) => {
    navigate(`/stock/${ticker}`);
    window.location.reload();
  };
  useEffect(() => {
    async function fetchAllStockDetails() {
      const temp_stock_details_arr = await Promise.all(
        stocks.map((stock) => fetchStocks(stock))
      );
      // localStorage.setItem("stock_details", JSON.stringify(temp_stock_details_arr.flat()));
      setUserWatchList(temp_stock_details_arr.flat());
    }

    if (stocks.length > 0) {
      fetchAllStockDetails();
    }
  }, [stocks]);

  const handlePlusClick = () => {
    return (
      <SearchModal
        id="search-modal"
        searchId="search"
        modalOpen={searchModalOpen}
        setModalOpen={setSearchModalOpen}
      />
    );
  };
  return (
    <div className="flex flex-col col-span-full sm:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl h-86 ">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          My Watchlist
        </h2>
        <div title="Add Stock">
          <button
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-300/50 dark:lg:hover:bg-gray-700/50 rounded-full ml-3 ${
              searchModalOpen && "bg-gray-200 dark:bg-gray-800"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSearchModalOpen(true);
            }}
            aria-controls="search-modal"
          >
            <PlusIcon2 className="text-gray-800 dark:text-[#ffffff]" />
          </button>
          <SearchModal
            id="add-search-modal"
            searchId="add-stock"
            modalOpen={searchModalOpen}
            setModalOpen={setSearchModalOpen}
          />
        </div>
      </header>
      <div className="px-5 overflow-y-auto scroll-smooth">
        <div className="flex items-center  dark:bg-none rounded-md p-2 ">
          <table className="table-auto w-full border-collapse border-b border-gray-200 ">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {userWatchList?.map((item) => (
                <tr key={item.stock.name}>
                  <td className="p-1">
                    <div className="flex items-left flex-col">
                      <div
                        className="text-gray-800 text-base font-bold text-uppercase dark:text-gray-100 cursor-pointer"
                        onClick={() => handleClick(item.stock.ticker)}
                      >
                        {item.stock.ticker}
                      </div>
                      <div className="text-gray-500 font-normal text-sm dark:text-gray-100 truncate">
                        {item.stock.name}
                      </div>
                    </div>
                  </td>
                  <td
                    className="p-1 text-nowrap cursor-default relative"
                    onMouseEnter={() => setTrashIcon(item.stock.ticker)}
                    onMouseLeave={() => setTrashIcon(null)}
                  >
                    <div className="text-center text-nowrap flex flex-col gap-1 font-bold">
                      <StockClosePrice
                        currentTicker={item.stock.ticker}
                        className="font-bold text-gray-900 dark:text-white"
                      />
                      <StockPriceDiff
                        currentTicker={item.stock.ticker}
                        className="dark:text-gray-300"
                        displayLocation="user-stock-table"
                      />
                    </div>
                    <div className="flex items-center justify-center hover:bg-white/30 hover:backdrop-blur-sm dark:hover:bg-neutral-900/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full">
                      {trashIcon === item.stock.ticker && (
                        <button title="Delete Stock"
                          className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full ml-3 `}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStock(item.stock.ticker);
                          }}
                        >
                          <TrashBinIcon className="text-gray-900 dark:text-gray-100 text-xl" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard11;
