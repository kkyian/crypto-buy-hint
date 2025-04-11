import React, { useEffect, useState } from "react";
import { BadgeCheck, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CryptoDashboard = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true")
      .then(res => res.json())
      .then(data => {
        setCryptos(data);
        console.log(data); // For debugging chart data
      });
  }, []);

  const getHint = (coin) => {
    if (!coin.sparkline_in_7d?.price) return "dont-buy";

    const prices = coin.sparkline_in_7d.price;
    const start = prices[0];
    const end = prices[prices.length - 1];
    const average = prices.reduce((sum, val) => sum + val, 0) / prices.length;
    const trend = end - start;

    // Basic AI-style logic (simulated): Buy if price is going up and above average
    if (trend > 0 && end > average) return "buy";
    return "dont-buy";
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cryptos.map(coin => (
        <div key={coin.id} className="rounded-2xl shadow-md bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
              <p className="text-sm text-gray-500">${coin.current_price.toLocaleString()}</p>
            </div>
            <div>
              {getHint(coin) === "buy" ? (
                <div className="text-green-600 flex items-center gap-1">
                  <BadgeCheck /> Buy
                </div>
              ) : (
                <div className="text-red-500 flex items-center gap-1">
                  <XCircle /> Don't Buy
                </div>
              )}
            </div>
          </div>

          {coin.sparkline_in_7d?.price && (
            <div className="mt-4 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={coin.sparkline_in_7d.price.map((price, index) => ({ index, price }))}
                >
                  <Line type="monotone" dataKey="price" stroke="#4f46e5" dot={false} strokeWidth={2} />
                  <XAxis dataKey="index" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CryptoDashboard;
