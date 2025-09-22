import { useState } from "react";

export default function StockNepseCharges({ currentTicker,buy_price, sharesCount, transactionType="sell" }) {
  // transactionType: 'buy' or 'sell'
  // transactionAmount: total value of the transaction (price * quantity)
  // sharesCount: number of shares (for DP charge calculation)
    const transactionAmount=buy_price*sharesCount
  // Brokerage commission rates based on transaction amount (percent)
  // Using typical updated percentage for equity trading
  const [closePrice, setclosePrice] = useState();
  const brokerageRates = [
    { max: 50000, rate: 0.0036, minFee: 10 },     // 0.36%
    { max: 500000, rate: 0.0033 },
    { max: 2000000, rate: 0.0031 },
    { max: 10000000, rate: 0.0027 },
    { max: Infinity, rate: 0.0024 },
  ];

  // SEBON charge 0.015%
  const sebonRate = 0.00015;

  // DP charge Rs 25 per company per transaction
  // Assuming 1 company per transaction here
  const dpChargePerCompany = 25;

  // Calculate brokerage commission
  const brokerageCommission = (() => {
    for (let bracket of brokerageRates) {
      if (transactionAmount <= bracket.max) {
        if (bracket.minFee) {
          return Math.max(transactionAmount * bracket.rate, bracket.minFee);
        }
        return transactionAmount * bracket.rate;
      }
    }
    return 0; // default fallback
  })();

  // Calculate SEBON fee
  const sebonFee = transactionAmount * sebonRate;

  // DP charge calculation
  const dpCharge = dpChargePerCompany * 1; // Assuming one company per transaction

  // Total charges
  const totalCharges = brokerageCommission + sebonFee + dpCharge;
  const fetchStockPrices = (ticker) => {
    //   const close_prices = [];
    try {
      fetch(`http://127.0.0.1:8000/api/stock/1D/${ticker}/`)
        .then((response) => response.json())
        .then((data) => {
          const close_prices = data.map((item) => item.close_price);
          let lastIndex = close_prices.length;
          let lastElement = close_prices[lastIndex - 1];

          function truncateDecimals(num, digits) {
              const multiplier = Math.pow(10, digits);
              return ~~(num * multiplier) / multiplier;
            }
          setclosePrice(truncateDecimals(lastElement,2));
          //   return lastElement;
        });
    } catch (error) {
      return error;
    }
  };
  fetchStockPrices(currentTicker);
  
  const stock_value_current=sharesCount*closePrice
  const totalValue=stock_value_current-totalCharges
  return <p>Rs.{totalValue != null ? totalValue : "Loading.."}</p>;
}