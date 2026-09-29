import { expect } from "chai";
import { buyCoffee } from "../src/cart";

describe("buyCoffee", () => {
	it("serves coffee when the card is charged", () => {
		expect(buyCoffee(4.5, "iced")).to.equal("enjoy your coffee");
	});

	it("refuses when the card is declined", () => {
		expect(buyCoffee(4.5, "decaf")).to.equal("card declined");
	});
});
