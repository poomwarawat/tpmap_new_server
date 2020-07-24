const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const AmphurBroker = new ServiceBroker({
  nodeID: "poor-amphur--broker",
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

AmphurBroker.createService({
  name: "pooramphur",
  actions: {
    async getProblemAmpur(ctx) {
      const { year, prov_ID } = ctx.params;
      const COLLECTION = await connection.db.collection(`POOR_PROVINCE${year}`);
      const FindData = await COLLECTION.find({ province_ID: `${prov_ID}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getPoorAmphur(ctx) {
      const { year, prov_ID } = ctx.params;
      const COLLECTION = await connection.db.collection(`POOR_AMPHUR${year}`);
      const FindData = await COLLECTION.find({ province_ID: `${prov_ID}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getMaxAmphur(ctx) {
      const { year, prov_ID, score } = ctx.params;
      let key;
      console.log(score);
      if (parseInt(score) === 0) {
        key = "poor.JPT.MOFval.CNT";
      } else if (parseInt(score) !== 0) {
        key = `poor.JPT.MOFval.ind${score}.CNT`;
      }
      const COLLECTION = await connection.db.collection(`POOR_AMPHUR${year}`);
      console.log(prov_ID);
      const FindData = await COLLECTION.find({
        province_ID: `${prov_ID}`,
      })
        .sort({ [key]: -1 })
        .limit(1);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getIndicaterPoorAmhpur(ctx) {
      const { year, prov_id, ind, limit } = ctx.params;
      if (ctx.params.order) {
        const IndName = indicater[parseInt(ind) - 1];
        const COLLECTION = await connection.db.collection(`POOR_AMPHUR${year}`);
        const FindData = await COLLECTION.find({ province_ID: `${prov_id}` })
          .sort({ [IndName]: parseInt(ctx.params.order) })
          .limit(parseInt(limit));
        const Data = await FindData.toArray();
        if (Data.length === 0) {
          return [{ errmsg: "404 not found data" }];
        }
        return Data;
      }
    },
    async getOrderPoorAmphur(ctx) {
      const { year, id, order } = ctx.params;
      console.log(year, id, order);
      const COLLECTION = await connection.db.collection(`POOR_AMPHUR${year}`);
      const FindData = await COLLECTION.find({ province_ID: `${id}` })
        .sort({ "poor.JPT.MOFval.CNT": parseInt(order) })
        .limit(10);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
  },
});

module.exports = AmphurBroker;
