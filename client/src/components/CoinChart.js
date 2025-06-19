import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

// Available coins
const supportedCoins = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
];

// Time range buttons
const timeOptions = {
  "1D": 1,
  "7D": 7,
  "30D": 30,
  "1Y": 365,
  "5Y": 1825,
  "10Y": 3650,
  "All": "max",
};

const CoinChart = () => {
  const [coinId, setCoinId] = useState("bitcoin");
  const [days, setDays] = useState(30);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChart = async (selectedCoin, selectedDays) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=${selectedDays}`
      );
      const data = await res.json();

      const chart = {
        labels: data.prices.map(p => new Date(p[0])),
        datasets: [
          {
            label: `${selectedCoin.toUpperCase()} Price (USD)`,
            data: data.prices.map(p => p[1]),
            fill: false,
            borderColor: "#007bff",
            tension: 0.3,
          },
        ],
      };
      setChartData(chart);
    } catch (err) {
      console.error("Error loading chart:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChart(coinId, days);
  }, [coinId, days]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Crypto Price Chart</h2>

      {/* Coin dropdown */}
      <label>
        Select Coin:{" "}
        <select
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          style={{ margin: "10px" }}
        >
          {supportedCoins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
      </label>

      {/* Time range buttons */}
      <div style={{ margin: "10px 0" }}>
        {Object.entries(timeOptions).map(([label, value]) => (
          <button
            key={label}
            onClick={() => setDays(value)}
            style={{
              marginRight: "5px",
              padding: "6px 12px",
              backgroundColor: days === value ? "#007bff" : "#f0f0f0",
              color: days === value ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {loading ? (
        <p>Loading chart...</p>
      ) : chartData ? (
        <Line data={chartData} key={`${coinId}-${days}`} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

const cache = {};

const fetchChart = async (coinId, days) => {
  const key = `${coinId}-${days}`;
  if (cache[key]) {
    setChartData(cache[key]);
    return;
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await res.json();

    const chart = {
      labels: data.prices.map(p => new Date(p[0])),
      datasets: [
        {
          label: `${coinId.toUpperCase()} Price (USD)`,
          data: data.prices.map(p => p[1]),
          borderColor: "#007bff",
          tension: 0.3,
        },
      ],
    };
    cache[key] = chart;
    setChartData(chart);
  } catch (err) {
    console.error("Chart fetch error:", err);
  }
};
export default CoinChart;
