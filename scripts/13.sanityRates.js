require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var addresses = require("./addresses.json");
const utils = require("./utils.js");
var convertToTWei = utils.convertToTwei;
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const admin = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);
web3.eth.accounts.wallet.add(operator);
web3.eth.accounts.wallet.add(admin);

const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
const DAITokenAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D"; 
(async () => {
    //setSanityRates - admin func'
    console.log("Setting sanity rates");
    await reserveManager.setSanityRates(operator.address, [KTTokenAddress,DAITokenAddress] , [convertToTWei(0.0040),convertToTWei(0.0018)]);
    //setReasonableDiff - admin func'
    console.log("Setting Reasonable Difference "); 
    //both the tokens set to a diff of 10%
    await reserveManager.setReasonableDiff(admin.address , [KTTokenAddress,DAITokenAddress], [1000, 1000]);
})();