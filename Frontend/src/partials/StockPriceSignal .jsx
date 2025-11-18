import React, { useState, useEffect } from 'react';

function StockPriceSignal({ todayPrice, low52Week, high52Week, thresholdPercent = 5 }) {
  // thresholdPercent defines how close price is considered near top/bottom (e.g., 5%)

  const [signal, setSignal] = useState('');

  useEffect(() => {
    if (!todayPrice || !low52Week || !high52Week) {
      setSignal('');
      return;
    }
    const range = high52Week - low52Week;
    if (range <= 0) {
      setSignal('');
      return;
    }

    const nearTopPrice = high52Week - (range * thresholdPercent) / 100;
    const nearBottomPrice = low52Week + (range * thresholdPercent) / 100;

    if (todayPrice >= nearTopPrice) {
      setSignal('near top');
    } else if (todayPrice <= nearBottomPrice) {
      setSignal('near bottom');
    } else {
      setSignal('middle range');
    }
  }, [todayPrice, low52Week, high52Week, thresholdPercent]);
const getColor = () => {
    if (signal === 'near top') return 'text-green-700';
    if (signal === 'near bottom') return 'red';
    if (signal === 'middle range') return 'text-gray-800 dark:text-gray-500';
    return 'text-gray-800 dark:text-gray-500'; // default
  };
  return (
      <strong  style={{ color: getColor(), fontWeight: 'bold' }}>{signal}</strong>
  );
}

export default StockPriceSignal;
