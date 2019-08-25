const app = angular.module('estimate', ['pascalprecht.translate', 'ngRoute']);

app.config(function ($translateProvider) {
	$translateProvider.translations('en', {
		TITLE: 'Hello',
		HEADER_DESCRIPTION: 'Developing version',
		FOO: 'This is a paragraph.',
		BUTTON_LANG_EN: 'english',
		BUTTON_LANG_SK: 'slovak'
	});
	$translateProvider.translations('sk', {
		TITLE: 'Ahoj',
		HEADER_DESCRIPTION: 'Pracovná verzia',
		FOO: 'Toto je paragraf.',
		BUTTON_LANG_EN: 'anglicky',
		BUTTON_LANG_SK: 'slovensky'
	});
	$translateProvider.preferredLanguage('en');
});

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'pages/main.html',
		controller  : 'mainCtrl',
	});
	$routeProvider.when('/team_WU15', {
		templateUrl : 'pages/team_WU15.html',
		controller  : 'wuCtrl'
	});
	$routeProvider.when('/team_WU19/ResFile/:resultsDat', {
		templateUrl : 'pages/team_WU15.html',
		controller  : 'wuCtrl'
	});
	$routeProvider.when('/history', {
		templateUrl : 'pages/history.html',
		controller  : 'nextCtrl'
	});
	$routeProvider.when('/next', {
		templateUrl : 'pages/next.html',
		controller  : 'nextCtrl'
	});
});

