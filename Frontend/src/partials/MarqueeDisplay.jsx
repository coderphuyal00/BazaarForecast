import React from "react";
import { AngleUpIcon, AngleDownIcon } from "../icons";
const MarqueeDisplay = ({ sectorsData }) => {
  // Prepare display items as formatted JSX spans
  const marqueeItems = Object.entries(sectorsData).map(([sector, data]) => {
    const { index, date, close_price, price_difference } = data;
    // Format price difference with ± sign and two decimals
    const diffFormatted =
      price_difference != null ? (
        <span className="flex flex-row">
          {price_difference >= 0 ? (
            <>
              <span className="text-green-500 mr-1 flex items-center "><AngleUpIcon className="h-5 w-5"/>{/* Up arrow */}+
              {price_difference.toFixed(2)}%</span> 
            </>
          ) : (
            <>
              <span className="text-red-500 mr-1 flex items-center"><AngleDownIcon className="h-5 w-5"/>{/* Down arrow */}
              {price_difference.toFixed(2)}%</span> 
            </>
          )}
        </span>
      ) : (
        "N/A"
      );
    return (
      <div key={sector} className="mx-1 text-4xl whitespace-nowrap flex flex-row gap-3">
        {/* {`close_price: ${close_price} date: "${date}" index: "${index}" price_difference: ${diffFormatted}`} */}
        <div className="parent flex flex-col text-lg ">
          <div className="sector_name flex dark:text-white text-gray-900">
            <span className="capitalize ">{index}</span>
          </div>
          <div className="price_diff flex flex-row gap-2">
            <span>{close_price}</span>
            <span>{diffFormatted}</span>
          </div>
        </div>
        <div className="divider flex items-center justify-center">|</div>
      </div>
    );
  });

  return (
    <div>
      <div className="relative mx-1 flex flex-row overflow-x-hidden list cursor-pointer group">
        {/* First animated marquee line */}
        <div className="py-2 flex flex-row group-hover:[animation-play-state:paused] animate-marquee whitespace-nowrap gap-2">
          {marqueeItems}
        </div>

        {/* Second animated marquee line for smooth infinite scroll */}
        <div className="absolute flex flex-row top-0 group-hover:[animation-play-state:paused]  py-2 animate-marquee2 whitespace-nowrap gap-2">
          {marqueeItems}
        </div>
      </div>
    </div>
  );
};

export default MarqueeDisplay;
