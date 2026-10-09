---
title: Order jobs that never create blind
oneliner: Making an order pipeline safe to retry, so a timeout or a killed worker cannot ship a duplicate
started: 2026-09-29
source: logs
links: []
---

## Why

An e-commerce client's orders pass through queued jobs that create orders in the shop, which then go on to the warehouse system.
When a job timed out or a worker was killed, nobody knew whether the order had landed.
A retry could then create it a second time, and a duplicate order ships for real.
The rule I worked toward: no job creates an order without first checking whether it already exists.

## Stack

An order pipeline with a web API and queue workers between the shop, the payment provider and the warehouse system.
Each fix built on its own agent branch.
no-mistakes, a tool I use, ran review, tests, docs and CI on every branch and pushed its own fix commits.

## Log

2026-09-29 BROKE A payment submission lock held its claim forever after a killed process. The dead-holder check relied on a constant the language never defines, so reclaim could never fire, and its tests skipped on the same missing constant, so they never ran.
2026-09-29 TRIED Compare the last OS error code to the numeric value for "no such process" instead. The tests now fail when the extension they need is missing, instead of skipping.
2026-09-29 TRIED The queued order job may submit only on its first attempt. Queue retries and a reclaimed claim can no longer create an order blind; only a dedicated resubmit path that checks the shop first may retry.
2026-09-29 TRIED Order creation is gated on listing the shop's existing orders, so a create that timed out but landed gets recorded instead of duplicated.
2026-09-29 BROKE The worker's 30 s timeout killed order creates mid-flight. Proposed 150 s: above the HTTP client's 120 s, below the 180 s queue retry window.
2026-09-29 NOTE The warehouse system holds older orders under numbers the shop now reuses. The sync now attaches only to the one warehouse order created after the shop order, and refuses ambiguous matches.
2026-09-30 BROKE A package job had timed out, yet the order existed in the shop and had shipped. A re-release would have sent a duplicate.
2026-09-30 WORKS Merged the guard: the package job lists the shop's orders around its activation time first. Found means record it as shipped and create nothing; a listing error means throw and submit nothing.
2026-09-30 NOTE The no-mistakes review pass added a gate on order status and a settle window to that guard.
2026-09-30 WORKS Merged the dead-lock reclaim, the creation-date match and the first-attempt-only rule.
2026-10-04 WORKS Merged the 150 s timeout. The review pass made clear it covers only the order creation call, and the docs pass clarified the resubmit gate.
