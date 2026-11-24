// You don't need to read this file.
//
// Saves each schedule as its own JSON file in `dir`. Nothing is kept in memory, so a new Store on the
// same directory (a "restart") sees everything saved before it.

import { promises as fs } from "fs";
import * as path from "path";
import { Schedule } from "./scheduler";

export type SavedSchedule = Schedule & { id: string };

export class Store {
	constructor(private readonly dir: string) {}

	private file(id: string): string {
		// encode the id so it can't name a file outside dir
		return path.join(this.dir, `${encodeURIComponent(id)}.json`);
	}

	async save(id: string, schedule: Schedule): Promise<void> {
		await fs.mkdir(this.dir, { recursive: true });
		const saved: SavedSchedule = { id, ...schedule };
		await fs.writeFile(this.file(id), JSON.stringify(saved));
	}

	async load(id: string): Promise<SavedSchedule | undefined> {
		try {
			return JSON.parse(await fs.readFile(this.file(id), "utf8"));
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
			throw err;
		}
	}

	async list(): Promise<SavedSchedule[]> {
		let names: string[];
		try {
			names = await fs.readdir(this.dir);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
			throw err;
		}
		const files = names.filter((name) => name.endsWith(".json"));
		return Promise.all(files.map(async (name) => JSON.parse(await fs.readFile(path.join(this.dir, name), "utf8"))));
	}
}
