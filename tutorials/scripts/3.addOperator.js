//example to set operator to the conversionrates contract
require('dotenv').config()
var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")
var addresses = require("./addresses.json")
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_ADMIN_PRIVATE_KEY)
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY)
const CRContract = new FPR.ConversionRatesContract(web3, addresses.conversionRates)
web3.eth.accounts.wallet.add(account)
//setting operator
CRContract.addOperator(account.address, operator.address)
.then( result => { console.log(result)})