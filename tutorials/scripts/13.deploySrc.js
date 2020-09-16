//needs to be worked on....





require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
var fs = require("fs");
var addresses = require("./addresses.json")
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY);
const deployer = new FPR.Deployer(web3);
const KNAddress = '0x920B322D4B8BAB34fb6233646F5c87F87e79952b';
console.log ("Deploying sanityrates contract to Ropsten");
deployer.web3.eth.accounts.wallet.add(account);
const reserveManager = new FPR.Reserve(web3, addresses);
//deploy sanityrates and set contracts of the reserve.
(async ()=>{
    const res = await deployer.deploySanityRates(account.address);
    addresses.sanityRates = res;
    console.log(addresses);
    fs.writeFileSync("addresses.json", JSON.stringify(add)); 
    console.log('Linking Contracts');
    await reserveManager.setContracts(account.address, KNAddress, addresses.conversionRates,addresses.sanityRates);
    console.log("Done!"); 
})();
