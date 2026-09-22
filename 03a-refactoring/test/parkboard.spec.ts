import { expect } from "chai";
import { run } from "../src/main";
import {
	loadPrograms,
	loadCentres,
	loadCustomers,
	loadInstructors,
	findCentre,
	findCustomer,
	findOffering,
} from "../src/catalogue";
import { allOfferings, search, spacesLabel, pad } from "../src/parkboard";
import { priceFor } from "../src/invoice";
import { Instructor } from "../src/Instructor";
import { Customer } from "../src/Customer";

function offering(id: string) {
	return allOfferings().find((each) => each.id === id)!;
}

function customer(id: string) {
	return findCustomer(id)!;
}

describe("catalogue", () => {
	it("Test 0: loads every program", () => {
		expect(loadPrograms()).to.have.length(5);
	});

	it("Test 1: loads every offering", () => {
		expect(allOfferings()).to.have.length(13);
	});

	it("Test 2: loads every centre", () => {
		expect(loadCentres()).to.have.length(4);
	});

	it("Test 3: loads every instructor", () => {
		expect(loadInstructors()).to.have.length(5);
	});

	it("Test 4: loads every customer", () => {
		expect(loadCustomers()).to.have.length(20);
	});

	it("Test 5: attaches facilities to their centre", () => {
		expect(findCentre("kits")!.getFacilities()).to.have.length(3);
	});

	it("Test 6: attaches each offering to its program", () => {
		expect(offering("AQ-201-A").program.title).to.equal("Learn to Swim Level 2");
	});

	it("Test 7: attaches an instructor object, not a name", () => {
		expect(offering("AQ-201-A").instructor).to.be.instanceOf(Instructor);
		expect(offering("AQ-201-A").instructor.name).to.equal("Virginia Woolf");
	});

	it("Test 8: attaches registered customers", () => {
		expect(offering("AQ-201-A").registrations).to.have.length(8);
		expect(offering("AQ-201-A").registrations[0]).to.be.instanceOf(Customer);
	});

	it("Test 9: attaches waitlisted customers", () => {
		expect(offering("AQ-201-A").waitlist).to.have.length(2);
	});

	it("Test 10: findCustomer returns undefined for an unknown id", () => {
		expect(findCustomer("c99")).to.equal(undefined);
	});
});

describe("people", () => {
	it("Test 11: a customer knows its age in a given year", () => {
		expect(customer("c01").ageIn(2026)).to.equal(78);
	});

	it("Test 12: recognises a senior", () => {
		expect(customer("c01").isSeniorIn(2026)).to.equal(true);
	});

	it("Test 13: recognises a youth", () => {
		expect(customer("c20").isYouthIn(2026)).to.equal(true);
	});

	it("Test 14: an adult is neither", () => {
		expect(customer("c09").isSeniorIn(2026)).to.equal(false);
		expect(customer("c09").isYouthIn(2026)).to.equal(false);
	});

	it("Test 15: labels a customer by role", () => {
		expect(customer("c01").label()).to.equal("Alice Munro (customer)");
	});

	it("Test 16: an instructor reports its certifications", () => {
		expect(loadInstructors()[1].isCertifiedFor("Fitness")).to.equal(true);
		expect(loadInstructors()[1].isCertifiedFor("Arts")).to.equal(false);
	});
});

describe("offerings", () => {
	it("Test 17: derives the enrolled count from registrations", () => {
		expect(offering("FT-110-B").getEnrolled()).to.equal(4);
	});

	it("Test 18: derives the waitlist count", () => {
		expect(offering("FT-110-A").getWaitlisted()).to.equal(3);
	});

	it("Test 19: reports spaces left", () => {
		expect(offering("FT-110-B").getSpacesLeft()).to.equal(6);
	});

	it("Test 20: knows when it is full", () => {
		expect(offering("AQ-201-A").isFull()).to.equal(true);
	});

	it("Test 21: labels a full offering with its waitlist", () => {
		expect(spacesLabel(offering("SP-150-B"))).to.equal("full, 4 waiting");
	});

	it("Test 22: labels an open offering", () => {
		expect(spacesLabel(offering("FT-110-B"))).to.equal("6 of 10 left");
	});

	it("Test 23: knows who is registered", () => {
		expect(offering("AQ-201-A").isRegistered(customer("c01"))).to.equal(true);
		expect(offering("AQ-201-A").isRegistered(customer("c03"))).to.equal(false);
	});

	it("Test 24: resolves a field by name", () => {
		expect(offering("AR-105-A").valueOf("category")).to.equal("Arts");
	});

	it("Test 25: resolves the instructor to a name", () => {
		expect(offering("AR-105-A").valueOf("instructor")).to.equal("Chinua Achebe");
	});

	it("Test 26: returns undefined for an unknown field", () => {
		expect(offering("AQ-201-A").valueOf("postcode")).to.equal(undefined);
	});
});

