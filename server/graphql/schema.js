
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat
} = require("graphql");
const User = require("../models/User");
const { getCurrentPrice } = require("../services/coinGecko");

const CoinType = new GraphQLObjectType({
  name: "Coin",
  fields: () => ({
    coinId: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    buyPrice: { type: GraphQLFloat },
    currentPrice: { type: GraphQLFloat },
    growthPercent: { type: GraphQLFloat },
    profitLoss: { type: GraphQLFloat }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    portfolioStats: {
      type: new GraphQLList(CoinType),
      async resolve() {
        const user = await User.findOne({ email: "demo@example.com" });
        return Promise.all(user.coins.map(async coin => {
          const currentPrice = await getCurrentPrice(coin.coinId);
          const growth = ((currentPrice - coin.buyPrice) / coin.buyPrice) * 100;
          const profitLoss = (currentPrice - coin.buyPrice) * coin.amount;

          return {
            ...coin.toObject(),
            currentPrice,
            growthPercent: parseFloat(growth.toFixed(2)),
            profitLoss: parseFloat(profitLoss.toFixed(2))
          };
        }));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
