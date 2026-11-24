import { expect } from "chai";
import request from "supertest";
import { makeApp } from "../src/app";
import { SMALL, freshDir } from "./fixtures";

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

	// TODO: what if the request body is malformed?

	// TODO: what if the request has 100 sections?
});
