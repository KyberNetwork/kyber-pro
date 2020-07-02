require('dotenv').config()
var FPR = require("kyber-fpr-sdk")
var Web3 = require("web3")
var fs = require("fs")
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)

const deployer = new FPR.Deployer(web3)

console.log ("Deploying smart contracts to Ropsten")
deployer.web3.eth.accounts.wallet.add(account)

deployer.deploy(account).then(addresses => {

    const replace = {'_reserve': 'reserve','_conversionRates':'conversionRates', '_sanityRates': 'sanityRates'}
    let replacedaddresses = Object.keys(addresses).map((key) => {
        const n = replace[key]||key
      return {[n]:addresses[key]}})
      var caddresses = replacedaddresses.reduce((a,b) => Object.assign({},a,b))
      var jsonContent = JSON.stringify(caddresses);

      fs.writeFile("addresses.json", jsonContent, 'utf8', function (err) {
          if (err) {
              console.log("An error occured while writing JSON Object to File.");
              return console.log(err)
          }
          console.log("JSON file has been saved.")
      })
      console.log("smart contracts are deployed!" + caddresses)
   })