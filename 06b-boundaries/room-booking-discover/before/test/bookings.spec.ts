import { expect } from "chai";
import { book, FileSystem } from "../src/bookings";

/** Holds the bookings file in memory, and remembers what was last written to it. */
class FakeFileSystem implements FileSystem {
	public written: string | undefined;

	constructor(private contents: string) {}

	readFileSync(): string {
		return this.contents;
	}

	writeFileSync(path: string, data: string): void {
		this.written = data;
	}
}

const SAM_10_TO_12 = `{ "room": "IKB-261", "student": "sam", "date": "2026-11-03", "start": "10:00", "end": "12:00" }`;

describe("book", () => {
	it("books a free room", () => {
		const files = new FakeFileSystem(`[${SAM_10_TO_12}]`);
		expect(book(files, "IKB-263", "alex", "2026-11-03", "10:00", "12:00")).to.equal(
			"Booked IKB-263 for alex on 2026-11-03, 10:00–12:00"
		);
		expect(JSON.parse(files.written!)).to.deep.equal([
			{ room: "IKB-261", student: "sam", date: "2026-11-03", start: "10:00", end: "12:00" },
			{ room: "IKB-263", student: "alex", date: "2026-11-03", start: "10:00", end: "12:00" },
		]);
	});

	// TODO: refuses a booking longer than 2 hours

	// TODO: refuses a booking that overlaps another in the same room
});
