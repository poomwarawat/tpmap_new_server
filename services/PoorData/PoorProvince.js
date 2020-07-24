const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const PoorProvince = new ServiceBroker({
  nodeID: "poor-province--broker",
  logger: true,
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 1 * 1024 * 1024,
    },
  },
});

const indicater = [
  "poor.JPT.MOFval.ind1.CNT",
  "poor.JPT.MOFval.ind2.CNT",
  "poor.JPT.MOFval.ind3.CNT",
  "poor.JPT.MOFval.ind4.CNT",
  "poor.JPT.MOFval.ind5.CNT",
  "poor.JPT.MOFval.ind6.CNT",
  "poor.JPT.MOFval.ind7.CNT",
  "poor.JPT.MOFval.ind8.CNT",
  "poor.JPT.MOFval.ind9.CNT",
  "poor.JPT.MOFval.ind10.CNT",
  "poor.JPT.MOFval.ind11.CNT",
  "poor.JPT.MOFval.ind12.CNT",
  "poor.JPT.MOFval.ind13.CNT",
  "poor.JPT.MOFval.ind14.CNT",
  "poor.JPT.MOFval.ind15.CNT",
  "poor.JPT.MOFval.ind16.CNT",
  "poor.JPT.MOFval.ind17.CNT",
  "poor.JPT.MOFval.ind18.CNT",
  "poor.JPT.MOFval.ind19.CNT",
  "poor.JPT.MOFval.ind20.CNT",
  "poor.JPT.MOFval.ind21.CNT",
  "poor.JPT.MOFval.ind22.CNT",
  "poor.JPT.MOFval.ind23.CNT",
  "poor.JPT.MOFval.ind24.CNT",
  "poor.JPT.MOFval.ind25.CNT",
  "poor.JPT.MOFval.ind26.CNT",
  "poor.JPT.MOFval.ind27.CNT",
  "poor.JPT.MOFval.ind28.CNT",
  "poor.JPT.MOFval.ind29.CNT",
  "poor.JPT.MOFval.ind30.CNT",
  "poor.JPT.MOFval.ind31.CNT",
];

PoorProvince.createService({
  name: "poorprovince",
  actions: {
    async getPoorProvince(ctx) {
      const { year } = ctx.params;
      const COLLECTION = await connection.db.collection(`POOR_PROVINCE${year}`);
      const FindData = await COLLECTION.find({});
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getMaxPoorProvince(ctx) {
      const { year, score } = ctx.params;
      let key;
      if (parseInt(score) === 0) {
        key = "poor.JPT.MOFval.CNT";
      } else if (parseInt(score) !== 0) {
        key = `poor.JPT.MOFval.ind${score}.CNT`;
      }
      const COLLECTION = await connection.db.collection(`POOR_PROVINCE${year}`);
      const FindData = await COLLECTION.find({})
        .sort({ [key]: -1 })
        .limit(1);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getOrderPoorProvince(ctx) {
      const { year, order } = ctx.params;
      const COLLECTION = await connection.db.collection(`POOR_PROVINCE${year}`);
      const FindData = await COLLECTION.find({})
        .sort({ "poor.JPT.MOFval.CNT": parseInt(order) })
        .limit(10);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getIndicaterPoorProvince(ctx) {
      const { year, ind, limit } = ctx.params;
      console.log(ind, limit);
      if (ctx.params.order) {
        const IndName = indicater[parseInt(ind) - 1];
        const COLLECTION = await connection.db.collection(
          `POOR_PROVINCE${year}`
        );
        const FindData = await COLLECTION.find({})
          .sort({ [IndName]: parseInt(ctx.params.order) })
          .limit(parseInt(limit));
        const Data = await FindData.toArray();
        if (Data.length === 0) {
          return [{ errmsg: "404 not found data" }];
        }
        return Data;
      }
    },
  },
});

module.exports = PoorProvince;
