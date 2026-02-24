See the browser window: add --headed.
Run a single project/browser: --project=chromium.
Run one file: npx playwright test tests/example.spec.ts.
Open testing UI: --ui.
npx playwright codegen 
npx playwright test -g "add a todo item"
npx playwright test --last-failed
npx playwright test --debug
npx playwright test --workers=1

npx playwright test --grep @fast
npx playwright test --grep "@fast|@slow"
npx playwright test --grep-invert @fast

npx playwright test --reporter=line
npx playwright test --retries=3

A project is logical group of tests running with the same configuration. We use projects so we can run tests on different browsers and devices. Projects are configured in the playwright.config.ts

---

## Performance tests (k6)

Aside from functional and API automation, the repository includes a set of **k6** scripts located in `k6/`.
The principal load‑test (`notes-api-load-test.js`) exercises every endpoint of the Notes API using realistic user flows, custom metrics, and threshold definitions.  To execute:

```bash
npm run perf:k6
```

You can override the base URL via `BASE_URL`, register new users (`REGISTER_NEW_USER=1`) or supply existing credentials via `TEST_USER`/`TEST_PASS`.  Results are printed to console and may be exported with `--out` or `--summary-export` for HTML/JSON reports.