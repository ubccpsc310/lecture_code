// You don't need to read this file.
//
// Assigns each section to the smallest room that fits it. Deliberately slow: about 20 ms per section,
// standing in for a real scheduler that has to search many possible timetables.

export interface Section {
	id: string;
	size: number;
}

export interface Room {
	id: string;
	capacity: number;
}

export interface Schedule {
	assignments: { section: string; room: string }[];
	unassigned: string[];
}

const MS_PER_SECTION = 20;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function schedule(sections: Section[], rooms: Room[]): Promise<Schedule> {
	const bySize = [...rooms].sort((a, b) => a.capacity - b.capacity);
	const result: Schedule = { assignments: [], unassigned: [] };
	for (const section of sections) {
		await sleep(MS_PER_SECTION);
		const room = bySize.find((r) => r.capacity >= section.size);
		if (room === undefined) {
			result.unassigned.push(section.id);
		} else {
			result.assignments.push({ section: section.id, room: room.id });
		}
	}
	return result;
}
