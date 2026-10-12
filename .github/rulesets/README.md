# Branch protection

`main.json` protects the default branch:

- Changes land through a pull request with **1 approval**
- The **`ci`** check (format, lint, typecheck, unit tests, build, production dependency audit) must pass
- No force pushes, no branch deletion
- Repository admins can bypass via a pull request in an emergency

## Apply it (one time, repo admin)

**Web UI:** Settings → Rules → Rulesets → New ruleset → **Import a ruleset** → choose `main.json` → Create.

**CLI:**

```bash
gh api repos/rishi222k/bank-agent-assist/rulesets --method POST --input .github/rulesets/main.json
```

Run the CLI command from a shell signed in to the account that owns the repo (`gh api user --jq .login` should print `rishi222k`).

The `ci` check only shows up as selectable after the CI workflow has run once, which happens on the first pull request.

Rulesets are enforced on public repositories on every plan, and on private repositories only with GitHub Pro, Team or Enterprise.
