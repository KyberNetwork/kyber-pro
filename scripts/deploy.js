require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var fs = require("fs");
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY);
//@param KNAddress - this is for ropsten testnet. for mainnet use 0x7C66550C9c730B6fdd4C03bc2e73c5462c5F7ACC
const KNAddress= '0x920B322D4B8BAB34fb6233646F5c87F87e79952b';
const deployer = new FPR.Deployer(web3);

console.log ("Deploying smart contracts to Ropsten");
deployer.web3.eth.accounts.wallet.add(account);

(async ()=>{
    const res = await deployer.deploy(account, KNAddress);
    fs.writeFileSync("./addresses.json",JSON.stringify(
        {reserve: res.reserve, conversionRates: 
            res.conversionRates, sanityRates:
             res.sanityRates}));
        console.log("Done!"); 
     })();