## Frequently Asked Questions

## How do I specify the reserve rebate wallet for these rebates?

Whenever a reserve is added to the network, the rebate wallet must also be specified as well.

## What if I need to change the rebate wallet address?

Notify the Kyber team / network maintainers!

## Do the rebates go automatically to the rebate wallet I specified?

No. You will have to claim them manually through the KyberFeeHandler contract(s).

## How do I view the rebate amount claimable?

Call the `rebatePerWallet` method of the KyberFeeHandler contract(s). Note that for gas optimizations, 1 ether wei is kept inside the contract, so the claimable amount has to be subtract by 1.
Refer to [example](/docs/reservesRebates.md)

## How do I claim reserve rebates?

Call the `claimReserveRebate` method of the KyberFeeHandler contract(s).
Refer to [example](/docs/reservesRebates.md)