import express from "express";
import { randomUUID } from "crypto";
import { schedule } from "./scheduler";
import { Store } from "./store";

export function makeApp(dir: string) {
	const store = new Store(dir);
	const app = express();
	app.use(express.json());

	app.post("/schedules", async (req, res) => {
		const result = await schedule(req.body.sections, req.body.rooms);
		const id = randomUUID();
		await store.save(id, result);
		res.status(201).json({ id, ...result });
	});

	app.get("/schedules", async (req, res) => {
		res.json(await store.list());
	});

	app.get("/schedules/:id", async (req, res) => {
		const s = await store.load(req.params.id);
		if (s === undefined) {
			res.status(404).json({ error: "no such schedule" });
			return;
		}
		res.json(s);
	});

	return app;
}
