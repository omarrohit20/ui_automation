# k6 Performance Tests

This folder contains load testing scripts for the Notes API using [k6](https://k6.io).

## Structure

- `config/environments.js` – environment configuration (base URL).
- `utils/` – helper modules (data generators, authentication).
- `scripts/` – individual test scenarios. The main load test is in `notes-api-load-test.js`.

## Running

Install k6 (https://k6.io/docs/getting-started/installation/).

Run from workspace root:

```bash
BASE_URL=https://practice.expandtesting.com/notes/api \
  k6 run k6/scripts/notes-api-load-test.js
```

Options:
- `--vus`, `--duration`, and `--out` can override options defined in script.
- export results to InfluxDB, JSON or Cloud using `--out` flag.

## Metrics & KPIs

The script defines custom `Rate`, `Trend`, and `Counter` metrics along with thresholds:

- **http_req_duration** – 95th percentile under 600ms
- **http_req_failed** – failure rate < 1%
- **errors** – custom error rate < 5%
- **login_duration** – 95th percentile < 800ms
- **note_create_duration** – 95th percentile < 1000ms

The default k6 summary report (printed to console) includes the built-in metrics and threshold pass/fail results. Use `--summary-export` or `--out` to generate JSON, HTML, or InfluxDB results for advanced reporting.
