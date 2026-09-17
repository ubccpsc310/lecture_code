import { Program } from "./program";
import { Offering } from "./Offering";
import { Centre, Facility } from "./centre";
import { Instructor } from "./Instructor";
import { Customer } from "./Customer";

/**
 * The season catalogue.
 *
 * Westbrook's registration system exports this every quarter. Until the import
 * job is written, it lives here.
 */

// id, name, certifications
const INSTRUCTORS: [string, string, string[]][] = [
	["i1", "Virginia Woolf", ["Aquatics"]],
	["i2", "James Baldwin", ["Fitness", "Sports"]],
	["i3", "Toni Morrison", ["Aquatics", "Skating"]],
	["i4", "Chinua Achebe", ["Arts"]],
	["i5", "Gabriel Marquez", ["Fitness"]],
];

// id, name, birth year, resident
const CUSTOMERS: [string, string, number, boolean][] = [
	["c01", "Alice Munro", 1948, true],
	["c02", "Bram Stoker", 1952, true],
	["c03", "Charles Dickens", 1955, false],
	["c04", "Daphne du Maurier", 1959, true],
	["c05", "Emily Dickinson", 1972, true],
	["c06", "Franz Kafka", 1980, true],
	["c07", "George Orwell", 1984, false],
	["c08", "Harper Lee", 1988, true],
	["c09", "Italo Calvino", 1991, true],
	["c10", "Jane Austen", 1993, false],
	["c11", "Kazuo Ishiguro", 1995, true],
	["c12", "Leo Tolstoy", 1997, true],
	["c13", "Mary Shelley", 1999, true],
	["c14", "Nikolai Gogol", 2001, false],
	["c15", "Oscar Wilde", 2003, true],
	["c16", "Pablo Neruda", 2005, true],
	["c17", "Quentin Crisp", 2010, true],
	["c18", "Rabindranath Tagore", 2012, true],
	["c19", "Sylvia Plath", 2014, false],
	["c20", "Tove Jansson", 2015, true],
];

const PROGRAMS: [string, string, string, string][] = [
	["AQ-201", "Learn to Swim Level 2", "Aquatics", "201"],
	["FT-110", "Gentle Fitness", "Fitness", "110"],
	["AR-105", "Pottery for Beginners", "Arts", "105"],
	["SK-130", "Learn to Skate", "Skating", "130"],
	["SP-150", "Youth Basketball", "Sports", "150"],
];

// program, id, instructor, season, year, fee, capacity, centre
const OFFERINGS: [string, string, string, string, number, number, number, string][] = [
	["AQ-201", "AQ-201-A", "i1", "Fall", 2026, 84.5, 8, "kits"],
	["AQ-201", "AQ-201-B", "i1", "Winter", 2026, 84.5, 8, "kits"],
	["AQ-201", "AQ-201-C", "i3", "Spring", 2026, 79, 8, "killarney"],
	["FT-110", "FT-110-A", "i2", "Fall", 2026, 110, 10, "kits"],
	["FT-110", "FT-110-B", "i2", "Winter", 2026, 110, 10, "riley"],
	["FT-110", "FT-110-C", "i5", "Spring", 2026, 102, 10, "riley"],
	["AR-105", "AR-105-A", "i4", "Fall", 2026, 215, 6, "britannia"],
	["AR-105", "AR-105-B", "i4", "Winter", 2026, 199, 6, "britannia"],
	["SK-130", "SK-130-A", "i3", "Fall", 2026, 96, 8, "riley"],
	["SK-130", "SK-130-B", "i3", "Winter", 2026, 96, 8, "killarney"],
	["SK-130", "SK-130-C", "i1", "Spring", 2026, 90, 8, "killarney"],
	["SP-150", "SP-150-A", "i2", "Fall", 2026, 132, 12, "britannia"],
	["SP-150", "SP-150-B", "i2", "Winter", 2026, 124, 12, "kits"],
];

// offering, registered customers, waitlisted customers
const REGISTRATIONS: [string, string, string][] = [
	["AQ-201-A", "c01 c05 c06 c08 c11 c12 c17 c18", "c02 c19"],
	["AQ-201-B", "c04 c09 c10 c13 c20", ""],
	["AQ-201-C", "c01 c03 c07 c14 c15 c16 c18", ""],
	["FT-110-A", "c01 c02 c04 c05 c06 c07 c08 c09 c10 c11", "c12 c13 c14"],
	["FT-110-B", "c15 c16 c19 c20", ""],
	["FT-110-C", "c01 c02 c03 c04 c05 c06 c07 c08 c09 c10", "c11 c12"],
	["AR-105-A", "c05 c08 c12 c15 c16", ""],
	["AR-105-B", "c06 c07 c09 c10 c13 c14", "c11 c17"],
	["SK-130-A", "c13 c15 c16 c17 c18 c19 c20", ""],
	["SK-130-B", "c01 c05 c09 c13 c17 c18 c19 c20", "c02 c06 c10"],
	["SK-130-C", "c03 c07 c11 c14 c15 c16", ""],
	["SP-150-A", "c05 c06 c08 c09 c11 c12 c13 c15 c17 c18", ""],
	["SP-150-B", "c01 c02 c03 c04 c05 c06 c07 c08 c09 c10 c11 c12", "c13 c14 c15 c16"],
];

