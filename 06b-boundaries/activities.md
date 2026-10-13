# 06b Lecture Activities

All of these use room-booking/. Try it first: `yarn start list 2026-11-03`, then book a room with `yarn start book IKB-261 <you> 2026-11-03 12:00 13:00`.

## book(): Can we test the rules?

book() in src/bookings.ts has three rules: at most 2 hours, no overlaps in the same room, and at most 2 bookings per student per day.

1. Analyze: Write a test for one rule. Run it twice. What happens to data/bookings.json?
2. Implement: Use what you did with the coffee cart. Test each rule without touching data/bookings.json.

## Change request: version the file

Facilities' other tools read data/bookings.json. They want it to say which format it uses: `{ "version": 2, "bookings": [...] }`.

1. Implement: Make the change, and update data/bookings.json to match.
2. Analyze: Which rules changed? Which tests changed? Why?

## Think: What would you rather depend on?

Write the signature of the interface you wish book() depended on instead. Who should declare it? What implements it?

## Activity: Draw the boundary

1. Implement: Move the rules into src/core as a function that takes a request and the day's bookings, and returns why the request is refused, or undefined. Test it with plain objects. Then remove the .skip in test/architecture.spec.ts.
2. Implement: In src/core, declare a BookingStore port in the core's terms. Write a JSON adapter for it outside the core, and a fake for your tests. main.ts picks the real store.
3. Test: Write the tests for each level:
    1. Unit: the core, with the fake store or no store at all.
    2. Integration: the JSON adapter against a real file in a temporary directory. Write what every BookingStore promises once, and run it against both the fake and the JSON adapter. Does the fake pass? Does the JSON adapter?
    3. End to end: run() with argv and the real store.
4. Change request: Facilities wants to open the bookings in a spreadsheet. Keep them in a CSV file instead. Which files change? Compare that with the version change.
