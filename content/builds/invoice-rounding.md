---
title: Invoices that match the charge
oneliner: Making the accounting system invoice exactly what the customer paid, down to the smallest currency unit
started: 2026-09-29
source: logs
links: []
---

## Why

For an e-commerce client, invoices in the accounting system kept landing a unit or two off what the payment provider had charged.
The shop, the payment provider and the accounting system each round on their own, and the accounting system is reached through an integration layer.
So the fix had to start with a correct model of how it rounds, tested against real invoices, not guessed.

## Stack

An order pipeline that sends orders from a web API to the shop and on to the accounting system through an integration layer.
Fixes built on agent branches and run through no-mistakes, a tool I use for review, tests and CI.
Offline replays of real order history to test every rounding change before it ships.

## Log

2026-09-29 TRIED Order totals now compute VAT in integer minor currency units and round once. An offline replay of a full month of orders fixed every off-by-one case and broke none of the exact ones.
2026-09-30 BROKE Invoices still drifted from the charge. My model then: the accounting system rounds each row's VAT-inclusive unit price to whole minor units, times quantity, so a bundle split into per-item rows lost one unit per bundle.
2026-09-30 WORKS Bundles now go out as up to two rows of the same item at whole-unit prices that sum exactly to the bundle price. A search picks nets near each row's own until invoice rows and shop total agree, and the fee row tops both up to the charge.
2026-10-02 WORKS Orders where a credit comes off the invoice landed a few units off too. They now get the same whole-unit rows, and tests assert that the total under the accounting system's rounding equals the order total.
2026-10-03 BROKE The model was wrong. Through the integration layer the accounting system rounds the net per unit half to even, adds VAT and rounds again, instead of rounding the VAT-inclusive price.
2026-10-03 WORKS Encoded the new rule in one small piece of code. It reproduces nearly all exported invoices, clearly more than the old rule did, and the few misses were rows the accounting system dropped.
2026-10-03 WORKS Replayed on a read-only copy of production, every affected order now invoices at its shop total, against far fewer on main.
2026-10-03 NOTE The exact rows are switched on per tenant, because the rule was fitted on one tenant's invoices only. When no exact nets exist the order still goes out, and raises an alert.
2026-10-03 NOTE A test double simulates the accounting system's rounding, so tests check the invoice total and not only the payload. The no-mistakes review simplified my fallback to a plain alert with the order id.
