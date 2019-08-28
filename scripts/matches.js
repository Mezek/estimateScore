
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
				goal1: 0,
				goal2: 0,
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
	let nL = 5;
	let lastList = [];
	for (let i = 0; i < teams.length; i++) {
		nRound[i] = 0;
		nWin[i] = 0;
		nLost[i] = 0;
		nDrawn[i] = 0;
		nFor[i] = 0;
		nAst[i] = 0;
		nPM[i] = 0;
		lastList[i] = [];
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
					lastList[i].push('W');
				}
				if ( doma === host ) {
					nDrawn[i] = nDrawn[i] + 1;
					nPM[i] -= 2;
					lastList[i].push('D');
				}
				if ( doma < host ) {
					nLost[i] = nLost[i] + 1;
					nPM[i] -= 3;
					lastList[i].push('L');
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
					lastList[i].push('W');
				}
				if ( doma === host ) {
					nDrawn[i] = nDrawn[i] + 1;
					nPM[i] += 1;
					lastList[i].push('D');
				}
				if ( doma < host ) {
					nLost[i] = nLost[i] + 1;
					nPM[i] += 0;
					lastList[i].push('L');
				}
			}
		}
		//if (nFor[i] < 10) nFor[i] = "\xa0\xa0" + nFor[i];
		//if (nAst[i] < 10) nAst[i] = "\xa0\xa0" + nAst[i];
		nGD[i] = nFor[i] - nAst[i];
		nPts[i] = 3*nWin[i] + nDrawn[i];

		let lLSize = lastList[i].length;
		while (lLSize < nL) {
			lastList[i].reverse();
			lastList[i].push('Z');
			lastList[i].reverse();
			lLSize++;
		}
		lastList[i] = lastList[i].slice((lastList[i].length - nL), lastList[i].length).reverse();
	}
	let nAG = cycles*(teams.length - 1);
	for (let i = 0; i < teams.length; i++) {
		scoreTable[i] = { pos: 0, tid: teams[i].id,
			cs: 'team' + teams[i].id, club: teams[i].name,
			allg: nAG, gp: nRound[i], w: nWin[i], d: nDrawn[i],
			l: nLost[i], f: nFor[i], a: nAst[i], gd: nGD[i], pts: nPts[i], pm: nPM[i],
			last: lastList[i],
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
		//console.log("hasDuplicates: ", teamPositions);
		return (new Set(teamPositions)).size !== teamPositions.length;
	}

	function getDuplicateValues(){
		let sameValues = [];
		let onePosition = {};
		for (let key in scoreTable) {
			if (!scoreTable.hasOwnProperty(key)) continue;
			let item = scoreTable[key].pos;
			if (!onePosition[item]) onePosition[item] = 0;
			onePosition[item] += 1;
		}
		for (let prop in onePosition) {
			if (onePosition[prop] >= 2) {
				sameValues.push(prop);
			}
		}
		if (sameValues.length) {return sameValues}
	}

	function getWinner(){
		let winResult = true;
		for (let i = 1; i < scoreTable.length; i++) {
			let td = scoreTable[i];
			let possiblePoints = td.pts + 3*(td.allg - td.gp);
			if (possiblePoints > scoreTable[0].pts) winResult = false;
		}
		scoreTable[0].winner = winResult;
	}

	function setPointsToPositions() {
		scoreTable[0].pos = 0;
		for (let i = 1; i < scoreTable.length; i++) {
			if (scoreTable[i].pts === scoreTable[i-1].pts) {
				scoreTable[i].pos = scoreTable[i-1].pos;
			} else {
				scoreTable[i].pos = i;
			}
			//console.log(i, scoreTable[i].pos, scoreTable[i].pts);
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
			let mutTeams = [];
			for (let j = 0; j < scoreTable.length; j++) {
				if (scoreTable[j].pos == duplicates[i]) {
					mutTeams.push({mid: scoreTable[j].tid, row: j, pts: 0, name: scoreTable[j].club});
				}
			}
			for (let j = 0; j < mutTeams.length - 1; j++) {
				for (let k = j + 1; k < mutTeams.length; k++) {
					let mutualResult = getMutual(mutTeams[j].mid, mutTeams[k].mid);
					mutTeams[j].pts += 3*mutualResult[0] + mutualResult[1];
					mutTeams[k].pts += 3*mutualResult[2] + mutualResult[1];
				}
			}
			mutTeams.sort(perPoints);
			for (let j = 0; j < mutTeams.length - 1; j++) {
				if (mutTeams[j + 1].pts < mutTeams[j].pts) {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos + 1;
				} else {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos;
				}
			}
		}
		scoreTable.sort(perPositions);
	}

	function sortMutualGoolDiffs(){
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let mutTeams = [];
			for (let j = 0; j < scoreTable.length; j++) {
				if (scoreTable[j].pos == duplicates[i]) {
					mutTeams.push({mid: scoreTable[j].tid, row: j, pts: 0, name: scoreTable[j].club});
				}
			}
			for (let j = 0; j < mutTeams.length - 1; j++) {
				for (let k = j + 1; k < mutTeams.length; k++) {
					let mutualResult = getMutual(mutTeams[j].mid, mutTeams[k].mid);
					mutTeams[j].pts += mutualResult[3] - mutualResult[4];
					mutTeams[k].pts += mutualResult[4] - mutualResult[3];
				}
			}
			mutTeams.sort(perPoints);
			for (let j = 0; j < mutTeams.length - 1; j++) {
				if (mutTeams[j + 1].pts < mutTeams[j].pts) {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos + 1;
				} else {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos;
				}
			}
		}
		scoreTable.sort(perPositions);
	}

	function sortMutualGoolMeans(){
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let mutTeams = [];
			for (let j = 0; j < scoreTable.length; j++) {
				if (scoreTable[j].pos == duplicates[i]) {
					mutTeams.push({mid: scoreTable[j].tid, row: j, win: 0, lost: 0, pts: 0, name: scoreTable[j].club});
				}
			}
			for (let j = 0; j < mutTeams.length - 1; j++) {
				for (let k = j + 1; k < mutTeams.length; k++) {
					let mutualResult = getMutual(mutTeams[j].mid, mutTeams[k].mid);
					mutTeams[j].win += mutualResult[3];
					mutTeams[j].lost += mutualResult[4];
				}
				mutTeams[j].pts = mutTeams[j].win/mutTeams[j].lost;
			}
			mutTeams.sort(perPoints);
			for (let j = 0; j < mutTeams.length - 1; j++) {
				if (mutTeams[j + 1].pts < mutTeams[j].pts) {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos + 1;
				} else {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos;
				}
			}
		}
		scoreTable.sort(perPositions);
	}

	function sortGoolDiffs(){
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let mutTeams = [];
			for (let j = 0; j < scoreTable.length; j++) {
				if (scoreTable[j].pos == duplicates[i]) {
					mutTeams.push({mid: scoreTable[j].tid, row: j,
						pts: scoreTable[j].f - scoreTable[j].a,
						name: scoreTable[j].club});
				}
			}
			mutTeams.sort(perPoints);
			for (let j = 0; j < mutTeams.length - 1; j++) {
				if (mutTeams[j + 1].pts < mutTeams[j].pts) {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos + 1;
				} else {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos;
				}
			}
			//console.log(mutTeams);
		}
		scoreTable.sort(perPositions);
	}
	
	function sortGoolMeans() {
		let duplicates = getDuplicateValues();
		for (let i = 0; i < duplicates.length; i++) {
			let mutTeams = [];
			for (let j = 0; j < scoreTable.length; j++) {
				if (scoreTable[j].pos == duplicates[i]) {
					mutTeams.push({mid: scoreTable[j].tid, row: j,
						pts: scoreTable[j].f / scoreTable[j].a,
						name: scoreTable[j].club});
				}
			}
			mutTeams.sort(perPoints);
			for (let j = 0; j < mutTeams.length - 1; j++) {
				if (mutTeams[j + 1].pts < mutTeams[j].pts) {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos + 1;
				} else {
					scoreTable[mutTeams[j + 1].row].pos = scoreTable[mutTeams[j].row].pos;
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
		sortMutualGoolDiffs: sortMutualGoolDiffs,
		sortMutualGoolMeans: sortMutualGoolMeans,
		sortGoolDiffs: sortGoolDiffs,
		sortGoolMeans: sortGoolMeans
	}
}

function perPoints(a, b) {
	if (a.pts < b.pts)
		return +1;
	if (a.pts > b.pts)
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

function createSortedTable(cycles, matches, teams) {
	let tableView = createScoreTable(cycles, matches, teams);

	tableView.sortPoints();
	if (tableView.hasDuplicates()) {
		//console.log("Sort mutual points:");
		tableView.sortMutualPoints();
	}
	if (tableView.hasDuplicates()) {
		//console.log("Sort mutual gools:");
		tableView.sortMutualGoolDiffs();
	}
	if (tableView.hasDuplicates()) {
		//console.log("Sort mutual means:");
		tableView.sortMutualGoolMeans();
	}
	if (tableView.hasDuplicates()) {
		//console.log("Sort goal diffs:");
		tableView.sortGoolDiffs();
	}
	if (tableView.hasDuplicates()) {
		//console.log("Sort goal means:");
		tableView.sortGoolMeans();
	}
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

// TODO: points vs teams
// 1. Vyšší počet bodov vo všetkých zápasoch
// 2. Vyšší počet bodov vo vzájomných zápasoch
// 3. Vyššie celkové skóre vo vzájomných zápasoch (skóre)
// 4. Vyšší počet strelených gólov vo vzájomných zápasoch
// 5. Vyšše celkové skóre vo všetkých zápasoch
// 6. Vyšší počet strelených gólov vo všetkých zápasoch
// 7. Nižší počet trestných minút