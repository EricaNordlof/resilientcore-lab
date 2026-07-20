# Network architecture

## Goal

Design a small but realistic provider-style network that demonstrates how routing, transport, VPN services, redundancy and operations fit together.

## Roles

- **P routers:** transport only. They do not hold customer VRFs.
- **PE routers:** terminate customer services, hold VRFs and exchange VPN routes.
- **CE routers:** represent customer edge routers with dual-homing for redundancy.

## Underlay

IS-IS Level 2 is used conceptually as the provider IGP. Loopbacks are the stable router identities and are advertised through the underlay.

### Why not OSPF?

OSPF could also support the lab. IS-IS was selected because the target use case is service-provider networking. A migration or interoperability design would explicitly compare operational familiarity, convergence, scale and tooling before choosing.

## Transport

The lab models Segment Routing/MPLS intent:

- consistent SRGB
- node SIDs tied to loopbacks
- redundant equal-cost paths where practical
- separation between transport and customer services

LDP is documented as an alternative/legacy label distribution mechanism. SRv6 is treated as a future-state option requiring IPv6-native transport, hardware support, MTU analysis and operational readiness.

## L3VPN

- MP-BGP VPNv4 between PE loopbacks
- one VRF per customer/service context
- unique RD per VRF instance
- route targets control import/export policy
- CE connectivity can use eBGP, static routing or an IGP depending on service requirements

## L2VPN design options

### VPWS
Point-to-point pseudowire service. Suitable when exactly two endpoints need transparent L2 connectivity.

### VPLS
Multipoint L2 service. Useful for legacy multipoint Ethernet but can create operational complexity at scale.

### EVPN
Preferred modern control-plane model for many L2/L3 overlay designs because BGP distributes endpoint reachability and reduces reliance on data-plane learning.

## High availability

- dual PE attachment for each customer
- dual P paths between PE routers
- no single core link is required for reachability
- pre/post-change validation required before a change is accepted

## Acceptance criteria

A change is accepted only when:

1. all expected IS-IS adjacencies are up;
2. PE-to-PE VPNv4 BGP is Established;
3. required VRFs are present;
4. customer service tests pass;
5. redundant forwarding path remains available;
6. alarms and counters show no unexpected degradation.
