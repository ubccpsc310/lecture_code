// Starts the API on http://localhost:3000, saving schedules in ./data
import { makeApp } from "./app";

makeApp("data").listen(3000, () => {
	console.log("listening on http://localhost:3000");
});
