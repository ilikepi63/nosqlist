const transform             = require("../src/transform");
const flatten               = require("../src/flat");

const {Customer}            = require("./testData/onlineBankingService");

console.log( flatten({ collection: Customer, config: {includeDef : false} }));