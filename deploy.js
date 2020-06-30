require('dotenv').config()

var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")

const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)

const deployer = new FPR.Deployer(web3)

deployer.web3.eth.accounts.wallet.add(account)
deployer.deploy(account).then(addresses => {
    console.log(addresses)    
})
