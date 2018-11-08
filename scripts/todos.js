// Get all matches
function createAllMatches (cycle = 2, teams = 4) {
	const nRounds = cycle*teams*(teams-1)/2;
	allMatches = new Map();
	let nKey = 0;
	for(let k = 0; k < cycle; k++) {
		for(let i = 1; i < cycle+1; i++) {
			for(let j = 1; j < teams; j++) {
				for(let l = j+1; l < teams+1; l++) {
					allMatches.set(nKey, [i, j, l]);
					console.log(k, nKey, i, j, l);
					nKey++;
				}
			}
		}
	}
	//console.log (allMatches);
	//return allMatches;
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
