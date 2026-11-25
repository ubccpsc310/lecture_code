# NFR To Design

To run the benchmarks, which repeatedly run `GET /schedules` and `POST /schedules` and record the time:

```bash
npx tsx bench.ts                           # http://localhost:3000, 20 requests per endpoint
npx tsx bench.ts http://localhost:3000 50  # base URL, then requests per endpoint
```

For the following NFRs, write each as a Given/When/Then scenario, and then a test. Then, use a cache to resolve the tension between Performance and Consistency such that both tests pass!

> Performance: responses should have low latency.
> NFR: GET /sections should respond in <10ms.

> Consistency: data should reflect changes of successful operations
> NFR: a saved schedule appears after being saved
