# Network security design

## Objectives

- protect control plane and management plane
- limit blast radius through segmentation
- preserve availability during faults and attacks
- make changes auditable
- avoid exposing management services to customer networks

## Controls

### Management plane

- dedicated management VRF/OOB network in production
- SSH only; disable insecure clear-text management protocols
- AAA with named accounts and least privilege
- MFA where supported by management platform
- centralized logging and time synchronization

### Control plane

- routing adjacencies only on intended interfaces
- authentication for routing protocols where supported
- prefix filters and maximum-prefix limits at boundaries
- control-plane policing
- explicit BGP policies; no accidental route leaks

### Data plane

- VRF segmentation between customer contexts
- infrastructure ACLs protecting loopbacks and management addresses
- anti-spoofing/uRPF where operationally appropriate
- DDoS detection/mitigation integration in real deployments

### Change safety

Every change requires:

- scope
- dependency check
- impact/risk statement
- pre-checks
- implementation steps
- post-checks
- rollback trigger
- rollback steps
- evidence and documentation update

## 802.1X / Dot1x note

For enterprise access use cases, 802.1X can provide identity-based network access with RADIUS-backed policy. In a production design, fallback behavior, MAB, certificate lifecycle, guest access and failure modes must be explicitly designed and tested.
