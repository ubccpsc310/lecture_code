import { expect } from "chai";
import request from "supertest";
import { makeApp } from "../src/app";
import { BIG, SMALL, freshDir } from "./fixtures";

// Expected results against this API: restart passes; twice, malformed and huge fail.
// The failures are the point: each one is a non-functional requirement the API doesn't meet yet.

describe("schedules API: non-functional requirements", () => {
	it("a saved schedule survives a restart", async () => {
		// Given: no schedules
		const dir = await freshDir();
		// When: the Registrar creates a schedule, then the server restarts
		const { body } = await request(makeApp(dir)).post("/schedules").send(SMALL);
		const restarted = makeApp(dir); // a new app on the same directory
		// Then: the schedule can still be opened
		const res = await request(restarted).get(`/schedules/${body.id}`);
		expect(res.status).to.equal(200);
	});

	it("responds quickly to a /schedules request", async function () {
		// Given: some schedules
		const app = makeApp(await freshDir());
		await request(app).post("/schedules").send(SMALL);

		this.timeout(10_000);
		// When: we request a schedule
		const start = Date.now();
		const res = await request(app).get(`/schedules/`);
		// Then: the server responds in under 10ms
		expect(Date.now() - start).to.be.below(10);
		expect(res.status).to.equal(200);
	});

	it("maintains consistency after writing a schedule", async function () {
		// Given: some schedules
		const app = makeApp(await freshDir());
		await request(app).post("/schedules").send(SMALL);

		// When: we request a schedule, make an update, and then request it again
		const res1 = await request(app).get(`/schedules/`);
		expect(res1.body.length).to.equal(1);
		await request(app).post("/schedules").send(SMALL);
		const res2 = await request(app).get(`/schedules/`);
		// Then: there's one more schedule added
		expect(res2.status).to.equal(200);
		expect(res2.body.length).to.equal(2);
	});
});
