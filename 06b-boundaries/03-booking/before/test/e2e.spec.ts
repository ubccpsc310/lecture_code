import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { run } from "../src/main";
import { JsonBookingStore } from "../src/adapters/JsonBookingStore";

/** A path to a file called bookings.json, in a new, empty temporary directory. The file doesn't exist yet. */
function tempFile(): string {
	return path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rooms-")), "bookings.json");
}

// End-to-end tests: a command in through run(), the real core, and a real JsonBookingStore underneath.
describe("rooms, end to end", () => {
	let file: string;

	beforeEach(() => {
		file = tempFile();
	});

	/** Runs one command, with a new store on the same file, the way each `yarn start` does. */
	function rooms(...argv: string[]): string {
		return run(argv, new JsonBookingStore(file));
	}

	// TODO: what could go wrong in main.ts that neither the unit tests nor the integration tests would notice?
	// Write a pending test for each one: an it() with a title and no function.
});
