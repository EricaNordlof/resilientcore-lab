#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED_VRFS = {"CUSTOMER_A", "CUSTOMER_B"}
CORE_ROLES = {"PE", "P"}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: validate_network_state.py <network-state.json>")
        raise SystemExit(2)

    path = Path(sys.argv[1])
    if not path.exists():
        fail(f"file not found: {path}")

    data = json.loads(path.read_text(encoding="utf-8"))
    nodes = data.get("nodes", [])

    if len(nodes) < 6:
        fail("expected at least 6 nodes")

    down = [n["name"] for n in nodes if n.get("status") != "up"]
    if down:
        fail(f"nodes down: {', '.join(down)}")

    core_nodes = [n for n in nodes if n.get("role") in CORE_ROLES]
    low_adjacency = [n["name"] for n in core_nodes if n.get("isis_neighbors", 0) < 2]
    if low_adjacency:
        fail(f"insufficient IS-IS redundancy: {', '.join(low_adjacency)}")

    pe_nodes = [n for n in nodes if n.get("role") == "PE"]
    for pe in pe_nodes:
        if pe.get("bgp_vpnv4") != "established":
            fail(f"VPNv4 BGP not established on {pe['name']}")
        if not REQUIRED_VRFS.issubset(set(pe.get("vrfs", []))):
            fail(f"required VRFs missing on {pe['name']}")

    services = data.get("services", [])
    if not services or any(s.get("status") != "healthy" for s in services):
        fail("one or more services unhealthy")

    print(f"PASS: {len(nodes)} nodes checked")
    print("PASS: all core adjacencies are up")
    print("PASS: all required VRFs are present")
    print("PASS: redundancy target satisfied")


if __name__ == "__main__":
    main()
