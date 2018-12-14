
// Factory for matches
function createMatches (cycles, matches, teams) {
	const numOfTeams = teams.length;
	const numOfEvents = cycles*numOfTeams*(numOfTeams - 1)/2;
	let allMatches = new Map();
	let finishedMatches = new Map();

	let nKey = 0;
	for (let i = 1; i < cycles+1; i++) {
		for (let j = 1; j < numOfTeams; j++) {
			for (let k = j + 1; k < numOfTeams + 1; k++) {
				let uniqueKey = i + ':' + j + ':' + k;
				allMatches.set(uniqueKey, [i, j, k]);
				nKey++;
			}
		}
	}
	if (nKey !== numOfEvents) {
		console.error("Check number of matches in FCN: " + createMatches.name);
	}

	for (let i = 0; i < matches.length; i++) {
		let nC = matches[i].cycle;
		let nT1 = matches[i].match[0];
		let nT2 = matches[i].match[1];
		let playKey = nC + ':' + nT1 + ':' + nT2;
		finishedMatches.set(playKey, [nC, nT1, nT2]);
	}

	function getAllMatches(){
		return allMatches;
	}

	function getFinishedMatches(){
		return finishedMatches;
	}

	function getUnFinishedMatches(){
		let unFinishedMatches = new Map(getAllMatches());
		let alreadyPlayed = new Map(getFinishedMatches());
		alreadyPlayed.forEach(function(value, key) {
			if (value[1] > value[2]) {
				key = value[0] + ':' + value[2] + ':' + value[1];
			}
			unFinishedMatches.delete(key);
		});
		return unFinishedMatches;
	}

	function createFinishedMatches(){
		let regTeams = new Map();
		for (let i = 0; i < teams.length; i++) {
			regTeams.set(teams[i].id, teams[i].city);
		}
		let playedMatches = [];
		for (let i = 0; i < matches.length; i++) {
			playedMatches[i] = {cycle: matches[i].cycle,
				round: matches[i].round,
				score1: matches[i].score[0],
				score2: matches[i].score[1],
				team1: regTeams.get(matches[i].match[0]),
				team2: regTeams.get(matches[i].match[1]),
				teamClass1: 'team' + matches[i].match[0],
				teamClass2: 'team' + matches[i].match[1]
			};
		}
		return playedMatches;
	}

	function createPlannedMatches(){
		let futurePlay = getUnFinishedMatches();
		let regTeams = new Map();
		for (let i = 0; i < teams.length; i++) {
			regTeams.set(teams[i].id, teams[i].city);
		}
		let futureMatches = [];
		for (const [key,value] of futurePlay.entries()) {
			futureMatches.push({
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
		return futureMatches;
	}

	return {
		createFinishedMatches: createFinishedMatches,
		createPlannedMatches: createPlannedMatches
	}
}

// Factory for Table
function createScoreTable (cycles, matches, teams) {
	let matchList = matches;
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
		for (let j = 0; j < matchList.length; j++) {
			if (matchList[j].match[0] === teams[i].id) {
				nRound[i] = nRound[i] + 1;
				let doma = matchList[j].score[0];
				let host = matchList[j].score[1];
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
			if (matchList[j].match[1] === teams[i].id) {
				nRound[i] = nRound[i] + 1;
				let doma = matchList[j].score[1];
				let host = matchList[j].score[0];
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
		scoreTable[i] = { pos: 0, tid: teams[i].id,
			cs: 'team' + teams[i].id, club: teams[i].name,
			allg: nAG, gp: nRound[i], w: nWin[i], d: nDrawn[i],
			l: nLost[i], f: nFor[i], a: nAst[i], gd: nGD[i], p: nPts[i], pm: nPM[i],
			winner: false };
	}

	function arrangePositions(){
		for (let i = 0; i < scoreTable.length; i++) {
			scoreTable[i].pos = i;
		}
	}

	function getData(){
		return scoreTable;
	}

	function hasDuplicates(){
		let teamPositions = scoreTable.map(function(value){ return value.pos });
		return (new Set(teamPositions)).size !== teamPositions.length;
	}

	function getDuplicateValues(){
		let sameValues = [];
		for (let i = 1; i < scoreTable.length; i++) {
			let onePosition = [];
			while (scoreTable[i].pos === scoreTable[i-1].pos) {
				onePosition.push(scoreTable[i].pos);
				i++;
			}
			if (onePosition.length) {
				let lastValue = onePosition[0];
				onePosition.push(lastValue);
				for (let j = 0; j < onePosition.length; j++) {
					onePosition[j] = onePosition[j] + j;
				}
				sameValues.push(onePosition);
			}
		}
		if (sameValues.length) {return sameValues}
	}

	function getWinner(){
		let winResult = true;
		for (let i = 1; i < scoreTable.length; i++) {
			let td = scoreTable[i];
			let possiblePoints = td.p + 3*(td.allg - td.gp);
			if (possiblePoints > scoreTable[0].p) winResult = false;
		}
		scoreTable[0].winner = winResult;
	}

	function setPointsToPositions() {
		scoreTable[0].pos = 0;
		for (let i = 1; i < scoreTable.length; i++) {
			while (scoreTable[i].p === scoreTable[i-1].p) {
				scoreTable[i].pos = scoreTable[i-1].pos;
				i++;
			}
			scoreTable[i].pos = i;
		}
	}

	function sortPoints(){
		scoreTable.sort(perPoints);
		setPointsToPositions();
	}

	function getMutual(a, b){
		nWin = 0;
		nLost = 0;
		nDrawn = 0;
		nFor = 0;
		nAst = 0;
		for (let i = 0; i < matchList.length; i++) {
			let mItem = matchList[i];
			if ((mItem.match[0] === a) && (mItem.match[1] === b)) {
				doma = mItem.score[0];
				host = mItem.score[1];
				if (doma > host) {
					nWin++;
				}
				if (doma === host) {
					nDrawn++;
				}
				if (doma < host) {
					nLost++;
				}
				nFor += doma;
				nAst += host;
			}
			if ((mItem.match[0] === b) && (mItem.match[1] === a)) {
				host = mItem.score[0];
				doma = mItem.score[1];
				if (doma > host) {
					nWin++;
				}
				if (doma === host) {
					nDrawn++;
				}
				if (doma < host) {
					nLost++;
				}
				nFor += doma;
				nAst += host;
			}
		}
		return [nWin, nDrawn, nLost, nFor, nAst];
	}

	function sortMutualPoints(){
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let oneSet = duplicates[i];
			for (let j = 0; j < oneSet.length - 1; j++) {
				for (let k = j + 1; k < oneSet.length; k++) {
					let mutualResult = getMutual(scoreTable[oneSet[j]].tid, scoreTable[oneSet[k]].tid);
					let diffPoints = mutualResult[0] - mutualResult[2];
					if (diffPoints > 0) {
						scoreTable[oneSet[k]].pos++;
					}
					if (diffPoints < 0) {
						scoreTable[oneSet[j]].pos++;
					}
				}
			}
		}
		scoreTable.sort(perPositions);
	}

	function sortMutualGools(){
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let oneSet = duplicates[i];
			for (let j = 0; j < oneSet.length - 1; j++) {
				for (let k = j + 1; k < oneSet.length; k++) {
					let mutualResult = getMutual(scoreTable[oneSet[j]].tid, scoreTable[oneSet[k]].tid);
					console.log(scoreTable[oneSet[j]].club, scoreTable[oneSet[k]].club);
					if (mutualResult[3] > mutualResult[4]) {
						scoreTable[oneSet[k]].pos++;
					}
					if (mutualResult[3] < mutualResult[4]) {
						scoreTable[oneSet[j]].pos++;
					}
					console.log(mutualResult);
				}
			}
		}
		scoreTable.sort(perPositions);
	}

	return {
		getData: getData,
		getWinner: getWinner,
		hasDuplicates: hasDuplicates,
		sortPoints: sortPoints,
		sortMutualPoints: sortMutualPoints,
		sortMutualGools: sortMutualGools
	}
}

function perPoints(a, b) {
	if (a.p < b.p)
		return +1;
	if (a.p > b.p)
		return -1;
	return 0;
}

function perPositions(a, b) {
	if (a.pos < b.pos)
		return -1;
	if (a.pos > b.pos)
		return +1;
	return 0;
}

function sortFloat(a, b) { return a - b; }

function createSortedTable(cycles, matches, teams) {
	let tableView = createScoreTable(cycles, matches, teams);

	tableView.sortPoints();
	if (tableView.hasDuplicates()) { tableView.sortMutualPoints() }
	if (tableView.hasDuplicates()) { tableView.sortMutualGools() }
	if (tableView.hasDuplicates()) { console.warn("More duplicates") }

	tableView.getWinner();

	return tableView;
}

function getNameFromId(id, teams) {
	let teamName = '';
	for (let i = 0; i < teams.length; i++) {
		if (id === teams[i].id) teamName = teams[i].city;
	}
	return teamName;
}

function getGP(tid, tableData) {
	let gp = null;
	for (let i = 0; i < tableData.length; i++) {
		if (tableData[i].tid === tid) {
			gp = tableData[i].allg - tableData[i].gp;
		}
	}
	return gp;
}

// TODO: function scoreSort(): URČENIE PORADIA DRUŽSTIEV V TABUĽKE
// • vyšší počet bodov
// • vyšší počet bodov zo vzájomných zápasov
// • gólový rozdiel, potom gólový pomer zo súčtu daných a inkasovaných gólov vo vzájomných zápasoch
// • gólový rozdiel a následne pomer zo všetkých zápasov

// TODO: definitoricky jasné a závisiace na výsledkoch

// TODO: 1. points
// 2. Vyšší počet bodů získaný ve vzájemných utkáních v základní části
// 3. Brankový rozdíl ze vzájemných utkání v základní části
// 4. Vyšší počet vstřelených branek ve vzájemných utkáních v základní části
// 5. Vyšší brankový rozdíl ze všech utkání v celé soutěži (včetně nadstavbové části)
// 6. Vyšší počet vstřelených branek v celé soutěži