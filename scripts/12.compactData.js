require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var data = require("./stepFuncdata.json");
var addresses = require("./addresses.json");
const utils = require("./utils.js");
var convertToTWei = utils.convertToTwei;
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
const DAITokenAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";

const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);
web3.eth.accounts.wallet.add(operator);

//RateSetting(tokenAddress, buy Rate, sell Rate)
//can add and modify rates for multiple tokens and pass in an array to set rate
const KTTrate =  new FPR.RateSetting (KTTokenAddress, convertToTWei(237),convertToTWei(0.0040));
const DAIrate =  new FPR.RateSetting (DAITokenAddress, convertToTWei(100),convertToTWei(0.0018));
(async () => {
   //rate updates apply from current block
   const blockNumber = await web3.eth.getBlockNumber();
   //setRate is a only operator function 
   console.log("Setting base buy/sell rates");
   await reserveManager.setRate(operator.address, [KTTrate, DAIrate] , blockNumber);
})();
   
