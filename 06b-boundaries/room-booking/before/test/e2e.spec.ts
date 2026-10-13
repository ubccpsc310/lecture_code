import { expect } from "chai";
import { run } from "../src/main";
import { JsonBookingStore } from "../src/adapters/JsonBookingStore";
import { tempFile } from "./tempFile";

// End-to-end tests: a command in through run(), the real core, and a real JsonBookingStore underneath.
describe("rooms, end to end", () => {
	let file: string;

	beforeEach(() => {
		file = tempFile("bookings.json");
	});

	/** Runs one command, with a new store on the same file, the way each `yarn start` does. */
	function rooms(...argv: string[]): string {
		return run(argv, new JsonBookingStore(file));
	}

	// TODO: book a room with one command, then try to book an overlapping time with a second command.
	// Check what each command says.
});
