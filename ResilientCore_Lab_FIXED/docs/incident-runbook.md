# Third-line incident runbook

## Scenario

Customer reports intermittent loss across an L3VPN. NOC confirms alarms on one core path but service remains partially reachable.

## 1. Establish impact

- Which customers/services are affected?
- Complete outage or degradation?
- One site, one PE, one region, or multiple services?
- Exact start time and recent changes?

## 2. Check physical/interface state

- interface up/down
- errors, discards, CRC
- optics/light levels where applicable
- recent flaps

## 3. Check IGP

- expected IS-IS adjacencies
- LSP database consistency
- route to PE/P loopbacks
- metric changes or unexpected path selection

## 4. Check MPLS/SR transport

- label/SID reachability
- forwarding entries
- MTU mismatch
- ECMP behavior

## 5. Check VPN control plane

- MP-BGP session state
- VPNv4/VPNv6 route presence
- RD/RT correctness
- route-policy filters
- CE-PE routing state

## 6. Prove forwarding path

Run hop-by-hop tests and compare expected primary/backup path.

## 7. Stabilize before optimizing

Restore service first. Do not combine unrelated cleanup with an active incident.

## 8. Close with evidence

- root cause
- impact
- exact timeline
- fix
- validation
- preventive action
