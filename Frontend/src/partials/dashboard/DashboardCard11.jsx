import { React, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarChart from "../../charts/BarChart03";
import { useAuth } from "../../components/context/AuthContext";
import StockDataContext from "../../components/context/StockDataContext";
import { StockPriceDiff, StockClosePrice } from "../StockClosePrices";
import { PlusIcon2, TrashBinIcon } from "../../icons";
import SearchModal from "../../components/ModalAddStock";
import useLocalStorage from "../../components/LocalStorageHandler";
// Import utilities
import { getCssVariable } from "../../utils/Utils";

function DashboardCard11() {
  const { authTokens, userDetails } = useAuth();
  const { fetchStocks, UserWatchlist } = useContext(StockDataContext);
  const [userWatchList, setUserWatchList] = useState();
  const [watchList, setWatchList] = useState();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [trashIcon, setTrashIcon] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stock_ids, setstock_ids] = useState([]);
  const [stocks, setStocks] = useLocalStorage(`stockWatchlist`, []);
  const [modalMode, setModalMode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (UserWatchlist) {
      // console.log(UserWatchlist)
      setUserWatchList(UserWatchlist);
    } else {
      setUserWatchList("loading");
    }
    // UserWatchlist.map((item) => {
    //   addStock(item.stock.id);
    // });
  }, [UserWatchlist]);

  const addStock = (newStockid) => {
    setstock_ids((prev) => {
      // Optionally check for duplicates here
      const exists = prev.some((stock_id) => stock_id === newStockid);
      if (exists) return prev;
      return [...prev, newStockid];
    });
  };

  const handleClick = (ticker) => {
    navigate(`/stock/${ticker}`);
    window.location.reload();
  };

  const handleDeleteClick = (stock) => {
    setSelectedStock(stock);
    setModalMode("remove");
    setSearchModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedStock(null);
    setModalMode("add");
    setSearchModalOpen(true);
  };
  const calculateDiff = (item) => {
    const prices = item.stock.prices;
    const todayClosePrice = prices[prices.length - 1].close_price;
    const yesterdayClosePrice = prices[prices.length - 2].close_price;

    const priceDifference =
      ((todayClosePrice - yesterdayClosePrice) / yesterdayClosePrice) * 100;
    // if(todayClosePrice>yesterdayClosePrice){
    //   return priceDifference
    // }
    const priceDiffSign =
      priceDifference > 0
        ? `+${priceDifference.toFixed(2)}`
        : `${priceDifference.toFixed(2)}`;
    const color =
      todayClosePrice > yesterdayClosePrice
        ? "oklch(0.527 0.154 150.069)"
        : todayClosePrice === yesterdayClosePrice
        ? "#000"
        : "#e63939";

    return `<span style="color: ${color}">${priceDiffSign}%</span> `;
  };
  return (
    <div className="flex flex-col col-span-full sm:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl h-96">
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
              handleAddClick();
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
            storedStock={stock_ids}
            clickedOn={modalMode}
            stockData={selectedStock}
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
                      <p>Rs.{item.stock.prices.at(-1).close_price}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: calculateDiff(item),
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center hover:bg-white/30 hover:backdrop-blur-sm dark:hover:bg-neutral-900/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full">
                      {trashIcon === item.stock.ticker && (
                        <button
                          title="Delete Stock"
                          className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full ml-3 `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item);
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
