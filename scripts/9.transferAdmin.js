require('dotenv').config()
var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")
var addresses = require("./addresses.json")
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY)
const newAdmin = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY)
const baseContract = new FPR.BaseContract(web3, addresses.reserve);
web3.eth.accounts.wallet.add(account);
web3.eth.accounts.wallet.add(newAdmin);

(async() => {
    //transfer Admin to new Admin
    console.log("Transferring Admin..... Might take a while for the tx to be mined ");
    await baseContract.transferAdmin(account.address , '0x9e5f206aA7aAc88fe4d5Bc378d114FF8bD5A67c5');
    //claim admin using new Admin account
    console.log("claimAdmin from new admin account......");
    await baseContract.claimAdmin(newAdmin.address);
    //Console log new admin 
    console.log("New admin is " + await baseContract.admin());
})();