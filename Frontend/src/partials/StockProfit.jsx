import { useState, useEffect } from "react";

export default function StockNepseCharges({
  TickerPrice,
  buy_price,
  sharesCount,
  transactionType = "sell",
}) {
  // transactionType: 'buy' or 'sell'
  // transactionAmount: total value of the transaction (price * quantity)
  // sharesCount: number of shares (for DP charge calculation)
  const transactionAmount = buy_price * sharesCount;
  // Brokerage commission rates based on transaction amount (percent)
  // Using typical updated percentage for equity trading
  const [closePrice, setclosePrice] = useState();
  const brokerageRates = [
    { max: 50000, rate: 0.0036, minFee: 10 }, // 0.36%
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

  useEffect(() => {
    try {
      const prices = TickerPrice;
      const todayClosePrice = prices[prices.length - 1].close_price;
      setclosePrice(todayClosePrice.toFixed(2));
    } catch (error) {
      return error;
    }
  }, [TickerPrice]);

  const stock_value_current = sharesCount * closePrice;
  const totalValue = stock_value_current - totalCharges;
  function truncateDecimals(num, digits) {
    const multiplier = Math.pow(10, digits);
    return ~~(num * multiplier) / multiplier;
  }
  return (
    <p>
      Rs.{totalValue != null ? truncateDecimals(totalValue, 2) : "Loading.."}
    </p>
  );
}
