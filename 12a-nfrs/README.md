# 12a: Non-Functional Requirements

A tiny schedules API. `before/` is the starting point; `after/` adds the tests from the demo and activity.

Run from `schedules/before` or `schedules/after`:

```sh
yarn test    # run the tests
yarn start   # serve the API on http://localhost:3000
```

## Files

- `src/app.ts`: the API. **This is the only file you need to read.**
- `src/scheduler.ts`, `src/store.ts`: you don't need to read these.
- `test/fixtures.ts`: `SMALL` (3 sections), `BIG` (100 sections), and `freshDir()`.
- `test/nfr.spec.ts`: your tests.

## Activity

For each what-if, **write the scenario as a comment (Given/When/Then), then the test.** Copy the shape of the example test.

1. **Malformed:** what if the request body is `{}`?
2. **Huge:** what if the request has 100 sections (`BIG`)? You'll need `this.timeout(...)` (so use `function () {}`, not an arrow function) and `Date.now()`. You'll also need to pick a threshold.

Stretch:

3. Read `GET /schedules/:id` and list what *it* assumes. Break one assumption and test it.
4. Take one assumption we won't code today (only request, allowed, current frontend) and write *just the scenario*.

## Expected results in `after/`

| Test | Result |
| --- | --- |
| restart | ✅ |
| twice | ❌ 2 schedules |
| malformed | ❌ 500 |
| huge | ❌ about 2 s |
