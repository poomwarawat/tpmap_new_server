const mongoose = require("mongoose");
const dotenv = require("dotenv");

//require database configuration
dotenv.config();

//create connection of mongoose
// mongoose.connect(`mongodb://${process.env.DB_CONNECT}/TPMAPNEW`, {
// useUnifiedTopology: true,
// useNewUrlParser: true,
// useUnifiedTopology: true,
// });
mongoose.connect(
  `mongodb+srv://poomwarawat:Poom@0925350380@cluster0.xqddg.mongodb.net/TPMAPNEW?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

//connection validation
db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => {
  console.log("Connection Successful!!");
});

module.exports = db;