app.controller('mainCtrl', ['$scope', '$route', '$http', '$routeParams', function ($scope, $route, $http, $routeParams) {
	let self = this;
	let controlAs = $routeParams.resultsDat;

	$scope.msg = 'Testing functionality on following football group...' + controlAs;
	$http.get("scripts/results.json")
		.then(function (jsonData) {
			$scope.jdCategory = jsonData.data.category;
			$scope.jdYears = jsonData.data.years;
			$scope.nCycles = jsonData.data.cycles;
			$scope.jdTeams = jsonData.data.teams;
			$scope.nTeams = $scope.jdTeams.length;
			$scope.jdMatches = jsonData.data.scores;

			self.basicTable = createSortedTable($scope.nCycles, $scope.jdMatches, $scope.jdTeams);
			$scope.scoreTable = self.basicTable.getData();

			self.allMatches = createMatches($scope.nCycles, $scope.jdMatches, $scope.jdTeams);
			$scope.finishedMatches = self.allMatches.createFinishedMatches();
			$scope.plannedMatches = self.allMatches.createPlannedMatches();

			//console.log($scope.finishedMatches);

		}, function (jsonData) {
			console.warn("Error with reading of data file");
		});


	$scope.isToggled = [];
	$scope.checkedTid = 0;
	$scope.showLeftMatches = false;

	$scope.toggleTeam = function(clickParameter) {
		// double click to untoggle team
		if ( $scope.checkedTid === clickParameter ) {
			$scope.isToggled[clickParameter] = false;
			$scope.checkedTid = 0;
			$scope.clickTeam = '';
			$scope.checkedName = '';
			$scope.oneTeamLefts = null;
			$scope.showLeftMatches = false;
			return;
		}
		// continue with click
		for (let i = 0; i < $scope.jdTeams.length; i++) {
			if ( i+1 === clickParameter) {
				$scope.isToggled[i+1] = true;
				$scope.checkedTid = clickParameter;
				$scope.clickTeam = 'team' + $scope.jdTeams[i].id;
			} else {
				$scope.isToggled[i+1] = false;
			}
		}
		$scope.showLeftMatches = true;
		$scope.checkedName = getNameFromId($scope.checkedTid, $scope.jdTeams);
		$scope.oneTeamLefts = getGP($scope.checkedTid, $scope.scoreTable);
	};

	$scope.clickResult = 0;
	//$scope.matchLetter = '';
	$scope.lastValue = -1;
	$scope.isResult = [];
	$scope.futureMatches = new Map();

	$scope.setFutureMatch = function(valIndex, plannedMatch) {
		if ($scope.lastValue !== valIndex)
			$scope.clickResult = plannedMatch.matchResult;
		$scope.clickResult++;
		if ($scope.clickResult === 4)
			$scope.clickResult = 0;

		switch ($scope.clickResult) {
			case 0:
				plannedMatch.goal1 = 0;
				plannedMatch.goal2 = 0;
				break;
			case 1:
				plannedMatch.goal1 = 1;
				plannedMatch.goal2 = 0;
				break;
			case 2:
				plannedMatch.goal1 = 1;
				plannedMatch.goal2 = 1;
				break;
			case 3:
				plannedMatch.goal1 = 0;
				plannedMatch.goal2 = 1;
				break;
		}

		$scope.lastValue = valIndex;
		$scope.isResult[valIndex] = $scope.clickResult;
		plannedMatch.matchResult = $scope.clickResult;
		if ($scope.clickResult === 0) {
			$scope.futureMatches.delete(plannedMatch.teamKey);
		} else {
			$scope.futureMatches.set(plannedMatch.teamKey, plannedMatch);
		}

		$scope.enhTabData = Array.from($scope.jdMatches);
		for (const [key,value] of $scope.futureMatches) {
			if (value.matchResult !== 0) {
				$scope.enhTabData.push({
					"cycle": 0,
					"round": 0,
					"match": [value.teamId1, value.teamId2],
					"score": [value.goal1, value.goal2],
					"key": key
				});
			}
		}
		$scope.updateEnhTabData();
	};

	$scope.updateEnhTabData = function() {
		$scope.scoreTable = createSortedTable($scope.nCycles, $scope.enhTabData, $scope.jdTeams).getData();
		$scope.oneTeamLefts = getGP($scope.checkedTid, $scope.scoreTable);
	};

	$scope.setG1Up = function(n) {
		let r = n.matchResult;
		if (r !== 0) {
			n.goal1++;
			if (r === 1 && n.goal1 <= n.goal2) {
				n.goal2 = n.goal1 - 1;
			}
			if (r === 2) {
				n.goal2 = n.goal1;
			}
			if (r === 3 && n.goal1 >= n.goal2) {
				n.goal2 = n.goal1 + 1;
			}
		}
		$scope.enhTabData.forEach(function (item) {
			if (item.key === n.teamKey) {
				item.score = [n.goal1, n.goal2];
			}
		});
		$scope.updateEnhTabData();
	};

	$scope.setG2Up = function(n) {
		let r = n.matchResult;
		if (r !== 0) {
			n.goal2++;
			if (r === 1 && n.goal2 >= n.goal1) {
				n.goal1 = n.goal2 + 1;
			}
			if (r === 2) {
				n.goal1 = n.goal2;
			}
			if (r === 3 && n.goal2 <= n.goal1) {
				n.goal1 = n.goal2 - 1;
			}
		}
		$scope.enhTabData.forEach(function (item) {
			if (item.key === n.teamKey) {
				item.score = [n.goal1, n.goal2];
			}
		});
		$scope.updateEnhTabData();
	};

	$scope.setG1Down = function(n) {
		let r = n.matchResult;
		if (r !== 0) {
			n.goal1--;
			if (n.goal1 < 0) {
				n.goal1 = 0;
			}
			if (r === 1 && n.goal1 < 1) {
				n.goal1 = 1;
			}
			if (r === 1 && n.goal2 >= n.goal1) {
				n.goal2 = n.goal1 - 1;
			}
			if (r === 2) {
				n.goal2 = n.goal1;
			}
			if (r === 3 && n.goal1 >= n.goal2) {
				n.goal2 = n.goal1 + 1;
			}
		}
		$scope.enhTabData.forEach(function (item) {
			if (item.key === n.teamKey) {
				item.score = [n.goal1, n.goal2];
			}
		});
		$scope.updateEnhTabData();
	};

	$scope.setG2Down = function(n) {
		let r = n.matchResult;
		if (r !== 0) {
			n.goal2--;
			if (n.goal2 < 0) {
				n.goal2 = 0;
			}
			if (r === 1 && n.goal2 >= n.goal1) {
				n.goal1 = n.goal2 + 1;
			}
			if (r === 2) {
				n.goal1 = n.goal2;
			}
			if (r === 3 && n.goal2 < 1 ) {
				n.goal2 = 1;
			}
			if (r === 3 && n.goal1 >= n.goal2) {
				n.goal1 = n.goal2 - 1;
			}
		}
		$scope.enhTabData.forEach(function (item) {
			if (item.key === n.teamKey) {
				item.score = [n.goal1, n.goal2];
			}
		});
		$scope.updateEnhTabData();
	};

	$scope.reloadRoute = function() {
		$route.reload();
	};

	$scope.date = new Date();
}]);

