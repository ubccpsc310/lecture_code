# 06b Boundaries

## Learning outcomes

By the end of the lecture, you should be able to:

1. Explain why an interface shaped like its dependency couples tests to that dependency.
2. Design a port in the core's terms, and an adapter that implements it.
3. Separate the core (rules) from the edge (I/O, parsing, wiring).
4. Choose the test level (unit, integration or e2e) that should catch a given bug.
5. Use a contract test suite to show that a fake and a real adapter behave the same.

## Timeline (80 min)

| Time | Min | Segment | Mode |
|---|---|---|---|
| 0:00 | 5 | Hook and outcomes | slides |
| 0:05 | 12 | Discover: testing the bookings | activity (room-booking-discover) |
| 0:17 | 5 | Debrief, then think: what would you rather depend on? | clicker, pairs |
| 0:22 | 15 | Mechanism: ports, adapters, core and edge, test levels | slides + project walkthrough |
| 0:37 | 35 | Apply: draw the boundary | activity (room-booking) |
| 1:12 | 8 | Wrap-up | slides, clicker |

Apply is the tightest segment. If it runs short, skip the e2e step (03) and show it during wrap-up. CSV (04) is a stretch goal.

## Slides

### Hook (5 min)

**1. Title: Boundaries**

**2. Where we are**
- 04a: to test code that calls something, declare an interface and pass in a double.
- 05a: when you can't edit a class, wrap it in an Adapter.
- 06a: a design is open along one axis of change.
- Today: where do the seams go in a whole program, and what does each kind of test check?

**3. Learning outcomes** (the five above)

### Discover (12 min)

**4. Activity: Testing the bookings**
- `yarn start book IKB-261 <you> 2026-11-03 12:00 13:00`, then look at data/bookings.json.
- book() already takes a FileSystem, like the coffee cart took a card reader.
- Write the two TODO tests, then make the change request: `{ "version": 2, "bookings": [...] }`.

### Debrief and think (5 min)

**5. What changed?**
- Rules changed: none. Tests that broke: all of them.
- Show one test: a JSON string in, JSON parsed back out.

**6. Clicker: Did book() follow the dependency inversion principle?**
- A) No, it depends on Node's fs
- B) **Yes, bookings.ts declares FileSystem, and fs happens to fit it**
- C) No, FileSystem should live in its own file
- D) Only the tests do

Notes: B. It's the 04a move done right, and it still broke. So owning the interface isn't enough.

**7. Think (pairs, 2 min): What would you rather depend on?**
- Write the signature of the interface you wish book() depended on.
- Who declares it? What implements it?

### Mechanism (15 min)

**8. Same owner, different vocabulary**

```ts
// shaped like the dependency
interface FileSystem {
	readFileSync(path: string, encoding: "utf8"): string;
	writeFileSync(path: string, data: string): void;
}

// shaped like the core
interface BookingStore {
	bookingsFor(room: string, date: string): Booking[];
	add(booking: Booking): void;
}
```

- FileSystem leaks paths and formats into everything that uses it, including tests.
- BookingStore is a **port**: the core says what it needs, in its own terms.

**9. Who implements BookingStore?**
- Not fs: you can't edit it, and it speaks paths and strings.
- An **adapter**: JsonBookingStore translates between BookingStore and fs.
- Callback: SpotifyAdapter translated between MusicSource and the Spotify SDK.

**10. Core and edge**

```
        edge                core                  edge
  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │ main.ts      │──▶│ rules, book()    │◀──│ JsonBookingStore │──▶ fs
  │ argv, wording│   │ «BookingStore»   │   │ CsvBookingStore  │
  │ picks store  │   └──────────────────┘   └──────────────────┘
  └──────────────┘
```

- Every arrow points into the core. The core imports nothing outside itself.
- test/architecture.spec.ts checks this rule.

**11. Each kind of change lands in one place**

| Change | Where it lands |
|---|---|
| New rule (max 2 bookings a day) | core |
| New file format (version 2, CSV) | one adapter |
| New front end (HTTP, a different CLI) | edge (main) |

- This is the single-responsibility principle at the scale of a whole program: each side has one reason to change.

**12. When the core picks up other jobs: layers**
- Parsing, validation, authentication, caching: needed, but not rules.
- Peel each into its own ring around the core. That's where layers come from.
- Caching is a Decorator on a port: `CachingBookingStore implements BookingStore` wraps another store (05b).

**13. Demo: the project's layers (4 min)**
- Map the project's code: REST handlers → edge, services → core, data access → adapter.
- Show one place where it leaks. Ask: which change would that make painful?

**14. Test levels: which boundaries does a test cross?**

| Level | Runs | Catches |
|---|---|---|
| Unit | core only (plain values, or a fake store) | wrong rules |
| Integration | one real adapter + its real resource, no core | wrong translation: format, missing file, fields |
| E2E | run(argv) → core → real adapters | wrong wiring |

- "Integration" is used loosely. Here it means a test that crosses into a real external resource.

**15. Contract tests: one suite, every implementation**

```ts
describe("FakeBookingStore", () => bookingStoreContract(() => new FakeBookingStore()));
describe("JsonBookingStore", () => bookingStoreContract(() => new JsonBookingStore(tempFile("bookings.json"))));
```

- If the fake passes the same contract as the real store, unit tests that use the fake tell you about the real system.
- Callback: the 04a parkboard activity said "Ensure LSP contracts are upheld!" Now that's a test.

### Apply (35 min)

**16. Activity: Draw the boundary (room-booking)**
1. Core: move the rules into refusalFor(), and fill in book(). Make test/core/rooms.spec.ts pass.
2. Adapter: fill in JsonBookingStore, and make run() book through the core. Delete src/bookings.ts.
3. Integration: run the contract against JsonBookingStore. Does it pass?
4. E2E: write the TODO test.
5. Stretch: CsvBookingStore.

Notes: step 3 fails with ENOENT because there is no file yet. Let students find it. It's the payoff for outcome 5.

### Wrap-up (8 min)

**17. What did the integration test find?**
- ENOENT: a new store has no file yet. The fake can't have that bug, and no unit test could see it.

**18. Clicker: Which test level should catch it first?**
1. Overlap uses `<=`, so back-to-back bookings are refused. → **unit**
2. The adapter writes `"Start"` instead of `"start"`. → **integration**
3. run() passes start and end to book() in the wrong order. → **e2e**

**19. Back to the FileSystem tests**
- Which level were they? Neither: they tested the rules, through the file format.
- Compare the changes: version 2 changed every test. CSV changed one adapter and one line in main.ts.

**20. Takeaways, and next time**
- A port is owned by the core and written in its terms. An adapter does the translating.
- Each test level checks one kind of boundary.
- Next: APIs, the boundary where you don't control the other side.
