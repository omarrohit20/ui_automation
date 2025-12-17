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