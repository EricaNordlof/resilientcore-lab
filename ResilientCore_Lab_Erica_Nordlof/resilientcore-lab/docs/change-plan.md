# Example change plan — migrate PE transport path to Segment Routing

## Purpose

Introduce SR-MPLS capability while preserving existing customer VPN reachability.

## Preconditions

- current routing state is healthy
- maintenance window approved
- rollback configuration saved
- NOC informed
- affected services identified
- telemetry and alarms monitored

## Risk

**Medium.** Incorrect SID/SRGB configuration or IGP advertisement could affect transport reachability.

## Implementation

1. Capture pre-change routing, adjacency and VPN state.
2. Verify consistent SRGB design.
3. Enable SR capability on one core node at a time.
4. Validate IGP database and prefix-SID advertisement.
5. Confirm PE loopback reachability.
6. Confirm VPNv4 BGP remains Established.
7. Run customer service probes.
8. Observe counters/alarms for 15 minutes.

## Acceptance criteria

- no unexpected adjacency loss
- no customer route loss
- no sustained packet loss above agreed threshold
- redundant path remains available

## Rollback trigger

Rollback immediately if:

- PE loopback reachability is lost
- VPNv4 BGP drops and does not recover within the expected convergence window
- customer service test fails
- unexplained high packet loss or routing instability occurs

## Rollback

1. Remove SR changes from most recently modified node.
2. Restore saved configuration if needed.
3. Validate IGP, BGP and customer services.
4. Notify NOC and document outcome.
