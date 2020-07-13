require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var data = require("./stepFuncdata.json");
var addresses = require("./addresses.json");
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";

const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);

web3.eth.accounts.wallet.add(operator);
const rate =  new FPR.RateSetting (KTTokenAddress, 4500000000000000,4700000000000000);
(async () => {
   const blockNumber = await web3.eth.getBlockNumber();
   //setRate is a only operator function 
   console.log("Setting base buy/sell rates")
   await reserveManager.setRate(operator.address, [rate] , blockNumber);
  
   //intitializing these to 0 just for getting rates - only meant for tutorial-1
   //will be explained and changed over the next parts
   //operator functions as well
   console.log("setting imbalance step func's");
   await reserveManager.setImbalanceStepFunction (operator.address, KTTokenAddress, data.buy, data.sell);
   console.log("setting quantity step func's");
   await reserveManager.setQtyStepFunction(operator.address, KTTokenAddress, data.buy, data.sell);
   console.log("done");
})();
   
