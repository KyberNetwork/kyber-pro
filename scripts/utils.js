var BigNumber = require("bignumber.js")
function valueWithDecimal(value, decimal) {
    var dc = new BigNumber(10).exponentiatedBy(decimal);
    var b = new BigNumber(value);
    return b.multipliedBy(dc).toString();
 }
  module.exports.convertToTwei = function convertToWei(value) {
   return valueWithDecimal(value, 18);
}