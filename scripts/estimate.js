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
			self.jdTeams = jsonData.data.teams;
			self.jdMatches = jsonData.data.scores;
			$scope.finishedMatches = getFinishedMatches(self.jdMatches, self.jdTeams);
			$scope.plannedMatches = getUnfinishedMatches(3, 8, self.jdMatches, self.jdTeams);
			$scope.scoreTable = getScoreTable(self.jdMatches, self.jdTeams);
			//$scope.futureMatches = getScoreTable(self.jdMatches, self.jdTeams);
		}, function (jsonData) {
			console.warn("Error with reading of data file");
		});

	$scope.toggleTeam = function(clickParameter) {
		$scope.clickTeam = '';
		for (let i = 0; i < self.jdTeams.length; i++) {
			let teamcs = 'team' + self.jdTeams[i].id;
			if (clickParameter === teamcs)
				$scope.clickTeam = teamcs;
		}
	};

	$scope.unsetTeam = function(clickParameter) {
		if (clickParameter === $scope.clickTeam)
			$scope.clickTeam = '';
	};

	$scope.clickResult = 0;
	$scope.futureMatches = new Map();
	$scope.setFutureMatch = function(clickedMatch) {
		let oneMatch = clickedMatch;
		$scope.choiceDone = oneMatch.teamKey;
		$scope.clickResult++;
		if ($scope.clickResult === 4)
			$scope.clickResult = 0;
		oneMatch.matchResult = $scope.clickResult;
		$scope.futureMatches.set(oneMatch.teamKey, oneMatch);
		//console.log($scope.futureMatches.size);
		//$scope.futureMatches.forEach((value, key) => console.log(`key: ${key}, value: ${value}`));
			//console.log(`${teamKey}` + ` ` + $scope.clickResult);
		//// ;
		for (const [key,value] of $scope.futureMatches){
		//	console.log(value.matchResult);
		}
		$scope.plannedMatches = buildPlannedWithFuture($scope.plannedMatches, $scope.futureMatches);
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
	
	
	self.submit = function() {
		if(self.user.id === null){
			self.user.id = self.id++;
			console.log('Saving New User', self.user);    
			self.users.push(self.user);//Or send to server, we will do it in when handling services
		}else{
			for(var i = 0; i < self.users.length; i++){
				if(self.users[i].id === self.user.id) {
				  self.users[i] = self.user;
				  break;
				}
			}
		   console.log('User updated with id ', self.user.id);
		}
	};
}]);
