var FPR = require("kyber-fpr-sdk")
var conversionRates = require("kyber-fpr-sdk/dist/conversion_rates_contract")
var Web3 = require("web3")
var addresses = require("./addresses.json")
const tokenInfo = new conversionRates.TokenControlInfo(100000000000000,440000000000000000000n,920000000000000000000n)
const KTTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4"
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)

const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)
web3.eth.accounts.wallet.add(account)

const reserveOperator = new FPR.Reserve(web3, addresses)

reserveOperator.addToken(account, KTTTokenAddress, tokenInfo)
   .then( result => {console.log(result)})
   .catch( error => { console.log(error)})

