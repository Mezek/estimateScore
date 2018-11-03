var app = angular.module('estimate', ['pascalprecht.translate']);

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

app.controller('Ctrl', function ($scope, $translate) {
	$scope.changeLanguage = function (key) {
		$translate.use(key);
	};
});

app.controller('TableController', ['$scope', function($scope) {
	var self = this;
	self.user={id:null,username:'',address:'',email:''};
	self.id = 4;
	self.team={tid:null,club:'',z:'',v:'',r:'',p:'',sda:'',sdo:''};
	self.tid = 9;
	 
	self.users = [// In future posts, we will get it from server using service
			{id:1, username: 'Sam', address: 'NY', email: 'sam@abc.com'},
			{id:2, username: 'Tomy', address: 'ALBAMA', email: 'tomy@abc.com'},
			{id:3, username: 'kelly', address: 'NEBRASKA', email: 'kelly@abc.com'}
	];
	
	self.teams = [
		{tid:1, club: 'ŠK Slovan Bratislava futbal', z: '9', v: '9', r: '0', p: '0', sda: '84', sdo: '7'},
		{tid:2, club: 'FC Union Nové Zámky', z: '9', v: '7', r: '1', p: '1', sda: '64', sdo: '8'},
		{tid:3, club: 'Spartak Myjava', z: '9', v: '6', r: '1', p: '2', sda: '40', sdo: '11'},
		{tid:4, club: 'FC Spartak Trnava', z: '9', v: '4', r: '1', p: '4', sda: '25', sdo: '19'},
		{tid:5, club: 'FC Nitra', z: '9', v: '4', r: '0', p: '5', sda: '29', sdo: '33'},
		{tid:6, club: 'FK DAC 1904 Dunajská Streda', z: '9', v: '2', r: '1', p: '6', sda: '20', sdo: '61'},
		{tid:7, club: 'FK Senica', z: '9', v: '2', r: '0', p: '7', sda: '6', sdo: '60'},
		{tid:8, club: 'NMŠK 1922 Bratislava', z: '9', v: '0', r: '0', p: '9', sda: '0', sdo: '69'},
	];
	 
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
