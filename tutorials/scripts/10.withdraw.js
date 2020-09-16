//approve withdraw address and withdraw ETH and tokens 
require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var addresses = require("./addresses.json");
const utils = require("./utils.js");
var convertToTWei = utils.convertToTwei;
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.accounts.wallet.add(operator);
const reserveManager = new FPR.Reserve(web3, addresses);
(async () => {
  //admin operations - approve withdraw address
   console.log('approve withdraw address');
 await reserveManager.approveWithdrawAddress(account.address, KTTokenAddress, '0x9e5f206aA7aAc88fe4d5Bc378d114FF8bD5A67c5');
//withdraw is an only operator function
  console.log("withdraw KTT")
await reserveManager.withdraw(
            operator.address, KTTokenAddress,
             convertToTWei(100), '0x9e5f206aA7aAc88fe4d5Bc378d114FF8bD5A67c5'
        );
})();