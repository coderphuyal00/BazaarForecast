import { React, useState, useContext, useEffect } from "react";
import IndexCard from "../partials/dashboard/IndexCard";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { useNavigate } from "react-router-dom";
import { AngleUpIcon, AngleDownIcon, PencilIcon, TrashBinIcon } from "../icons";
import { Button } from "@material-tailwind/react";
import StockDataContext from "../components/context/StockDataContext";
import TotalStockValue from "../partials/TotalStockValue";
import ModalAddUserStock from "../components/ModalAddUserStock";
import bgImg from "../images/928.jpg";
import {
  StockClosePrice,
  StockPriceDiff,
  StockValue,
} from "../partials/StockClosePrices";
import StockNepseCharges from "../partials/StockProfit";
function UserStocks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const [userStock, setUserStock] = useState();
  const [editIcon, seteditIcon] = useState("");
  const [modalMode, setModalMode] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [stock_ids,setstock_ids]= useState([])
  const { UserStocks } = useContext(StockDataContext);
  useEffect(() => {
    UserStocks().then((data) => {
      setUserStock(data);
      data.map((item)=>{
        addStock(item.stock.id)
      })
    });
  }, [UserStocks]);


const addStock = (newStockid) => {
    setstock_ids(prev => {
      // Optionally check for duplicates here
      const exists = prev.some(stock_id => stock_id === newStockid);
      if (exists) return prev;
      return [...prev, newStockid];
    });
  };

  const handleClick = (ticker) => {
    navigate(`/stock/${ticker}`);
    window.location.reload();
  };

  const handleEditClick = (stock) => {
  setSelectedStock(stock);
  setModalMode("edit");
  setSearchModalOpen(true);
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
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Portfolio
                </h1>
              </div>

              {/* Right: Actions */}
            </div>

            {/* Cards */}
            <div className="col-span-full xl:col-span-7 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Stock List
                  </h2>
                  <div >
                    <Button
                    title="Add Stock"
                      type="submit"
                      variant="filled"
                      className={`w-32 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600/50 dark:text-gray-200 dark:hover:bg-gray-600/80 ${
                        searchModalOpen && "bg-gray-200 dark:bg-gray-800"
                      }`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // openModal("add");
                        handleAddClick()
                      }}
                    >
                      Add Stock
                    </Button>

                    <ModalAddUserStock
                      id="add-search-modal"
                      searchId="add-stock"
                      clickedOn={modalMode}
                      modalOpen={searchModalOpen}
                      setModalOpen={setSearchModalOpen}
                      stockData={selectedStock}
                      storedStock={stock_ids}
                    />
                  </div>
                </div>
              </header>
              <div className="p-3">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="table-auto w-full dark:text-gray-300">
                    {/* Table header */}
                    <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
                      <tr>
                        <th className="p-2">
                          <div className="font-semibold text-left">Stock</div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">
                            Balance
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">
                            Buy Price
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">Price</div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">
                            % Change
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">
                            Total Value
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-center">
                            Estimated Profit
                          </div>
                        </th>
                      </tr>
                    </thead>
                    {/* Table body */}
                    <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                      {/* Row */}
                      {userStock?.map((item) => (
                        <tr key={item.stock.name}>
                          <td className="p-2">
                            <div className="flex items-left flex-col">
                              <div
                                className="text-gray-800  text-base dark:text-gray-100 cursor-pointer"
                                onClick={() => handleClick(item.stock.ticker)}
                              >
                                {item.stock.ticker}
                              </div>
                              <div className="text-gray-500 font-normal text-sm dark:text-gray-100">
                                {item.stock.name}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-center text-gray-800 dark:text-gray-300">
                              {item.quantity}
                            </div>
                          </td>

                          <td className="p-2">
                            <div className="text-center">{item.buy_price}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">
                              <StockClosePrice
                                currentTicker={item.stock.ticker}
                                className="dark:text-gray-100 "
                              />
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="text-sm ">
                              <StockPriceDiff
                                currentTicker={item.stock.ticker}
                                className="dark:text-gray-300"
                                displayLocation="user-stock-table"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-center text-gray-500 dark:text-gray-100">
                              <StockValue
                                currentTicker={item.stock.ticker}
                                stockQuantity={item.quantity}
                              />
                            </div>
                          </td>
                          <td
                            className="p-2 relative"
                            onMouseEnter={() => seteditIcon(item.stock.ticker)}
                            onMouseLeave={() => seteditIcon(null)}
                          >
                            <div className="text-center text-gray-500 dark:text-gray-100">
                              <StockNepseCharges
                                currentTicker={item.stock.ticker}
                                sharesCount={item.quantity}
                                buy_price={item.buy_price}
                              />
                            </div>
                            <div className="flex items-center justify-center hover:bg-white/30 hover:backdrop-blur-sm dark:hover:bg-neutral-900/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full">
                              <div className="edit-icon">
                                {editIcon === item.stock.ticker && (
                                  <button
                                    title="Edit Stock"
                                    className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full ml-3 `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // setSearchModalOpen(true);
                                      // setModalMode("edit");
                                      // //   setstockQuantity(item.quantity);
                                      // //   setstockTicker(item.stock.ticker);
                                      // //   setstockBuyPrice(item.buy_price);
                                      // //   setstockBuyDate(item.purchase_date);
                                      // //   setstockID(item.stock.id);
                                      // //   console.log(item.stock.id);
                                      // //   console.log(stockID);
                                      // //   console.log(isPurchaseDate);
                                      // //   console.log(isBuyPrice);
                                      // //   console.log(isQuantity);
                                      // //   console.log(isTicker);
                                      // handleValues(
                                      //   item.stock.id,
                                      //   item.quantity,
                                      //   item.purchase_date,
                                      //   item.buy_price,
                                      //   item.stock.ticker
                                      // );
                                      handleEditClick(item)
                                    }}
                                  >
                                    <PencilIcon className="text-gray-900 dark:text-gray-100 text-xl" />
                                   
                                  </button>
                                )}
                              </div>

                              {editIcon === item.stock.ticker && (
                                <div title="Remove Stock">
                                  <button
                                    title="Edit Stock"
                                    className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full ml-3 `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(item)
                                    }}
                                  >
                                    <TrashBinIcon className="text-gray-900 dark:text-gray-100 text-xl" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className=" border-t-1 border-gray-800">
                        <td className="p-2 flex justify-end">
                          <div className="text-center font-bold">
                            Total Stock Value
                          </div>
                        </td>
                        <td colSpan="5" className="p-2 text-right ">
                          <div className="">
                            <TotalStockValue displayLocation="stock-table" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
              <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                    <IndexCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* <Banner />s */}
      </div>
    </div>
  );
}

export default UserStocks;
