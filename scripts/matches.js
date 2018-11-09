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

// Get finished matches
function getFinishedMatches (data, teams) {
	let regTeams = new Map();
	for(let i = 0; i < teams.length; i++) {
		regTeams.set(teams[i].id, teams[i].city);
	}
	let mat = [];
	for (let i = 0; i < data.length; i++) {
		mat[i] = {r: data[i].round,
			t1: regTeams.get(data[i].match[0]),
			t2: regTeams.get(data[i].match[1]),
			s1: data[i].score[0],
			s2: data[i].score[1]};
	}
	return mat;
}

// Get unfinished matches
function getUnfinishedMatches (data) {
	const unfinishedMatches = new Map(data);
	return " yes";
}
/**
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
**/