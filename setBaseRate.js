var FPR = require("kyber-fpr-sdk")
var conversionRates = require("kyber-fpr-sdk/dist/conversion_rates_contract")
var Web3 = require("web3")

var addresses = require("./addresses.json")
const KTTokenAddress = "0x4aeEd3fe72B1fA4c2ef58c7C3159Dc7558F0Aa40"

const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)
const operatorAccount = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY)

//setting operator for conversion rates contracts using the base_contract class
const reserve = new FPR.Reserve(web3, addresses)
const baseContract = new FPR.BaseContract(web3, addresses.conversionRates)

web3.eth.accounts.wallet.add(account)
web3.eth.accounts.wallet.add(operatorAccount)
const rate =  new conversionRates.RateSetting (KTTokenAddress, 4500000000000000,4700000000000000)
console.log(rate)

//setRate is a only operator function hence adding operator to conversionrates
baseContract.addOperator(account, '0x9e5f206aA7aAc88fe4d5Bc378d114FF8bD5A67c5')
.then( result => { console.log(result)
web3.eth.getBlockNumber().then (blockNumber => {
reserve.setRate(operatorAccount, [rate] , blockNumber)
   .then ( result => {console.log(result)})
   .catch( error => { console.log(error)})
   })

}) .catch(error => {console.log(error)})

