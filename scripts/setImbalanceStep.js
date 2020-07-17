require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
const utils = require("./utils.js");
var convertToTWei = utils.convertToTwei;
var stepFuncData = utils.stepFuncData;
var addresses = require("./addresses.json");
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
 
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);
web3.eth.accounts.wallet.add(operator);
 
//convertToTWei - converts to equivalent token wei amount 
imbalance = {
   "buy":[
       {"x": convertToTWei(10), "y": 0},
       {"x": convertToTWei(100), "y": -30}
   ],
   "sell":[
      {"x": convertToTWei(0), "y": 0},
      {"x": convertToTWei(-10), "y": -30}
   ]
};
var imbalanceData = stepFuncData(imbalance);
 
(async () => {
   
   //setQtyStepFunction is a only operator function 
   console.log("setting imbalance step func's");
   await reserveManager.setImbalanceStepFunction(operator.address, KTTokenAddress, imbalanceData.buy, imbalanceData.sell);
   console.log("done");
})();
 