# Contributing

## Workflow

1. Create a short branch from `main`.
2. Make the smallest coherent change.
3. Add or update tests.
4. Run the quality checks.
5. Open a Pull Request describing behavior, risks, and validation.
6. Merge only after review and passing CI.

## Commit messages

Use Conventional Commits in English:

```text
feat: add birth data validation
fix: handle unknown timezone
docs: document backup restoration
chore: update dependencies
```

## Code review checklist

- No secrets or personal data in logs, fixtures, screenshots, or analytics.
- Server-side validation for user input.
- Access control and RLS considered.
- Keyboard, focus, contrast, and reduced-motion behavior checked.
- Tests cover the changed behavior.
- Documentation and ADRs updated when a decision changes.
