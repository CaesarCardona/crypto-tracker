import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinChart from "./components/CoinChart";


function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await axios.get("http://localhost:5000/api/coins");
      const coins = res.data;
      setPortfolio(coins);

      const ids = coins.map(c => c.coinId).join(",");
      if (ids) {
        const priceRes = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        setPrices(priceRes.data);
      }
      setLoading(false);
    };

    fetchCoins();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📈 Crypto Portfolio Tracker</h1>

      {loading ? (
        <p>Loading...</p>
      ) : portfolio.length === 0 ? (
        <p>No coins added.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Amount</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Profit/Loss (%)</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((coin, idx) => {
              const current = prices[coin.coinId]?.usd || 0;
              const gain = (((current - coin.buyPrice) / coin.buyPrice) * 100).toFixed(2);
              return (
                <tr key={idx}>
                  <td>{coin.coinId}</td>
                  <td>{coin.amount}</td>
                  <td>${coin.buyPrice}</td>
                  <td>${current}</td>
                  <td style={{ color: gain >= 0 ? "green" : "red" }}>{gain}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Charts for popular coins */}
      <CoinChart coinId="bitcoin" />
    </div>
  );
}

export default App;


