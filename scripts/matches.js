// Get all matches
function createAllMatches (nCycles = 1, nTeams = 2) {
	const numOfEvents = nCycles*nTeams*(nTeams-1)/2;
	let allMatches = new Map();
	let nKey = 0;
	for(let i = 1; i < nCycles+1; i++) {
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
			score1: data[i].score[0],
			score2: data[i].score[1],
			team1: regTeams.get(data[i].match[0]),
			team2: regTeams.get(data[i].match[1]),
			teamClass1: 'team' + data[i].match[0],
			teamClass2: 'team' + data[i].match[1]
		};
	}
	return finishedMatches;
}

function getScoreTable (cycles, matches, teams) {
	let dataDone = matches;
	let scoreTable = [];
	let nRound = [];
	let nWin = [];
	let nLost = [];
	let nDrawn = [];
	let nFor = [];
	let nAst = [];
	let nGD = [];
	let nPts = [];
	let nPM = [];
	for (let i = 0; i < teams.length; i++) {
		nRound[i] = 0;
		nWin[i] = 0;
		nLost[i] = 0;
		nDrawn[i] = 0;
		nFor[i] = 0;
		nAst[i] = 0;
		nPM[i] = 0;
		for (let j = 0; j < dataDone.length; j++) {
			if (dataDone[j].match[0] === teams[i].id) {
				nRound[i] = nRound[i] + 1;
				let doma = dataDone[j].score[0];
				let host = dataDone[j].score[1];
				nFor[i] += doma;
				nAst[i] += host;
				if ( doma > host ) {
					nWin[i] = nWin[i] + 1;
					nPM[i] += 0;
				}
				if ( doma === host ) {
					nDrawn[i] = nDrawn[i] + 1;
					nPM[i] -= 2;
				}
				if ( doma < host ) {
					nLost[i] = nLost[i] + 1;
					nPM[i] -= 3;
				}
			}
			if (dataDone[j].match[1] === teams[i].id) {
				nRound[i] = nRound[i] + 1;
				let doma = dataDone[j].score[1];
				let host = dataDone[j].score[0];
				nFor[i] += doma;
				nAst[i] += host;
				if ( doma > host ) {
					nWin[i] = nWin[i] + 1;
					nPM[i] += 3;
				}
				if ( doma === host ) {
					nDrawn[i] = nDrawn[i] + 1;
					nPM[i] += 1;
				}
				if ( doma < host ) {
					nLost[i] = nLost[i] + 1;
					nPM[i] += 0;
				}
			}
		}
		//if (nFor[i] < 10) nFor[i] = "\xa0\xa0" + nFor[i];
		//if (nAst[i] < 10) nAst[i] = "\xa0\xa0" + nAst[i];
		nGD[i] = nFor[i] - nAst[i];
		nPts[i] = 3*nWin[i] + nDrawn[i];
	}
	let nAG = cycles*(teams.length - 1);
	for (let i = 0; i < teams.length; i++) {
		scoreTable[i] = {tid: teams[i].id, cs: 'team' + teams[i].id, club: teams[i].name,
			allg: nAG, gp: nRound[i], w: nWin[i], d: nDrawn[i],
			l: nLost[i], f: nFor[i], a: nAst[i], gd: nGD[i], p: nPts[i], pm: nPM[i]};
	}
	// prepared for more sophisticated score sort
	scoreTable.sort(compare);
	//$.getScript("scripts/matches.js", function() {
	//	console.log(createAllMatches(2, 5));
	//});
	return scoreTable;
}

function compare(a,b) {
	if (a.p < b.p)
		return +1;
	if (a.p > b.p)
		return -1;
	return 0;
};

function getAlreadyPlayed (data) {
	let alreadyPlayed = new Map();
	for (let i = 0; i < data.length; i++) {
		alreadyPlayed.set(i, [data[i].cycle, data[i].match[0], data[i].match[1]]);
	}
	return alreadyPlayed;
}

function getPlanned (allMatches, alreadyPlayed) {
	let futurePlayed = new Map(allMatches);
	for (const [key,value] of alreadyPlayed) {
		let comparedValue = value;
		if (value[1] > value[2]) {
			comparedValue = [value[0], value[2], value[1]];
		}
		for (const [key2,value2] of futurePlayed) {
			if (value2.every(function(value, index) { return value === comparedValue[index]})) {
				futurePlayed.delete(key2);
				break;
			}
		}
	}
	return futurePlayed;
}

// Get unfinished matches
function getUnfinishedMatches (nCycles, nTeams, data, teams) {
	let allMatches = createAllMatches(nCycles, nTeams);
	let alreadyPlayed = getAlreadyPlayed(data);
	let futurePlayed = getPlanned(allMatches, alreadyPlayed);
	let regTeams = new Map();
	for(let i = 0; i < teams.length; i++) {
		regTeams.set(teams[i].id, teams[i].city);
	}
	let unfinishedMatches = [];
	for (const [key,value] of futurePlayed.entries()) {
		unfinishedMatches.push({
			matchResult: 0,
			teamId1: value[1],
			teamId2: value[2],
			teamName1: regTeams.get(value[1]),
			teamName2: regTeams.get(value[2]),
			teamClass1: 'team' + value[1],
			teamClass2: 'team' + value[2],
			teamKey: key
		});
	}
	return unfinishedMatches;
}

function getNameFromId (id, teams) {
	let teamName = '';
	for(let i = 0; i < teams.length; i++) {
		if (id === teams[i].id) teamName = teams[i].city;
	}
	return teamName;
}

function getGP (id, tableData) {
	let gp = tableData[id].allg - tableData[id].gp;
	return gp;
}