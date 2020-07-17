# Walkthrough 2: Controlling Rates

This walkthrough will help you understand how you can control rates and quotes on the reserve. For the purpose of this walkthrough, we will assume that the price of the KTT token is equivalent to 0.0042ETH or 1 USD i.e., 1 ETH = 240KTT. 

Topics included: 

1. [Setting Quantity Step Function](#1-Setting-Qty-Step-Function:-:Orderbook-Simulation)
2. [Setting an Imbalance Step Function:](#2-Setting-an-Imbalance-Step-Function:)
3. [Changing the default token parameters](#3-Changing-the-default-token-parameters)
4.[Testing](#4-Test-Mode)

The reserve deployed in the first walkthrough is already listed to the network,so going forward it wouldn’t need any action from us, you can happily test how the pricing moves. Unless you want to add multiple tokens, we need to enable the token as well.

After going through this walkthrough, you will gain an understanding as to how you can mirror orderbook style of pricing to the FPR.

## How Controlling Rates work for FPRs
 A user that buys/sells a big number of tokens will have a different impact on the portfolio compared to another user that buys/sells a small number of tokens. The purpose of steps, therefore, is to have the contract alter the price depending on the buy / sell quantities(QtyStepfunction) of a user, and the net traded amount between price update operations(ImbalanceStepFunction). 

We have already set a baseRate to the token, lets now simulate an orderbook style of pricing action using step functions. 

## 1) Setting Qty Step Function: Orderbook Simulation 

*Scenario for buy:* If you user wants to buy 100 KTT tokens , the conversion will be the base rate i.e., 240 KTT/ETH. When the user wants to buy more than 200 tokens , the conversion rate will be lower by 0.3% , rate will be 239.28 KTT/ETH

QtyStepFunction basically allows you to set buy and sell rates for different quantities. Buy and sell steps are used to change ASK & BID prices respectively. An example buy step would look like 
```js
"buy":[
       {"x": converToTwei(100), "y": 0}, 
       {"x": converToTwei(200), "y": -30}
   ]
   ```
X is the quantity of token in wei, and y is the impact on conversion rate in basis points (bps), the rate will be reduced by the Y-value set in each step(non-positive values will modify the rate to be lower/worse). 

Instead of negative steps, meaning worse rates, setting positive step values will give user better rates and could be considered as an advanced method to encourage users to "re-balance" the inventory

Scenario for sell:** If you user wants to sell 100 KTT tokens , the conversion will be the base rate i.e., 0.0042ETH/KTT. When the user wants to sell more than 200 tokens , the conversion rate will be lower by 0.3% , i.e, rate will be 0.004187 ETH/KTT
```js
// full code in fpr-sdk-reference/scipts/setQtyStep.js

(async () => {
 
  //setQtyStepFunction is a only operator function
  console.log("setting quantity step func's");
  await reserveManager.setQtyStepFunction(operator.address, KTTokenAddress, stepData.buy, stepData.sell);
  console.log("done");
})();
```
**These scenarios are just as an illustration as to how you can manage different  rates, you can decide on the suitable numbers.**

## 2) Setting an Imbalance Step Function: 

Imbalance step function allows different conversion rates based on the net traded token amount between price update operations. Like if you have less ETH in your reserve than tokens then selling tokens become expensive and if you lesser tokens buying becomes expensive and vice-versa. Imbalance step functions can help manage reserve inventory between consecutive price updates. 

*Scenario:* within one block, when user A buys 100 tokens, B sells 80 tokens, the net traded amount is -20. In this case selling becomes cheaper and buy becomes expensive by basis points(0.3%)
```js
Eg : "sell":[
     {"x": convertToTWei(0), "y": 0},
     {"x": convertToTWei(-10), "y": -30}
```
The step bps values **should always be non-positive (<=0)** in this case,  because the smart contract reduces the output amount by the Y-value set in each step.
```js
// full code in fpr-sdk-reference/scipts/setImbalanceStep.js

(async () => {
 
  //setQtyStepFunction is a only operator function
  console.log("setting quantity step func's");
  await reserveManager.setQtyStepFunction(operator.address, KTTokenAddress, stepData.buy, stepData.sell);
  console.log("done");
})();
```

## 3) Changing the default token parameters 

These params were set to a few default values when adding KTT token to the reserve, however based on the amount of liquidity offered for a particular token, they can be changed accordingly. 

*Scenario:* For KKT we want the maximum change in the token inventory per a block to be 250 KTT and the net(buy/sell) token change that happens between consecutive price updates to be 550KTT

These parameters determine the limits for per-block(maxPerBlockImbalance) or between updates the net amount of each token can be traded (maxTotalImbalance). 

Per trade imbalance values are recorded and stored in the contract, minimalRecordResolution parameter exists as a check to prevent overflow while squeezing data. Recommendation would be the token wei equivalent of $0.001 - $0.01
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

## 4) Test Mode

Ideally, when querying for rates via smart contracts or through Kyberswap ropsten, the rates for different buy/sell quantities will differ.

Example :
```js
Conversion rates to sell KTT
100 KTT <> ETH rate returned for 1 KTT = 0.004222 ETH
1000 KTT <> ETH rate returned for 1 KTT = 0.004215 ETH
5000  KTT <> ETH rate returned for 1 KTT = 0.004207 ETH

Conversion rates to buy KTT

1 ETH <> KTT rate returned for 1 KTT = 0.004248 ETH
3 ETH <> KTT rate returned for 1 KTT = 0.004249 ETH
5 ETH <> KTT rate returned for 1 KTT = 0.004251 ETH
```

## Notes:


1. Since, all actions are on-chain, there is a check on the number of blocks these rates are valid. The default while deploying the reserve is around 10 blocks. This can be changed to any number you deem appropriate. You could interact directly with the conversionRatesContract to do so. Code snippet @scripts/setValidDuration.js

2. One thing that needs to be paid attention to is the Block duration. If you have setBaserate in the earlier walkthrough, recommend you set that again, for this example again as rates would have expired. Optimization of these operations will be covered in the coming walkthroughs .

## Next Steps

That’s it for the walkthrough! In the coming walkthroughs, we will demonstrate advanced functions related to handling multiple tokens and optimizing your on-chain market making. 

Links will appear here when ready! 
