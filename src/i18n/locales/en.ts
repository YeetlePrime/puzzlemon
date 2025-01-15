const en = {
	riddle: "Riddle",
	answer: "Answer",
	submit: "Submit",
	cancel: "Cancel",
	commands: {
		answer: {
			description: "Submit your answer to a riddle.",
			modalTitle: "Answer a riddle",
			wrong: "This is not a solution to any of the riddles.",
			right: "This is the solution to",
			error: "Could not check if the answer was valid."
		},
		clear: {
			description: "Delete all riddles.",
			success: "Successfully deleted all riddles.",
			error: "Could not delete riddles.",
			timeout: "You took too long to submit.",
			sure: "Are you sure that you want to delete all riddles?"
		},
		create: {
			description: "Create a new riddle.",
			modalTitle: "Create riddle",
			success: "Successfully created a new riddle.",
			error: "Could not create the riddle.",
		},
		get: {
			description: "View all riddles.",
			empty: "There are no riddles.",
			error: "Could not load riddles.",
		},
		info: {
			description: "View your progression on all riddles.",
			solvedTitle: "Solved riddles",
			nextTitle: "Next riddle",
			allSolved: "You have already solved all riddles.",
			error: "Could not load riddles.",
		},
	},
};

export default en;
