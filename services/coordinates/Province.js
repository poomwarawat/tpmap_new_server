const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

//import connection
const connection = mongoose.connection;

const ProvinceBroker = new ServiceBroker({
  nodeID: "province-broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});

ProvinceBroker.createService({
  name: "province",
  actions: {
    async getProvinceMaps(ctx) {
      const { id } = ctx.params;
      console.log(id);
      const COLLECTION = await connection.db.collection("COORDINATE_PROVINCE");
      const FindData = await COLLECTION.find({ "properties.PV_CODE": `${id}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
  },
});

module.exports = ProvinceBroker;
