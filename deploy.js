require('dotenv').config()
var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")
var fs = require("fs")
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY)

const deployer = new FPR.Deployer(web3)

console.log ("Deploying smart contracts to Ropsten")
deployer.web3.eth.accounts.wallet.add(account)

deployer.deploy(account).then(res => {
    console.log("Deploying contracts to Ropsten")
    fs.writeFileSync("addresses.json",JSON.stringify(
        {reserve: res.reserve, 
            conversionRates: res.conversionRates, 
            sanityRates: res.sanityRates}))
            console.log("Done!")})