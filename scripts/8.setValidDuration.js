require('dotenv').config();
var Web3 = require("web3");
var addresses = require("./addresses.json");
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY)
web3.eth.accounts.wallet.add(account);
//import conversion rates abi.
const abi = require("kyber-fpr-sdk/abi/ConversionRatesContract.abi.json");
const crc = new web3.eth.Contract(abi, addresses.conversionRates);

//default gas
  const gas = 500 * 1000;
console.log("setting valid duration blocks");
crc.methods.setValidRateDurationInBlocks(10000 //number of blocks
    ). send({
        from: account.address,
        gas: gas
    })
    console.log("done");