describe("search", () => {
	it("Test 27: finds offerings by category", () => {
		expect(search("category", "is", "Aquatics", { resident: true })).to.have.length(3);
	});

	it("Test 28: finds offerings by instructor", () => {
		expect(search("instructor", "is", "Toni Morrison", { resident: true })).to.have.length(3);
	});

	it("Test 29: compares numerically with gt", () => {
		expect(search("fee", "gt", "150", { resident: true })).to.have.length(2);
	});

	it("Test 30: compares numerically with lt", () => {
		expect(search("fee", "lt", "100", { resident: true })).to.have.length(6);
	});

	it("Test 31: rejects an unknown field", () => {
		expect(search("postcode", "is", "V6K", { resident: true })[0]).to.contain("unknown field");
	});

	it("Test 32: returns nothing when nothing matches", () => {
		expect(search("category", "is", "Curling", { resident: true })).to.have.length(0);
	});

	it("Test 33: pads a column", () => {
		expect(pad("ab", 5)).to.equal("ab   ");
	});
});

describe("invoice", () => {
	it("Test 34: prices an adult resident", () => {
		expect(priceFor(offering("FT-110-A"), customer("c09"))).to.equal(115.5);
	});

	it("Test 35: adds the non-resident surcharge", () => {
		expect(priceFor(offering("FT-110-A"), customer("c10"))).to.equal(144.38);
	});

	it("Test 36: applies the concession to seniors", () => {
		expect(priceFor(offering("FT-110-A"), customer("c01"))).to.equal(80.85);
	});

	it("Test 37: applies the concession to youth", () => {
		expect(priceFor(offering("FT-110-A"), customer("c20"))).to.equal(80.85);
	});

	it("Test 38: renders a receipt naming the program and customer", () => {
		const out = run(["invoice", "FT-110-A", "c09"]);
		expect(out).to.contain("Gentle Fitness");
		expect(out).to.contain("Italo Calvino");
	});

	it("Test 39: names the instructor on the receipt", () => {
		expect(run(["invoice", "FT-110-A", "c09"])).to.contain("James Baldwin");
	});

	it("Test 40: reports an unknown offering", () => {
		expect(run(["invoice", "ZZ-999-A", "c09"])).to.contain("no offering");
	});

	it("Test 41: reports an unknown customer", () => {
		expect(run(["invoice", "FT-110-A", "c99"])).to.contain("no customer");
	});
});

describe("loyalty", () => {
	it("Test 42a: gives a seeded customer their interests", () => {
		expect(customer("c01").interests).to.have.members(["Aquatics", "Fitness", "Skating", "Sports"]);
	});

	it("Test 42b: promotes a customer who has taken three categories", () => {
		expect(customer("c04").status).to.equal("Frequent Customer");
	});

	it("Test 42c: promotes a customer who has taken all five", () => {
		expect(customer("c05").interests).to.have.length(5);
		expect(customer("c05").status).to.equal("Community Champion");
	});

	it("Test 42d: counts a waitlist place as interest", () => {
		const before = customer("c02").interests.length;
		findOffering("AR-105-B")!.register(customer("c02"));
		expect(customer("c02").interests).to.contain("Arts");
		expect(customer("c02").interests.length).to.equal(before + 1);
	});

	it("Test 42e: does not record the same category twice", () => {
		const before = customer("c05").interests.length;
		findOffering("AR-105-A")!.register(customer("c05"));
		expect(customer("c05").interests.length).to.equal(before);
	});
});

describe("registering", () => {
	it("Test 42: refuses a customer who is already registered", () => {
		expect(run(["register", "AQ-201-B", "c04"])).to.contain("already registered");
	});

	it("Test 43: waitlists when the offering is full", () => {
		expect(run(["register", "AR-105-B", "c05"])).to.contain("waitlist");
	});
});

describe("brochure", () => {
	it("Test 44: titles the season", () => {
		expect(run(["brochure", "Fall"])).to.contain("Westbrook Recreation — Fall 2026");
	});

	it("Test 45: lists a program running that season", () => {
		expect(run(["brochure", "Fall"])).to.contain("Learn to Swim Level 2");
	});

	it("Test 46: omits a program not running that season", () => {
		expect(run(["brochure", "Spring"])).to.not.contain("Pottery for Beginners");
	});

	it("Test 47: names the centre an offering runs at", () => {
		expect(run(["brochure", "Fall"])).to.contain("Kitsilano Community Centre");
	});

	it("Test 48: names the instructor", () => {
		expect(run(["brochure", "Fall"])).to.contain("with Virginia Woolf");
	});
});

describe("cli", () => {
	it("Test 51: prints usage with no command", () => {
		expect(run([])).to.contain("parkboard —");
	});

	it("Test 52: prints usage for an unknown command", () => {
		expect(run(["dance"])).to.contain("parkboard —");
	});

	it("Test 53: lists customers", () => {
		expect(run(["customers"])).to.contain("Alice Munro");
	});

	it("Test 54: runs a search end to end", () => {
		expect(run(["search", "category", "is", "Arts"])).to.contain("Pottery for Beginners");
	});
});
