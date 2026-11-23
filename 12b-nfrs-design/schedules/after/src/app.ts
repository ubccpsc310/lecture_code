import express from "express";
import { schedule } from "./scheduler";
import { Store } from "./store";

export function makeApp(dir: string) {
	const store = new Store(dir);
	const pending = new Set<string>(); // ids still being scheduled
	const app = express();
	app.use(express.json());

	// Tactics: validate input (local), make repeated requests safe (contract),
	// respond before the work is done (structural)
	app.put("/schedules/:id", (req, res) => {
		const { sections, rooms } = req.body;
		if (!Array.isArray(sections) || !Array.isArray(rooms)) {
			res.status(400).json({ error: "sections and rooms must be arrays" });
			return;
		}
		const id = req.params.id;
		pending.add(id);
		schedule(sections, rooms)
			.then((result) => store.save(id, result))
			.catch((err) => console.error(`scheduling ${id} failed`, err))
			.finally(() => pending.delete(id));
		res.status(202).json({ id, status: "pending" });
	});

	app.get("/schedules", async (req, res) => {
		res.json(await store.list());
	});

	app.get("/schedules/:id", async (req, res) => {
		if (pending.has(req.params.id)) {
			res.json({ id: req.params.id, status: "pending" });
			return;
		}
		const s = await store.load(req.params.id);
		if (s === undefined) {
			res.status(404).json({ error: "no such schedule" });
			return;
		}
		res.json(s);
	});

	return app;
}
