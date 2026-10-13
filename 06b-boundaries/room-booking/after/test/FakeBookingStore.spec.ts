import { bookingStoreContract } from "./bookingStoreContract";
import { FakeBookingStore } from "./FakeBookingStore";

describe("FakeBookingStore", () => {
	bookingStoreContract(() => new FakeBookingStore());
});