app.controller('mainMatches', function ($scope) {
	let self = this;
	$scope.msg = 'Building matches';
});

app.controller('wuCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
	let self = this;
	let currentPar = $routeParams.resultsDat;
	$scope.msg = 'Welcome fan of ' + currentPar + '!';
}]);

app.controller('nextCtrl', function ($scope) {
    $scope.msg = 'Next Tab message';
});

app.controller('Ctrl', function ($scope, $translate) {
	$scope.changeLanguage = function (key) {
		$translate.use(key);
	};
});

app.controller('Click', function ($scope, $http) {
	$scope.class_status = 0;
	$scope.setClass = function() {
		$scope.class_status = !$scope.class_status;
		$scope.single_message = "Class is toggle";
	};
	
	$scope.teamNames = [];
	$scope.jd = [];
	$http.get("scripts/results.json")
		.then(function (jsonData) {
			//$scope.jnames = JSON.stringify(jsonData.data.teams);
			jd = jsonData.data.teams;
			for(var i = 0; i < jd.length; i++){
				$scope.teamNames.push(jd[i].name);
			}
		}, function () {
			console.log("There was an error");
		});
});

app.controller('tableCtrl', ['$scope', function($scope) {
	var self = this;
	
	self.user={id:null,username:'',address:'',email:''};
	self.id = 4;
	self.scoreRow={tid:null,club:'',z:'',v:'',r:'',p:'',sda:'',sdo:''};
	self.tid = 9;
	 
	self.users = [// In future posts, we will get it from server using service
			{id:1, username: 'Sam', address: 'NY', email: 'sam@abc.com'},
			{id:2, username: 'Tomy', address: 'ALBAMA', email: 'tomy@abc.com'},
			{id:3, username: 'kelly', address: 'NEBRASKA', email: 'kelly@abc.com'}
	];
	
	self.scoreData = [
		{tid:1, club: 'ŠK Slovan Bratislava futbal', z: '10', v: '10', r: '0', p: '0', sda: '95', sdo: '7'},
		{tid:2, club: 'FC Union Nové Zámky', z: '10', v: '7', r: '2', p: '1', sda: '66', sdo: '10'},
		{tid:3, club: 'Spartak Myjava', z: '10', v: '6', r: '2', p: '2', sda: '42', sdo: '13'},
		{tid:4, club: 'FC Spartak Trnava', z: '10', v: '5', r: '1', p: '4', sda: '32', sdo: '21'},
		{tid:5, club: 'FC Nitra', z: '10', v: '4', r: '0', p: '6', sda: '31', sdo: '40'},
		{tid:6, club: 'FK DAC 1904 Dunajská Streda', z: '10', v: '3', r: '1', p: '6', sda: '26', sdo: '61'},
		{tid:7, club: 'FK Senica', z: '10', v: '2', r: '0', p: '8', sda: '6', sdo: '71'},
		{tid:8, club: 'NMŠK 1922 Bratislava', z: '10', v: '0', r: '0', p: '10', sda: '0', sdo: '75'},
	];
	
	self.setN = function(tID) {
		for(var i = 0; i < self.scoreData.length; i++){
			if (self.scoreData[i].tid === tID)
				alert(self.scoreData[i].tid);
				//self.team-set = "1";
		}
	};
	
	self.selectedRow = null;
	self.setHomeTeam = function(tID) {
		self.selectedRow = tID - 1;
	};
	
	self.unsetHomeTeam = function(tID) {
		if (self.selectedRow === tID - 1)
			self.selectedRow = null;
	};
}]);