const CENTRES: [string, string, string, string][] = [
	["kits", "Kitsilano Community Centre", "2690 Larch Street", "West Point"],
	["riley", "Riley Park Community Centre", "4575 Clancy Loranger Way", "Riley"],
	["killarney", "Killarney Community Centre", "6260 Killarney Street", "Killarney"],
	["britannia", "Britannia Community Centre", "2205 Commercial Drive", "Grandview"],
];

// centre, id, number, type, surface, occupancy
const FACILITIES: [string, string, string, string, string, number][] = [
	["kits", "kits-pool", "Tank A", "Pool", "Water", 80],
	["kits", "kits-gym", "Gymnasium", "Gym", "Hardwood", 140],
	["kits", "kits-studio", "Studio 1", "Studio", "Sprung", 30],
	["riley", "riley-rink", "Ice Rink", "Rink", "Ice", 220],
	["riley", "riley-gym", "Gymnasium", "Gym", "Hardwood", 120],
	["killarney", "killarney-pool", "Tank A", "Pool", "Water", 120],
	["killarney", "killarney-rink", "Ice Rink", "Rink", "Ice", 200],
	["killarney", "killarney-field", "Turf Field", "Field", "Turf", 400],
	["britannia", "britannia-rink", "Ice Rink", "Rink", "Ice", 180],
];

let instructors: Instructor[] | undefined = undefined;
let customers: Customer[] | undefined = undefined;
let programs: Program[] | undefined = undefined;
let centres: Centre[] | undefined = undefined;

export function loadInstructors(): Instructor[] {
	if (instructors === undefined) {
		instructors = INSTRUCTORS.map((row) => new Instructor(row[0], row[1], row[2]));
	}
	return instructors;
}

export function loadCustomers(): Customer[] {
	if (customers === undefined) {
		customers = CUSTOMERS.map((row) => new Customer(row[0], row[1], row[2], row[3]));
	}
	return customers;
}

export function loadPrograms(): Program[] {
	if (programs !== undefined) return programs;

	const staff = loadInstructors();
	const people = loadCustomers();
	const built = PROGRAMS.map((row) => new Program(row[0], row[1], row[2], row[3]));

	for (const row of OFFERINGS) {
		const program = built.find((candidate) => candidate.id === row[0]);
		const instructor = staff.find((candidate) => candidate.id === row[2]);
		if (program === undefined || instructor === undefined) continue;

		const offering = new Offering(row[1], instructor, row[3], row[4], row[5], row[6], row[7]);
		offering.program = program;
		offering.fee = Math.round(offering.fee * 100) / 100;
		program.offerings.push(offering);
	}

	programs = built;

	for (const row of REGISTRATIONS) {
		const offering = findOffering(row[0]);
		if (offering === undefined) continue;
		for (const id of row[1].split(" ").filter((each) => each.length > 0)) {
			const customer = people.find((candidate) => candidate.id === id);
			if (customer !== undefined) {
				offering.registrations.push(customer);
				if (!customer.interests.includes(offering.program.category)) {
					customer.interests.push(offering.program.category);
					if (customer.interests.length >= 5) {
						customer.status = "Community Champion";
					} else if (customer.interests.length >= 3) {
						customer.status = "Frequent Customer";
					}
				}
			}
		}
		for (const id of row[2].split(" ").filter((each) => each.length > 0)) {
			const customer = people.find((candidate) => candidate.id === id);
			if (customer !== undefined) {
				offering.waitlist.push(customer);
				if (!customer.interests.includes(offering.program.category)) {
					customer.interests.push(offering.program.category);
					if (customer.interests.length >= 5) {
						customer.status = "Community Champion";
					} else if (customer.interests.length >= 3) {
						customer.status = "Frequent Customer";
					}
				}
			}
		}
	}

	return programs;
}

export function loadCentres(): Centre[] {
	if (centres !== undefined) return centres;

	const built = CENTRES.map((row) => new Centre(row[0], row[1], row[2], row[3]));
	for (const row of FACILITIES) {
		const centre = built.find((candidate) => candidate.id === row[0]);
		if (centre === undefined) continue;
		const facility = new Facility(row[1], row[2], row[3], row[4], row[5]);
		facility.centre = centre;
		centre.facilities.push(facility);
	}

	centres = built;
	return centres;
}

export function findCentre(centreId: string): Centre | undefined {
	return loadCentres().find((centre) => centre.id === centreId);
}

export function findCustomer(customerId: string): Customer | undefined {
	// standing comes from registrations, so the catalogue has to be wired up first
	loadPrograms();
	return loadCustomers().find((customer) => customer.id === customerId);
}

export function findOffering(offeringId: string): Offering | undefined {
	for (const program of loadPrograms()) {
		const offering = program.getOfferingById(offeringId);
		if (offering !== undefined) return offering;
	}
	return undefined;
}
