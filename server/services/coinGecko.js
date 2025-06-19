
const axios = require("axios");

async function getCurrentPrice(coinId) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
  const res = await axios.get(url);
  return res.data[coinId]?.usd;
}

module.exports = { getCurrentPrice };
