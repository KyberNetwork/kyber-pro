require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var addresses = require("./addresses.json");
//convertToTWei - converts to equivalent token wei amount 
const tokenInfo = new FPR.TokenControlInfo(
                           convertToTwei(0.001),
                           convertToTwei(440),
                           convertToTwei(920));
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";

const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY)
web3.eth.accounts.wallet.add(account);

const manageReserve = new FPR.Reserve(web3, addresses);
(async () => {
   console.log('Adding token')
 await manageReserve.addToken(account.address, KTTokenAddress, tokenInfo)
   })();
