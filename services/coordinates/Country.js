const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

//import connection
const connection = mongoose.connection;

//create country broker name is country-broker with TCP
const CountryBroker = new ServiceBroker({
  nodeID: "country-broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});
//create service
CountryBroker.createService({
  name: "country",
  actions: {
    async getCountryMaps() {
      const COLLECTION = await connection.db.collection("COORDINATE_COUNTRY");
      const FindData = await COLLECTION.find({});
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    start() {
      return "Hello Application";
    },
  },
});

module.exports = CountryBroker;
