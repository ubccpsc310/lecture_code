# 06b Lecture Activities

## Discover: Testing the bookings (room-booking-discover)

Try it first: `yarn start book IKB-261 <you> 2026-11-03 12:00 13:00`, then look at data/bookings.json.

book() in src/bookings.ts already takes a FileSystem, like the coffee cart took a card reader. test/bookings.spec.ts has a FakeFileSystem and one test.

1. Implement: Write the two TODO tests: a booking longer than 2 hours, and a booking that overlaps another.
2. Change request: Facilities' other tools read data/bookings.json, and they want it to say which format it uses: `{ "version": 2, "bookings": [...] }`. Make the change in src/bookings.ts and data/bookings.json.
3. Analyze: Run the tests. Which rules changed? Which tests broke? Why?

## Think: What would you rather depend on?

Write the signature of the interface you wish book() depended on instead. Who should declare it? What would implement it?

## Activity: Draw the boundary (room-booking)

The core (src/core) has the BookingStore port, and stubs for the rules. `yarn test` has 5 failing tests in test/core/rooms.spec.ts.

1. Core: Move the rules from src/bookings.ts into refusalFor() in src/core/rooms.ts, and fill in book(). Make test/core/rooms.spec.ts pass. Those are unit tests: no files.
2. Adapter: Fill in JsonBookingStore by moving the file code out of src/bookings.ts. Then make run() in src/main.ts book through the core, and delete src/bookings.ts and its tests. test/architecture.spec.ts must still pass.
3. Integration: bookingStoreContract() is what every BookingStore promises. FakeBookingStore already passes it. Run it against a JsonBookingStore in test/adapters/JsonBookingStore.spec.ts. Does it pass? Could a unit test have caught that?
4. End to end: Write the TODO test in test/e2e.spec.ts.
5. Stretch: Facilities wants to open the bookings in a spreadsheet. Write a CsvBookingStore, test it against the contract, and have main.ts use it. Which files changed? Compare with the version change.
