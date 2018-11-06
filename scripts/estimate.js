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

app.controller('mainCtrl', function ($scope) {
    $scope.msg = 'Main Tab message';
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
	
	$scope.tnames = [];
	$scope.jd = [];
	$http.get("scripts/results.json")
		.then(function (jsonData) {
			//$scope.jnames = JSON.stringify(jsonData.data.teams);
			jd = jsonData.data.teams;
			for(var i = 0; i < jd.length; i++){
				$scope.tnames.push(jd[i].name);
			}
		}, function (data) {
			console.log("There was an error");
		});
});	

app.controller('tableOrderCtrl', function($scope, $http) {
	var self = this;

	self.tName = [];
	self.jdTeams = [];
    self.tableData = {};
    $http.get("scripts/results.json")
		.then(function (jsonData) {
			self.jdTeams = jsonData.data.teams;
			self.jdMtchs = jsonData.data.scores;
			let nTeam = self.jdTeams.length;
			let nRound = [];
			let nWin = [];
			let nLost = [];
			let nDrawn = [];
			let nFor = [];
			let nAst = [];
			let nGD = [];
			let nPts = [];
			let nPM = [];
			for (let i = 0; i < nTeam; i++) {
				nRound[i] = 0;
				nWin[i] = 0;
				nLost[i] = 0;
				nDrawn[i] = 0;
				nFor[i] = 0;
				nAst[i] = 0;
				nPM[i] = 0;
				for (let j = 0; j < self.jdMtchs.length; j++) {
					if (self.jdMtchs[j].match[0] === self.jdTeams[i].id) {
						nRound[i] = nRound[i] + 1;
						let doma = self.jdMtchs[j].score[0];
						let host = self.jdMtchs[j].score[1];
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
					if (self.jdMtchs[j].match[1] === self.jdTeams[i].id) {
						nRound[i] = nRound[i] + 1;
						let doma = self.jdMtchs[j].score[1];
						let host = self.jdMtchs[j].score[0];
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

					//if(self.jdMtchs[j].round === 1){
					//	nRound++;
					//}
				}
				nGD[i] = nFor[i] - nAst[i];
				nPts[i] = 3*nWin[i] + nDrawn[i];
			}

			for (let i = 0; i < nTeam; i++) {
				self.tableData[i] = {tid: self.jdTeams[i].id, club: self.jdTeams[i].name, gp: nRound[i],
					w: nWin[i], d: nDrawn[i], l: nLost[i], f: nFor[i], a: nAst[i],
					gd: nGD[i], p: nPts[i], pm: nPM[i]};
			}
		}, function (data) {
			console.log("Error with reading of data file");
		})
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
	
	self.setNotWorking = function(tID) {
		for(var i = 0; i < self.scoreData.length; i++){
			if (self.scoreData[i].tid === tID)
				alert(self.scoreData[i].tid);
				//self.team-set = "1";
		}
	};
	
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
