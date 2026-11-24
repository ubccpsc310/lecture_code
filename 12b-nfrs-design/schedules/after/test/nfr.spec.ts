import { expect } from "chai";
import request from "supertest";
import { makeApp } from "../src/app";
import { BIG, SMALL, freshDir, waitUntilDone } from "./fixtures";

// Expected results against this API: twice, malformed and huge pass; restart fails.
// The restart failure is the point: responding before the work is done (for performance)
// keeps work-in-progress in memory, which a restart loses (durability).

describe("schedules API: non-functional requirements", () => {
	it("a schedule being created survives a restart", async () => {
		// Given: no schedules
		const dir = await freshDir();
		// When: the Registrar creates a schedule, then the server restarts before the work finishes
		await request(makeApp(dir)).put("/schedules/march-cpsc").send(BIG);
		const restarted = makeApp(dir);
		// Then: the schedule isn't lost
		const res = await request(restarted).get("/schedules/march-cpsc");
		expect(res.status).to.not.equal(404);
	});

	it("sending the same request twice creates one schedule", async () => {
		// Given: no schedules
		const app = makeApp(await freshDir());
		// When: the same request is sent twice
		await request(app).put("/schedules/march-cpsc").send(SMALL);
		await request(app).put("/schedules/march-cpsc").send(SMALL);
		await waitUntilDone(app, "march-cpsc");
		// Then: there is one schedule
		const res = await request(app).get("/schedules");
		expect(res.body).to.have.length(1);
	});

	it("rejects a malformed request with 400", async () => {
		// Given: no schedules
		// When: the Registrar sends a request with no sections or rooms
		const res = await request(makeApp(await freshDir()))
			.put("/schedules/march-cpsc")
			.send({});
		// Then: the server says it's the client's mistake
		expect(res.status).to.equal(400);
	});

	it("responds quickly to a big request", async function () {
		this.timeout(10_000);
		// Given: no schedules
		// When: the Registrar creates a 100-section schedule
		const start = Date.now();
		await request(makeApp(await freshDir()))
			.put("/schedules/march-cpsc")
			.send(BIG);
		// Then: the server responds in under 1 s (the threshold is the Registrar's call)
		expect(Date.now() - start).to.be.below(1000);
	});
});
