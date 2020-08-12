//example to set tokencontrolinfo
require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var addresses = require("./addresses.json");
const { convertToTwei } = require('./utils');
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
//convertToTWei - converts to equivalent token wei amount 
const tokenInfo = new FPR.TokenControlInfo(
                        convertToTwei(0.001),
                        convertToTwei(250),
                        convertToTwei(550));
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
const reserveManager = new FPR.Reserve(web3, addresses);
(async () => {
  //admin operations
   console.log('Adding token details');
 await reserveManager.updateTokenControlInfo(account.address, KTTokenAddress, tokenInfo);
   })();