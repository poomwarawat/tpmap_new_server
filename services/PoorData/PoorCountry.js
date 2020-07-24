const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const PoorCountry = new ServiceBroker({
  nodeID: "poor-country--broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});

PoorCountry.createService({
  name: "poorcountry",
  actions: {
    async getPoorCountry(ctx) {
      const { year } = ctx.params;
      const COLLECTION = await connection.db.collection(`POOR_COUNTRY${year}`);
      const FindData = await COLLECTION.find({});
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
  },
});

module.exports = PoorCountry;
