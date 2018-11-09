// Get all matches
function createAllMatches (nCycle = 1, nTeams = 2) {
	const numOfEvents = nCycle*nTeams*(nTeams-1)/2;
	let allMatches = new Map();
	let nKey = 0;
	for(let i = 1; i < nCycle+1; i++) {
		for(let j = 1; j < nTeams; j++) {
			for(let k = j+1; k < nTeams+1; k++) {
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
	let finishedMatches = [];
	for (let i = 0; i < data.length; i++) {
		finishedMatches[i] = {cycle: data[i].cycle,
			round: data[i].round,
			team1: regTeams.get(data[i].match[0]),
			team2: regTeams.get(data[i].match[1]),
			score1: data[i].score[0],
			score2: data[i].score[1]};
	}
	let testFinished = new Map ();
	for (let i = 0; i < data.length; i++) {
		testFinished.set(i, [data[i].cycle, data[i].match[0], data[i].match[1]]);
	}
	return testFinished;
//	return finishedMatches;
}

// Get unfinished matches
function getUnfinishedMatches (nCycle, nTeams, finishedMatches, teams) {
	let allMatches = createAllMatches(nCycle, nTeams);
	let unfinishedMatches = new Map();
	for (const [key,value] of finishedMatches){
		//for if break
		console.log(`key: ${key}, value: ${value}`);
	}
	return unfinishedMatches;
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