# Walkthrough 2: Controlling Rates

In walkthrough 1, we have already deployed a reserve to testnet, added a token pair (KTT/ETH), set initial rates, and listed the token to Kyber Network. In this walkthrough, we will help you understand how you can control rates and quotes on the reserve. In particular, you will learn how to mirror the orderbook style of pricing to the FPR.

## How FPR Controls Rates
Kyber FPR provides powerful and efficient methods to market make onchain by having different pricing logics,safety measure like sanityrate check, step quantity and imbalance functions, and  gas efficient methods for controlling rates for multiple token in a single tx.

A user that buys/sells a big number of tokens will have a different impact on the portfolio compared to another user that buys/sells a small number of tokens. 

The purpose of steps, therefore, is to have the contract automatically alter the price depending on the buy / sell quantities(QtyStepfunction) of a user, and the net traded amount between price update operations(ImbalanceStepFunction). 

For the purpose of this walkthrough, we will assume that the price of the KTT token is equivalent to 0.0042ETH or 1 USD i.e., 1 ETH = 240KTT. 

***Getting Started***
## Requirements For Walkthrough 
* should have completed the walkthrough 1 (link) 
* Have contracts deployed.

If you have not completed the first walkthrough, and tested trading the KTT tokens on testnet, please go through that before going ahead. Feel free to contact us in case of any questions.

Topics included: 

