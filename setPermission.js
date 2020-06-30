//example to set operator to the reserve
var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")
var addresses = require("./addresses.json")
const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)
const Breserve = new FPR.BaseContract(web3, addresses.reserve)
web3.eth.accounts.wallet.add(account)
//pass in the account you want to act as an operator
Breserve.addOperator(account, '0x9e5f206aA7aAc88fe4d5Bc378d114FF8bD5A67c5')
.then( result => { console.log(result)})

