// Get all matches
function createAllMatches (cycle = 1, teams = 2) {
	const numOfEvents = cycle*teams*(teams-1)/2;
	let allMatches = new Map();
	let nKey = 0;
	for(let i = 1; i < cycle+1; i++) {
		for(let j = 1; j < teams; j++) {
			for(let k = j+1; k < teams+1; k++) {
				allMatches.set(nKey, [i, j, k]);
				nKey++;
			}
		}
	}
	if (nKey != numOfEvents) {
		console.error("Check number of matches in FCN: " + createAllMatches.name);
	}
	return allMatches;
}
// Get unfinished matches
function getUnfinishedMatches (data) {
	const unfinishedMatches = new Map(data);
	return " yes";
}

const tableName = 'user'
const User = {
	getOne (userId) {
		return knex(tableName)
			.where({ id: userId })
			.first()
	}
};

// route handler (eg. server/routes/user/get.js)
function getUserRouteHandler (req, res) {
	const { userId } = req.params;
	User.getOne(userId)
		.then((user) => res.json(user))
}