1. [Setting Quantity Step Function](#1-Quantity-Step-Functions-Orderbook-Simulation)
2. [Setting an Imbalance Step Function](#2-Imbalance-Functions)
3. [Changing the default token parameters](#3-Changing-the-default-token-parameters)
4. [Testing](#4-Testing-Your-Rates)

The source code for this walkthrough is at [link](https://github.com/KyberNetwork/fpr-js-reference/scripts). 

# 1. Quantity Step Functions: Orderbook Simulation 
QtyStepFunction basically allows you to set buy and sell rates for different quantities. Buy and sell steps are used to change ASK & BID prices respectively.


*Scenario:* If a user wants to buy 100 KTT tokens , the conversion rate will be the base rate i.e., 240 KTT/ETH. When the user wants to buy more than 200 tokens , the conversion rate will be lower by 0.3% , rate = 239.28 KTT/ETH. Similarly , for selling 100 KTT tokens , the conversion will be the base rate i.e., 0.0042ETH/KTT. And for selling more than 200 tokens , the conversion rate will be lower by 0.3% , i.e, rate will be 0.004187 ETH/KTT

An example step would look like 
```js
steps = {
  "buy":[
      {"x": convertToTWei(100), "y": 0},
      {"x": convertToTWei(200), "y": -30}
  ],
  "sell":[
     {"x": convertToTWei(100), "y": 0},
     {"x": convertToTWei(200), "y": -30}
  ]
};

Where:
X - is the quantity of token in wei
Y - is the impact on conversion rate in basis points (bps)
```
The rate will be reduced by the Y-value set in each step(non-positive values will modify the rate to be lower/worse). 
Instead of negative steps, meaning worse rates, setting positive step values will give user better rates and could be considered as an advanced method to encourage users to rebalance the inventory

```js
// full code in fpr-sdk-reference/scipts/setQtyStep.js
//stepFuncData, convertToTwei are functions in utils.js
var stepsData = stepFuncData(steps);
(async () => {
 
  //setQtyStepFunction is a only operator function
  console.log("setting quantity step func's");
  await reserveManager.setQtyStepFunction(operator.address, KTTokenAddress, stepData.buy, stepData.sell);
  console.log("done");
})();
```

## 2. Imbalance Functions: 
Imbalance step function allows different conversion rates based on the net traded token amount between price update operations.
The motivation for imbalance step functions is to prevent imbalances in your inventory, in between price updates.
*Scenario:*
If Alice buys 100 KTT, Bob 50 KTT, and Carol buys 10 KTT, then the net traded amount is -60 KTT. When the net traded amount reaches a certain level, the conversion rate returned will be lower by 0.3%. If the net traded amount is -100 KTT, then the conversion rate returned is 0.6%, and so on, depending on the levels defined.

In this case, selling KTT becomes cheaper and buying KTT becomes expensive by basis points.
```js
imbalance = {
  "buy":[
      {"x": convertToTWei(10), "y": 0}, // the price wouldn’t change for every +10 imbalance
      {"x": convertToTWei(50), "y": -30}// the price will lower by 0.3% for imbalance above 50 KTTtokens 
  ],
  "sell":[
     {"x": convertToTWei(0), "y": 0},
     {"x": convertToTWei(-10), "y": -30} // price will be lower by 0.3% for imbalances below 10KTTtokens
  ]
};

Where:
X - is the net imbalanced token quantity in wei
Y - is the impact on conversion rate in basis points (bps)
```
Similar to step functions, the rate will get worse due to the non-positive Y-value set in each step.
```js
// full code in fpr-sdk-reference/scipts/setImbalanceStep.js
var imbalanceData = stepFuncData(imbalance);
(async () => {
  //setImbalanceStepFunction is a only operator function
  console.log("setting imbalance step func's");
  await reserveManager.setImbalanceStepFunction(operator.address, KTTokenAddress, imbalanceData.buy, imbalanceData.sell);
  console.log("done");
})();
```

The step BPS values should always be non-positive (<=0) in this case, because the smart contract reduces the output amount by the Y-value set in each step.

## 3. Changing the default token parameters 

In walkthrough 1, we set the params to a few default values when adding KTT token to the reserve, however based on the amount of liquidity offered for a particular token, they can be changed accordingly. 

 Now, let us understand and determine the parameters:
*minimalRecordResolution:* Per trade imbalance values are recorded and stored in the contract, parameter exists as a check to prevent overflow while squeezing data. Recommendation would be the token wei equivalent of $0.001 - $0.01
*maxPerBlockImbalance:* limit on amount of net absolute (+/-) change for a token in an ethereum block.
*maxTotalImbalance:* Maximum amount of net token change that happens between 2 price updates. Should be >=maxPerBlockImbalance

In this case, we will set the maximum change in the token inventory per block to be 250 KTT and the net(buy/sell) token change that can happen between consecutive price updates to be 550 KTT.  

```js
// full code in fpr-sdk-reference/scipts/updateTokenContolInfo.js

const tokenInfo = new FPR.TokenControlInfo(
                       convertToTwei(0.001),
                       convertToTwei(250),
                       convertToTwei(550));

(async () => {
console.log(‘Adding Token Details’);
await reserveManager.updateTokenControlInfo(account.address, tokenAddress, tokenInfo); })();
```
## 4. Testing Your Rates

Ideally, when querying for rates via smart contracts or through Kyberswap ropsten, the rates for different buy/sell quantities will differ.
We encourage you to buy and sell in different quantities to understand the impact of trades on your inventory and conversion rates returned.
```js
Example :
Selling KTT
100 KTT <> ETH rate returned for 1 KTT = 0.004222 ETH
1000 KTT <> ETH rate returned for 1 KTT = 0.004215 ETH
5000  KTT <> ETH rate returned for 1 KTT = 0.004207 ETH

Buying KTT
1 ETH <> KTT rate returned for 1 KTT = 0.004248 ETH
3 ETH <> KTT rate returned for 1 KTT = 0.004249 ETH
5 ETH <> KTT rate returned for 1 KTT = 0.004251 ETH
```

## Notes:


1. Since, all actions are on-chain, there is a check on the number of blocks these rates are valid. The default while deploying the reserve is around 10 blocks. This can be changed to any number you deem appropriate. You could interact directly with the conversionRatesContract to do so. Code snippet @scripts/setValidDuration.js

2. One thing that needs to be paid attention to is the Block duration. If you have setBaserate in the earlier walkthrough, recommend you set that again, for this example again as rates would have expired. Optimization of these operations will be covered in the coming walkthroughs .

## Next Steps

That’s it for this walkthrough! We will come up with one more walthrough soon, in it we will demonstrate advanced functions related to handling multiple tokens and optimizing your on-chain market making. 

Links will appear here when ready! 
