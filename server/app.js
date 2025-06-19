
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/coins", require("./routes/coinRoutes"));

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
