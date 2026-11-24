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

	it("sending the same request twice creates one schedule", async () => {
		// Given: no schedules
		const app = makeApp(await freshDir());
		// When: the same request is sent twice
		await request(app).post("/schedules").send(SMALL);
		await request(app).post("/schedules").send(SMALL);
		// Then: there is one schedule
		const res = await request(app).get("/schedules");
		expect(res.body).to.have.length(1);
	});

	it("rejects a malformed request with 400", async () => {
		// Given: no schedules
		const app = makeApp(await freshDir());
		// When: the Registrar sends a request with no sections or rooms
		const res = await request(app)
			.post("/schedules")
			.send({});
		// Then: the server says it's the client's mistake
		expect(res.status).to.equal(400);
	});

	it("responds quickly to a big request", async function () {
		this.timeout(10_000);
		// Given: no schedules
		const app = makeApp(await freshDir());
		// When: the Registrar creates a 100-section schedule
		const start = Date.now();
		await request(app)
			.post("/schedules")
			.send(BIG);
		// Then: the server responds in under 1 s (the threshold is the Registrar's call)
		expect(Date.now() - start).to.be.below(1000);
	});
});
