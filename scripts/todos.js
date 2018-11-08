// Get all matches
function createAllMatches (cycle, teams) {
	const nRounds = cycle*teams*(teams-1)/2;
	return nRounds;
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

sayit = function(text) {
	return "Sophisticated comparison" + text;
};