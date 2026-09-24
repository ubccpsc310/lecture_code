import { search } from "./parkboard";
import { findOffering, findCustomer, loadCustomers, loadPrograms } from "./catalogue";
import * as brochure from "./brochure";
import * as invoice from "./invoice";
import * as desk from "./desk";

const USAGE = `parkboard — City of Westbrook Parks & Recreation

  search <field> <is|gt|lt> <value>   fields: id, instructor, season, year, fee,
                                              capacity, enrolled, title, category, code
  brochure <Fall|Winter|Spring>       the seasonal brochure
  invoice <offeringId> <customerId>   what this customer pays
  register <offeringId> <customerId>  take a registration
  customers                           who the city knows about
  status <offeringId>                 can someone still sign up?
`;

export function run(argv: string[]): string {
	const command = argv[0];

	if (command === "search") {
		if (argv.length < 4) return USAGE;
		return search(argv[1], argv[2], argv[3], { resident: argv[4] !== "visitor" }).join("\n");
	}
	if (command === "brochure") {
		return brochure.render(argv[1] === undefined ? "Fall" : argv[1]);
	}
	if (command === "invoice") {
		if (argv.length < 3) return USAGE;
		const offering = findOffering(argv[1]);
		if (offering === undefined) return `no offering '${argv[1]}'`;
		const customer = findCustomer(argv[2]);
		if (customer === undefined) return `no customer '${argv[2]}'`;
		return invoice.render(offering, customer);
	}
	if (command === "register") {
		if (argv.length < 3) return USAGE;
		const offering = findOffering(argv[1]);
		if (offering === undefined) return `no offering '${argv[1]}'`;
		const customer = findCustomer(argv[2]);
		if (customer === undefined) return `no customer '${argv[2]}'`;
		if (offering.isRegistered(customer)) {
			return `${customer.name} is already registered in ${offering.id}`;
		}
		const gotASpot = offering.register(customer);
		const outcome = gotASpot
			? `${customer.name} is registered in ${offering.id}`
			: `${offering.id} is full — ${customer.name} is number ${offering.getWaitlisted()} on the waitlist`;
		return outcome + "\n\n" + invoice.render(offering, customer);
	}
	if (command === "status") {
		if (argv.length < 2) return USAGE;
		desk.printStatus(argv[1]);
		return "";
	}
	if (command === "customers") {
		loadPrograms();
		return loadCustomers()
			.map((customer) => `${customer.id}  ${customer.name} (born ${customer.birthYear})`)
			.join("\n");
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2)));
}
