# Upload this corrected project to GitHub

The repository root should look exactly like this after upload:

```text
README.md
UPLOAD_TO_GITHUB.md
render.yaml
.gitignore
.github/
dashboard/
data/
docs/
lab/
ansible/
scripts/
```

Do **not** upload an extra outer folder such as `ResilientCore_Lab_FIXED/` or `resilientcore-lab/` inside the repository.

## Existing repository

For `EricaNordlof/resilientcore-lab`, replace the previously nested upload with the contents of this package at repository root.

## Render

Recommended Static Site settings:

```text
Repository:        EricaNordlof/resilientcore-lab
Branch:            main
Root Directory:    (leave blank)
Build Command:     (leave blank)
Publish Directory: dashboard
```

The dashboard now includes its own `network-state.json`, so the service-health and incident cards load correctly when only `dashboard/` is published.
