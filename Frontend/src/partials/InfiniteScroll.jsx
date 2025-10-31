import DashboardCard01 from "./dashboard/DashboardCard01";
import DashboardCard02 from "./dashboard/DashboardCard02";
import DashboardCard03 from "./dashboard/DashboardCard03";
import MarqueeDisplay from "./MarqueeDisplay";
import { useEffect, useState } from "react";
export default function InfiniteScroll() {
  const [sectorsData, setSectorsData] = useState({});

  useEffect(() => {
    const sectors = [
      "nepse",
      "sensitive",
      "float",
      "sen. float",
      "banking",
      "development bank",
      "finance",
      "hotels and tourism",
      "hydropower",
      "life insurance",
      "Manu.and Pro.",
      "microfinance",
      "mutual fund",
      "Non-Life Insurance",
      "trading",
      "investment",
    ];
    async function fetchAllSectors() {
      try {
        const results = await Promise.all(
          sectors.map((sector) =>
            fetch(`http://127.0.0.1:8000/api/index-price/${sector}/`).then(
              (res) => res.json()
            )
          )
        );
        const combinedData = {};
        sectors.forEach((sector, index) => {
          const sectorData = results[index];
          combinedData[sector] = sectorData[sectorData.length - 1];
          const priceDifference = calculatePriceDifference(sectorData); // Pass full array here
          combinedData[sector] = {
            ...sectorData[sectorData.length - 1], // last element (today's data)
            price_difference: priceDifference, // add calculated difference
          };
        });

        setSectorsData(combinedData);
        // console.log(combinedData);
      } catch (error) {
        console.error("Error fetching sector data:", error);
      }
    }
    fetchAllSectors();
  }, []);
  if (sectorsData) {
    const allData = Object.values(sectorsData).flat();
    console.log(allData);
    // Prepare the marquee content, showing index, date, and close price
    const marqueeText = allData
      .map((item) => `${item.index} on ${item.date}: ${item.close_price}`)
      .join("  |  ");
    // console.log(marqueeText)
  }
  function calculatePriceDifference(prices) {
    if (!prices || prices.length < 2) return null;
    const todayPrice = prices[prices.length - 1].close_price;
    const yesterdayPrice = prices[prices.length - 2].close_price;
    return ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;
  }

  return (
   <div className="flex flex-col group col-span-full sm:col-span-full xl:col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-md">
      {/* other dashboard content */}
      <MarqueeDisplay sectorsData={sectorsData} />
    </div>
  );
}
