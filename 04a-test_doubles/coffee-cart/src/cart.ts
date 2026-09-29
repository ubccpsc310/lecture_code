import { BankCardReader } from "./bank";

export function buyCoffee(price: number, modification?: string): string {
	const reader = new BankCardReader();
	let priceToCharge = price;
	if (modification === "decaf") priceToCharge += 1.0;
	else if (modification === "iced") priceToCharge += 0.5;
	return reader.charge(priceToCharge) ? "enjoy your coffee" : "card declined";
}
