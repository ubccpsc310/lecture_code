# 12a: Non-Functional Requirements

A tiny schedules API. `before/` is the starting point; `after/` adds the tests from the demo and activity.

Run from `schedules/before` or `schedules/after`:

```sh
yarn test    # run the tests
yarn start   # serve the API on http://localhost:3000
```

## Activity

For each what-if, **write the scenario as a comment (Given/When/Then), then the test.** Copy the shape of the example test.

1. **Malformed:** what if the request body is not what is expected?
2. **Huge:** what if the request has 100 sections? You'll need `this.timeout(...)` (so use `function () {}`, not an arrow function) and `Date.now()`. You'll also need to pick a threshold.

## Expected results in `after/`

| Test | Result |
| --- | --- |
| restart | ✅ |
| twice | ❌ 2 schedules |
| malformed | ❌ 500 |
| huge | ❌ about 2 s |
