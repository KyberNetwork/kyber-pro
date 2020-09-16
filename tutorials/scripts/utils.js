var BigNumber = require("bignumber.js");
var FPR = require("kyber-fpr-sdk");
function valueWithDecimal(value, decimal) {
    var dc = new BigNumber(10).exponentiatedBy(decimal);
    var b = new BigNumber(value);
    return b.multipliedBy(dc).toString();
 };
  module.exports.convertToTwei = function convertToWei(value) {
   return valueWithDecimal(value, 18);
};

module.exports.stepFuncData = function toStepFuncData(data) {
   //convert each data.buy element into StepFunctionDataPoint
   const buy = data.buy.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
   // convert each data.sell element into StepFunctionDataPoint
   const sell = data.sell.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
   return {buy:buy, sell:sell};
};