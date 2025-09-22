import {useState,useContext} from 'react';
import IndexCardContext from "../../components/context/StockDataContext";
function IndexCard() {
    const [indexName,setIndexName]=useState();
    const [todayPrice, setTodayPrice] = useState();
    const [priceDiff, setPriceDiff] = useState();
    const [isGain, setGain] = useState();
    const {fetchDataOncePerDay} = useContext(IndexCardContext);
    fetchDataOncePerDay('http://127.0.0.1:8000/api/index-price/nepse/')
      .then((data) => {
        // Format data to chart.js structure: labels and data points
        // Assuming the API returns an array with date and price fields, e.g.:
        // [{ date: "2025-07-20", price: 1400 }, { date: "2025-07-21", price: 1420 }, ...]
        const labels = data.map((item) => item.date);
        const index=data.map((item)=>item.index)
        const prices = data.map((item) => item.close_price);
        let lastIndex = prices.length;
        let lastElement = prices[lastIndex - 1];
        let indexlastElement = index[lastIndex - 1];
        setIndexName(indexlastElement)
        setTodayPrice(lastElement)
        const diffPercentage = () => {
          let secondLastElement = prices[lastIndex - 2];
          // console.log(secondLastElement);
          let percentageDiff =
            ((lastElement - secondLastElement) / secondLastElement) * 100;
          if (lastElement > secondLastElement) {
            setGain(true);
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
    })
  return (
    
            <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-5 pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-6">
                {/* <div className="w-10 h-10">
                  <img alt="Apple, Inc" src="/images/brand/brand-07.svg" />
                </div> */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    {indexName} Index
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-evenly">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {todayPrice}
                  </h4>
                </div>
                {/* <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                  <span className="mr-1">
                    <svg
                      className="fill-current"
                      width="1em"
                      height="1em"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.06462 1.62393C6.20193 1.47072 6.40135 1.37432 6.62329 1.37432C6.6236 1.37432 6.62391 1.37432 6.62422 1.37432C6.81631 1.37415 7.00845 1.44731 7.15505 1.5938L10.1551 4.5918C10.4481 4.88459 10.4483 5.35946 10.1555 5.65246C9.86273 5.94546 9.38785 5.94562 9.09486 5.65283L7.37329 3.93247L7.37329 10.125C7.37329 10.5392 7.03751 10.875 6.62329 10.875C6.20908 10.875 5.87329 10.5392 5.87329 10.125L5.87329 3.93578L4.15516 5.65281C3.86218 5.94561 3.3873 5.94546 3.0945 5.65248C2.8017 5.35949 2.80185 4.88462 3.09484 4.59182L6.06462 1.62393Z"
                        fill=""
                      ></path>
                    </svg>
                  </span>
                  11.01%
                </span> */}
                {isGain ? (
            <div className="text-sm font-medium text-green-700 mt-2 px-1.5 bg-green-500/20 rounded-full">
              +{priceDiff}
            </div>
          ) : (
            <div className="text-sm font-medium text-red-700 mt-2 px-1.5 bg-red-500/20 rounded-full">
              {priceDiff}
            </div>
          )}
              </div>
            </div>
         
  );
}

export default IndexCard;
