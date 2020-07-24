const { ServiceBroker } = require("moleculer");
const mongoose = require("mongoose");

const connection = mongoose.connection;

const TambolBroker = new ServiceBroker({
  nodeID: "poor-tambol--broker",
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

TambolBroker.createService({
  name: "poortambol",
  actions: {
    async getProblemTambol(ctx) {
      const { year, amp_ID } = ctx.params;
      console.log(year, amp_ID);
      const COLLECTION = connection.db.collection(`POOR_AMPHUR${year}`);
      const FindData = await COLLECTION.find({ amphur_ID: `${amp_ID}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getOrderTambol(ctx) {
      const { year, id, order } = ctx.params;
      console.log(year, id, order);
      const COLLECTION = connection.db.collection(`POOR_TAMBOL${year}`);
      const FindData = await COLLECTION.find({ amphur_ID: `${id}` })
        .sort({ "poor.JPT.MOFval.CNT": parseInt(order) })
        .limit(10);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getTambolMax(ctx) {
      const { year, id } = ctx.params;
      const COLLECTION = connection.db.collection(`POOR_TAMBOL${year}`);
      const FindData = await COLLECTION.find({ amphur_ID: `${id}` })
        .sort({ "poor.JPT.MOFval.CNT": -1 })
        .limit(-1);
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getTambol(ctx) {
      const { year, id } = ctx.params;
      const COLLECTION = connection.db.collection(`POOR_TAMBOL${year}`);
      const FindData = await COLLECTION.find({ amphur_ID: `${id}` });
      const Data = await FindData.toArray();
      if (Data.length === 0) {
        return [{ errmsg: "404 not found data" }];
      }
      return Data;
    },
    async getTambolIndicater(ctx) {
      const { year, ampCode, ind, order, limit } = ctx.params;
      console.log(year, ampCode, ind, order, limit);
      if (ctx.params.order) {
        const IndName = indicater[parseInt(ind) - 1];
        const COLLECTION = await connection.db.collection(`POOR_TAMBOL${year}`);
        const FindData = await COLLECTION.find({ amphur_ID: `${ampCode}` })
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

module.exports = TambolBroker;
