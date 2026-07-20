# Dashboard deployment

The dashboard is intentionally self-contained inside `dashboard/` so it can be published as a static site without a backend.

## Render — manual setup

- Service type: **Static Site**
- Branch: `main`
- Root directory: leave blank when the repository files are at the repository root
- Build command: leave blank (or use a harmless echo command)
- Publish directory: `dashboard`

The dashboard loads `dashboard/network-state.json` with a relative URL (`./network-state.json`). This avoids the common deployment error caused by trying to fetch a file outside the published static directory.

## Render Blueprint

A `render.yaml` file is included at repository root. It publishes `./dashboard` as the static site.

## Updating sample state

`data/network-state.json` is the canonical sample state used by validation scripts. The dashboard has a deployment copy at `dashboard/network-state.json`.

When the sample data changes, update both files. GitHub Actions checks that they remain byte-for-byte identical.
