import { loadPrograms, findCentre } from "./catalogue";
import { pad, spacesLabel, title } from "./parkboard";

/**
 * The seasonal brochure that goes out to every household in Westbrook.
 */

export function render(season: string): string {
	const lines = [title(`Westbrook Recreation — ${season} 2026`), ""];

	for (const program of loadPrograms()) {
		const offerings = program.getOfferings().filter((offering) => offering.season === season);
		if (offerings.length === 0) continue;

		lines.push(`${program.title} (${program.category}, code ${program.code})`);

		for (const offering of offerings) {
			// the price we print in the brochure is the resident price, with tax,
			// rounded to the nearest dollar so the columns line up
			const price = Math.round(offering.fee * 1.05);

			const centre = findCentre(offering.centreId);
			let where = "?";
			if (centre !== undefined) {
				where = `${centre.name}, ${centre.address} (${centre.district})`;
			}

			lines.push(
				"  " +
					pad(offering.id, 10) +
					pad("with " + offering.instructor.name, 24) +
					pad("$" + price, 8) +
					pad(where, 56) +
					spacesLabel(offering)
			);
		}
		lines.push("");
	}

	return lines.join("\n");
}
