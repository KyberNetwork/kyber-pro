require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var data = require("./imbalanceStepdata.json");
var addresses = require("./addresses.json");
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
 
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);
web3.eth.accounts.wallet.add(operator);
 
const buy = data.buy.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
const sell = data.sell.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
 
(async () => {
   
   //setQtyStepFunction is a only operator function 
   console.log("setting imbalance step func's");
   await reserveManager.setImbalanceStepFunction(operator.address, KTTokenAddress, buy, sell);
   console.log("done");
})();
 