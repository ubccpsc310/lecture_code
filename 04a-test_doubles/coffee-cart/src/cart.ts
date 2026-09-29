import { IReader } from "./reader";

export function getPrice(initialPrice: number, modification?: string): number {
	let priceToCharge = initialPrice;
	if (modification === "decaf") priceToCharge += 1.0;
	else if (modification === "iced") priceToCharge += 0.5;
	return priceToCharge;
}

export function buyCoffee(reader: IReader, price: number, modification?: string): string {
	const priceToCharge = getPrice(price, modification);
	return reader.charge(priceToCharge) ? "enjoy your coffee" : "card declined";
}
