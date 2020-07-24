const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const CentroidProvince = new ServiceBroker({
  nodeID: "centroid-province-broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});

CentroidProvince.createService({
  name: "centroidprovince",
  actions: {
    async getCentroidProvince(ctx) {
      const { id } = ctx.params;
      console.log(id);
      const COLLECTION = connection.db.collection("CENTROID_PROVINCE");
      const FindData = await COLLECTION.find({ "properties.PV_CODE": `${id}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
  },
});

module.exports = CentroidProvince;
