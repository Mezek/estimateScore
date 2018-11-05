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
	$http.get("scripts/results.json")
		.then(function (jsonData) {
			self.jdTeams = jsonData.data.teams;
			self.jdMtchs = jsonData.data.matches;
		}, function (data) {
			console.log("Error with reading of data file");
		});
	self.tableData = {};
	// for loop with:
	//for (var i = 0; i < 100; i++) {
	//  tableData[x] = {name: etc, surname: atd};
	for(var i = 0; i < 8; i++){
		self.tName[i] = {a:1};
	}
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
		{tid:1, club: 'ŠK Slovan Bratislava futbal', z: '9', v: '9', r: '0', p: '0', sda: '84', sdo: '7'},
		{tid:2, club: 'FC Union Nové Zámky', z: '9', v: '7', r: '1', p: '1', sda: '64', sdo: '8'},
		{tid:3, club: 'Spartak Myjava', z: '9', v: '6', r: '1', p: '2', sda: '40', sdo: '11'},
		{tid:4, club: 'FC Spartak Trnava', z: '9', v: '4', r: '1', p: '4', sda: '25', sdo: '19'},
		{tid:5, club: 'FC Nitra', z: '9', v: '4', r: '0', p: '5', sda: '29', sdo: '33'},
		{tid:6, club: 'FK DAC 1904 Dunajská Streda', z: '9', v: '2', r: '1', p: '6', sda: '20', sdo: '61'},
		{tid:7, club: 'FK Senica', z: '9', v: '2', r: '0', p: '7', sda: '6', sdo: '60'},
		{tid:8, club: 'NMŠK 1922 Bratislava', z: '9', v: '0', r: '0', p: '9', sda: '0', sdo: '69'},
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
