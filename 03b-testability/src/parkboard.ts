import { Offering } from "./Offering";
import { loadPrograms, findCentre } from "./catalogue";
import { QuotePrice } from "./pricing";

/**
 * Catalogue queries, listing, and the shared text helpers everything else uses.
 */

const SEARCHABLE_FIELDS = [
	"id",
	"instructor",
	"season",
	"year",
	"fee",
	"capacity",
	"enrolled",
	"waitlist",
	"title",
	"category",
	"code",
];

export type SearchOptions = {
	resident: boolean;
};

export function allOfferings(): Offering[] {
	const offerings: Offering[] = [];
	for (const program of loadPrograms()) {
		for (const offering of program.getOfferings()) offerings.push(offering);
	}
	return offerings;
}

export function search(field: string, op: string, value: string, options: SearchOptions): string[] {
	if (!SEARCHABLE_FIELDS.includes(field)) {
		return [`unknown field '${field}'`];
	}

	const matched: Offering[] = [];
	for (const offering of allOfferings()) {
		const actual = offering.valueOf(field);
		if (op === "is" && String(actual) === value) matched.push(offering);
		else if (op === "gt" && Number(actual) > Number(value)) matched.push(offering);
		else if (op === "lt" && Number(actual) < Number(value)) matched.push(offering);
	}

	matched.sort((a, b) => (a.program.title < b.program.title ? -1 : a.program.title > b.program.title ? 1 : 0));

	const rows: string[] = [];
	for (const offering of matched) {
		// what this offering costs the person running the search
		const price = new QuotePrice(offering.fee, options.resident).calculate();

		const centre = findCentre(offering.centreId);
		rows.push(
			pad(offering.id, 10) +
				pad(offering.program.title, 26) +
				pad(offering.season, 8) +
				pad(centre === undefined ? "?" : centre.name, 32) +
				pad("$" + price.toFixed(2), 10) +
				spacesLabel(offering)
		);
	}
	return rows;
}

export function spacesLabel(offering: Offering): string {
	if (offering.isFull() && offering.getWaitlisted() > 0) return `full, ${offering.getWaitlisted()} waiting`;
	if (offering.isFull()) return "full";
	return `${offering.getSpacesLeft()} of ${offering.capacity} left`;
}

export function pad(text: string, width: number): string {
	if (text.length >= width) return text.slice(0, width - 1) + " ";
	return text + " ".repeat(width - text.length);
}

export function title(text: string): string {
	return `${text}\n${"=".repeat(text.length)}`;
}
