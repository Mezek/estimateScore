var app = angular.module('estimate', ['pascalprecht.translate']);

app.config(function ($translateProvider) {
	$translateProvider.translations('en', {
		TITLE: 'Hello',
		FOO: 'This is a paragraph.',
		BUTTON_LANG_EN: 'english',
		BUTTON_LANG_DE: 'german'
	});
	$translateProvider.translations('de', {
		TITLE: 'Hallo',
		FOO: 'Dies ist ein Paragraph.',
		BUTTON_LANG_EN: 'englisch',
		BUTTON_LANG_DE: 'deutsch'
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
	 
	self.users = [// In future posts, we will get it from server using service
			{id:1, username: 'Sam', address: 'NY', email: 'sam@abc.com'},
			{id:2, username: 'Tomy', address: 'ALBAMA', email: 'tomy@abc.com'},
			{id:3, username: 'kelly', address: 'NEBRASKA', email: 'kelly@abc.com'}
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
