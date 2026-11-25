import express from "express";
import { randomUUID } from "crypto";
import { schedule } from "./scheduler";
import { SavedSchedule, Store } from "./store";

export function makeApp(dir: string) {
	const store = new Store(dir);
	const app = express();
	app.use(express.json());

	// The cache: the result of the last store.list(), kept in memory.
	// undefined means "nothing cached", so the next GET goes to disk.
	let cachedList: SavedSchedule[] | undefined;

	app.post("/schedules", async (req, res) => {
		const result = await schedule(req.body.sections, req.body.rooms);
		const id = randomUUID();
		await store.save(id, result);
		cachedList = undefined; // invalidate: the list on disk just changed
		res.status(201).json({ id, ...result });
	});

	app.get("/schedules", async (req, res) => {
		if (cachedList === undefined) {
			cachedList = await store.list(); // miss: read every file, then remember the answer
		}
		res.json(cachedList); // hit: no disk access at all
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
