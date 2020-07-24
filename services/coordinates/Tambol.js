const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const TambolBroker = new ServiceBroker({
  nodeID: "tambol-broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});

TambolBroker.createService({
  name: "tambol",
  actions: {
    async getTambolMaps(ctx) {
      const { id } = ctx.params;
      const P_CODE = `${id[0]}${id[1]}`;
      const A_CODE = `${id[2]}${id[3]}`;
      console.log(P_CODE, A_CODE);
      const COLLECTION = connection.db.collection("COORDINATE_AMPHUR");
      const FindData = await COLLECTION.find({
        "properties.P_CODE": `${P_CODE}`,
        "properties.A_CODE": `${A_CODE}`,
      });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
  },
});

module.exports = TambolBroker;
