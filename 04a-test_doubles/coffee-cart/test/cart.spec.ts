import { expect } from "chai";
import { buyCoffee, getPrice } from "../src/cart";

describe("getPrice", () => {
	it("adds $1 for decaf", () => {
		expect(getPrice(2, "decaf")).to.equal(3);
	});
	it("adds $0.5 for iced", () => {
		expect(getPrice(2, "decaf")).to.equal(2.5);
	});
	it("returns same price with no mods", () => {
		expect(getPrice(2)).to.equal(2);
	});
});

// we still can't test the actual charging of the coffee though...
describe("buyCoffee", () => {
	it("serves coffee when the card is charged", () => {
		expect(buyCoffee(4.5, "iced")).to.equal("enjoy your coffee");
	});

	it("refuses when the card is declined", () => {
		expect(buyCoffee(4.5, "decaf")).to.equal("card declined");
	});
});
