import { JsonBookingStore } from "../../src/adapters/JsonBookingStore";
import { bookingStoreContract } from "../bookingStoreContract";
import { tempFile } from "../tempFile";

// Integration tests: a real JsonBookingStore, writing a real file in a temporary directory. No core.
describe("JsonBookingStore", () => {
	bookingStoreContract(() => new JsonBookingStore(tempFile("bookings.json")));
});
