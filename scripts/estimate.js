var app = angular.module('estimate', ['pascalprecht.translate', 'ngRoute']);

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
    $routeProvider
    .when('/', {
        templateUrl : 'pages/main.html',
		controller  : 'mainCtrl'
    })
    .when('/next', {
        templateUrl : 'pages/next.html',
        controller  : 'nextCtrl'
    });
});

app.controller('mainCtrl', function ($scope, $http) {
	let self = this;
    $scope.msg = 'Building main tab...';
	$http.get("scripts/results.json")
		.then(function (jsonData) {
			$scope.jdCategory = jsonData.data.category;
			$scope.jdYears = jsonData.data.years;
			$scope.jdTeams = jsonData.data.teams;
			$scope.jdMatches = jsonData.data.scores;
			$scope.finishedMatches = getFinishedMatches($scope.jdMatches, $scope.jdTeams);
			$scope.plannedMatches = getUnfinishedMatches(3, 8, $scope.jdMatches, $scope.jdTeams);
			$scope.scoreTable = getScoreTable($scope.jdMatches, $scope.jdTeams);
			//$scope.futureMatches = getScoreTable($scope.jdMatches, $scope.jdTeams);
		}, function (jsonData) {
			console.warn("Error with reading of data file");
		});

	$scope.toggleTeam = function(clickParameter) {
		$scope.clickTeam = '';
		for (let i = 0; i < $scope.jdTeams.length; i++) {
			let teamcs = 'team' + $scope.jdTeams[i].id;
			if (clickParameter === teamcs)
				$scope.clickTeam = teamcs;
		}
	};

	$scope.unsetTeam = function(clickParameter) {
		if (clickParameter === $scope.clickTeam)
			$scope.clickTeam = '';
	};

	$scope.clickResult = 0;
	$scope.lastValue = -1;
	$scope.isResult = [];
	$scope.futureMatches = new Map();
	$scope.setFutureMatch = function(id, clickedMatch) {
		//$scope.scoreTable = getScoreTable($scope.jdMatches, $scope.jdTeams);
		let oneMatch = clickedMatch;
		if ($scope.lastValue !== id)
			$scope.clickResult = oneMatch.matchResult;
		$scope.clickResult++;
		if ($scope.clickResult === 4)
			$scope.clickResult = 0;
		$scope.lastValue = id;
		$scope.isResult[id] = $scope.clickResult;
		oneMatch.matchResult = $scope.clickResult;
		$scope.futureMatches.set(oneMatch.teamKey, oneMatch);

		$scope.enhTabData = Array.from($scope.jdMatches);
		for (const [key,value] of $scope.futureMatches){
			if (value.matchResult !== 0) {
				let goal1 = 0;
				let goal2 = 0;
				if (value.matchResult === 1) { goal1 = 1; goal2 = 0; }
				if (value.matchResult === 3) { goal1 = 0; goal2 = 1; }
				$scope.enhTabData.push({
					"cycle": 0,
					"round": 0,
					"match": [value.teamId1, value.teamId2],
					"score": [goal1, goal2]
				});
			}
		}
		$scope.scoreTable = getScoreTable($scope.enhTabData, $scope.jdTeams);
	};
});

app.controller('mainMatches', function ($scope) {
	let self = this;
	$scope.msg = 'Building matches';
});


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
