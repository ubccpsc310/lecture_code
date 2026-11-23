# 12b: NFRs Drive Design

The schedules API from 12a. `before/` is where 12a ended (Tuesday's tests, three failing); `after/` applies three tactics.

Run from `schedules/before` or `schedules/after`:

```sh
yarn test    # run the tests
yarn start   # serve the API on http://localhost:3000
```

## Demo: validate input (local)

In `POST /schedules`, before scheduling:

```ts
const { sections, rooms } = req.body;
if (!Array.isArray(sections) || !Array.isArray(rooms)) {
	res.status(400).json({ error: "sections and rooms must be arrays" });
	return;
}
```

## Activity 1: make repeated requests safe (contract)

1. Change `POST /schedules` to `PUT /schedules/:id`. Use `req.params.id` instead of `randomUUID()`.
2. Update your "twice" test to send the same `PUT` twice.
3. Update your other tests to use `PUT`.

## Activity 2: respond before the work is done (structural)

1. Add a `pending` set of ids still being scheduled. In `PUT`, add the id, start `schedule(...)` then `store.save(...)` **without awaiting it**, remove the id when it's done, and respond `202` with `{ id, status: "pending" }`.
2. In `GET /schedules/:id`, if the id is pending, respond `{ id, status: "pending" }`.
3. Your "twice" test now checks the list before the work is done. Add `await waitUntilDone(app, id)` (from `fixtures.ts`) before the `GET`.
4. Update your "huge" test to use `PUT`. It should pass now.
5. Update your restart test so the server restarts **right after** a `PUT` of `BIG`.
6. Run **all** your tests. What happens?

## Expected results in `after/`

| Test | Start of class | After |
| --- | --- | --- |
| malformed | ❌ | ✅ |
| twice | ❌ | ✅ |
| huge | ❌ | ✅ |
| restart | ✅ | ❌ (the side effect) |
