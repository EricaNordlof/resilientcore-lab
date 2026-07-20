# Cisco concept mapping

The lab uses open tooling so it can be shared publicly without vendor licensing. The concepts map to Cisco-style operational domains:

| Lab concept | Cisco operational equivalent |
|---|---|
| IS-IS Level 2 | IOS XR / IOS XE IS-IS underlay |
| Segment Routing MPLS | SR-MPLS with prefix SIDs / SRGB |
| MP-BGP VPNv4 | `address-family vpnv4` / VPN route distribution |
| VRF + RD/RT | MPLS L3VPN service segmentation |
| L2VPN design notes | EVPN / VPWS / VPLS service models |
| Ansible CLI validation | automated `show`/state validation and controlled config workflows |

The point of the project is to demonstrate architecture, protocol reasoning, operational safety and automation—not to imply vendor-specific production access that I do not have.
