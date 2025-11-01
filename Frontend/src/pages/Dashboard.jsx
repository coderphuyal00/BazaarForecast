import React, { useState, useContext } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterButton from "../components/Dropdowns/DropdownFilter";
import Datepicker from "../components/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard02 from "../partials/dashboard/DashboardCard02";
import DashboardCard03 from "../partials/dashboard/DashboardCard03";
import DashboardCard04 from "../partials/dashboard/DashboardCard04";
import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import DashboardCard06 from "../partials/dashboard/DashboardCard06";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import DashboardCard08 from "../partials/dashboard/DashboardCard08";
import DashboardCard09 from "../partials/dashboard/DashboardCard09";
import DashboardCard10 from "../partials/dashboard/DashboardCard10";
import DashboardCard11 from "../partials/dashboard/DashboardCard11";
import DashboardCard12 from "../partials/dashboard/DashboardCard12";
import DashboardCard13 from "../partials/dashboard/DashboardCard13";
import Banner from "../partials/Banner";
import NepseLineChart from "../partials/dashboard/NepseIndexChart";
import IndexCard from "../partials/dashboard/IndexCard";
import CalenderLayout from "../partials/dashboard/Calender";
import InfiniteScroll from "../partials/InfiniteScroll";
import UserStocksTable from "../partials/UserStocksTable";
import StorePortfolioValue from "../partials/RequestPortfolioValue";
import StockPriceTable from "../partials/DisplayAllStocks";
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [weekStart,weekEnd]=useContext();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <StorePortfolioValue/>

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Right: Actions */}
            </div>

            {/* Cards */}

            <div className="grid grid-cols-12 gap-6">
              <InfiniteScroll/>
              <DashboardCard01 />
              <DashboardCard02 />
              <DashboardCard03 />
              {/* <InfiniteScroll /> */}
              {/* Nepse Line chart */}
              <CalenderLayout />
              {/* Bar chart  */}
              {/* <DashboardCard04 /> */}
              {/* Line chart (Real Time Value) */}
              <DashboardCard11 />
              {/* User Stocks Table */}
              <UserStocksTable/>

              <StockPriceTable/>
              {/* <DashboardCard05 /> */}
              {/* Doughnut chart (Top Countries) */}
              {/* <DashboardCard06 /> */}
              {/* Table (Top Channels) */}
              {/* <DashboardCard07 /> */}
              {/* Card (Reasons for Refunds) */}
              {/* Line chart (Sales Over Time) */}
              {/* <DashboardCard08 /> */}
              {/* Stacked bar chart (Sales VS Refunds) */}
              {/* <DashboardCard09 /> */}
              {/* Card (Customers) */}
              {/* <DashboardCard10 /> */}
              {/* Card (Recent Activity) */}
              {/* <DashboardCard12 /> */}
              {/* Card (Income/Expenses) */}
              {/* <DashboardCard13 /> */}
              
            </div>
            {/* <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
              <div class="grid grid-cols-12 gap-4 md:gap-6">
                <div class="col-span-12">
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                    <IndexCard />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </main>

        {/* <Banner />s */}
      </div>
    </div>
  );
}

export default Dashboard;
