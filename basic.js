require('dotenv').config()
var FPR = require("kyber-fpr-sdk")
var conversionRates = require("kyber-fpr-sdk/dist/conversion_rates_contract")
var Web3 = require("web3")
var addresses = require("./addresses.json")
var data = require("./stepFuncdata.json")
//tokencontrolinfo - minimalRecordResolution, maxPerBlockImbalance, maxTotalImbalance
const tokenInfo = new conversionRates.TokenControlInfo(100000000000000,440000000000000000000n,920000000000000000000n)
//custom token
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4"
//add credentials to your env variables
const provider = new Web3.providers.HttpProvider(process.env.ROPSTEN_NODE_URL)
const web3 = new Web3(provider)
const account = web3.eth.accounts.privateKeyToAccount(process.env.TESTNET_PRIVATE_KEY)
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY)
web3.eth.accounts.wallet.add(account)
web3.eth.accounts.wallet.add(operator)
const manageReserve = new FPR.Reserve(web3, addresses)
const CRContract = new FPR.ConversionRatesContract(web3, addresses.conversionRates)
//rate - token, buyRate, sellRate
const rate =  new conversionRates.RateSetting (KTTokenAddress, 4500000000000000,4700000000000000)
//adding token to the contract
manageReserve.addToken(account, KTTokenAddress, tokenInfo)
   .then( () => {
      //adding admin account as operator- ideally should be a different account in mainnet
      CRContract.addOperator(account, operator.address)
      .then( () => { web3.eth.getBlockNumber()
         .then (blockNumber => {
         //setRate is a only operator function
      manageReserve.setRate(operator, [rate] , blockNumber)
         .then ( () => { console.log("setting imbalance step func's")
         //intitializing these to 0 just for getting rates - only meant for tutorial-1
         //will be explained and changed over the next parts
         //operator functions as well
            manageReserve.setImbalanceStepFunction (operator, KTTokenAddress, data.buy, data.sell)
            .then(()=> {console.log("setting quantity step func's")
            manageReserve.setQtyStepFunction(operator, KTTokenAddress, data.buy, data.sell)
            .then(()=> {
                     console.log("done") 
                  }).catch( error => { console.log(error)})   
             }).catch( error => { console.log(error)})
         }).catch( error => { console.log(error)})
         }).catch(error => {console.log(error)})
      }) .catch(error => {console.log(error)})
   }).catch( error => { console.log(error)})