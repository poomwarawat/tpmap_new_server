const { ServiceBroker, ServiceRegistry } = require("moleculer");
const HTTPServer = require("moleculer-web");
const db = require("./connection");
const dotenv = require("dotenv");

dotenv.config();

const StartBroker = new ServiceBroker({
  nodeID: "Coordinates",
  transporter: {
    type: "TCP",
    options: {
      maxPacketSize: 50 * 1024 * 1024,
    },
  },
});

StartBroker.createService({
  name: "gateway",
  mixins: [HTTPServer],
  settings: {
    port: process.env.PORT || 5000,
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      allowedHeaders: [],
      exposedHeaders: [],
      credentials: false,
      maxAge: 3600,
    },
    routes: [
      {
        aliases: {
          "GET /": "country.start",
          "GET /coordinates/country": "country.getCountryMaps", // โหลดแผนที่ทุกจังหวัด
          "GET /coordinates/province/:id": "province.getProvinceMaps", // โหลดแผนที่หนึ่งจังหวัด (ทุกอำเภอของจังหวัดนั้นๆ)
          "GET /coordinates/amphur/:id": "amphur.getAmphurMaps", // โหลดแผนที่หนึ่งอำเภอ (ทุกตำบลของทุกอำเภอนั้นๆ)
          "GET /coordinates/tambol/:id": "tambol.getTambolMaps", // โหลดแผนที่หนึ่งตำบล (ทุกหมู่บ้านของตำบลนั้นๆ)
          "GET /poor/country/:year": "poorcountry.getPoorCountry", // โหลดข้อมูลคนจนทั้งประเทศ (1ข้อมูล)
          "GET /poor/province/:year": "poorprovince.getPoorProvince", // โหลดข้อมูลคนจน (77 ข้อมูล)
          "GET /poor/province/max/:year": "poorprovince.getMaxPoorProvince", //โหลดข้อมูลจังหวัดที่มีคนจนมากที่สุด
          "GET /poor/province/order/:year/:order":
            "poorprovince.getOrderPoorProvince",
          // โหลดข้อมูล indicater
          "GET /poor/province/ind/:year/:ind":
            "poorprovince.getIndicaterPoorProvince",
          "GET /poor/amphur/problem/:year/:prov_ID":
            "pooramphur.getProblemAmpur", // โหลดข้อมูลปัญหา 5 ด้านของจังหวัดนั้นๆ
          "GET /poor/amphur/:year/:prov_ID": "pooramphur.getPoorAmphur", // โหลดข้อมูลคนจนในจังหวัดนั้นๆ
          "GET /poor/amphur/max/:year/:prov_ID": "pooramphur.getMaxAmphur",
          "GET /poor/amphur/ind/:year/:prov_id/:ind":
            "pooramphur.getIndicaterPoorAmhpur",
          "GET /poor/amphur/order/:year/:id/:order":
            "pooramphur.getOrderPoorAmphur",
          "GET /poor/tambol/problem/:year/:amp_ID":
            "poortambol.getProblemTambol",
          "GET /poor/tambol/order/:year/:id/:order":
            "poortambol.getOrderTambol",
          "GET /poor/tambol/max/:year/:id": "poortambol.getTambolMax",
          "GET /poor/tambol/:year/:id": "poortambol.getTambol",
          "GET /poor/tambol/ind/:year/:ampCode/:ind":
            "poortambol.getTambolIndicater",
        },
      },
    ],
  },
});

// import coordinates services
const CountryBroker = require("./services/coordinates/Country");
const ProvinceBroker = require("./services/coordinates/Province");
const AmphurBroker = require("./services/coordinates/Amphur");
const TambolBroker = require("./services/coordinates/Tambol");

//import poor data services
const PoorCountry = require("./services/PoorData/PoorCountry");
const PoorProvince = require("./services/PoorData/PoorProvince");
const PoorAmphur = require("./services/PoorData/PoorAmphur");
const PoorTambol = require("./services/PoorData/PoorTambol");

const CentroidProvince = require("./services/centroid/CentroidProvince");

Promise.all([
  StartBroker.start(),
  CountryBroker.start(),
  ProvinceBroker.start(),
  AmphurBroker.start(),
  TambolBroker.start(),
  PoorCountry.start(),
  PoorProvince.start(),
  PoorAmphur.start(),
  CentroidProvince.start(),
  PoorTambol.start(),
]);
