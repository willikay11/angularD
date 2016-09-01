jwt = angular.module('jwt', []);

jwt.constant('API', 'http://test-routes.herokuapp.com');

jwt.config(function($httpProvider)
{
	
	$httpProvider.interceptors.push('jwtInterceptor');
});

jwt.factory('jwtInterceptor', function($window){
	return {
		request: function(config)
		{
			var token = $window.localStorage.getItem('token');;

			
			config.headers.Authorization = 'Bearer ' + token;
			return config;
			
		}

	};
});

jwt.factory('auth', function($http, API, $window){
	var auth = {};

	auth.register = function (username, password)
	{
		$http.post(API+'/auth/register', {username: username, password: password})
		.then(function(response){
			alert('user registered');

		}, function(response)
		{
			alert('an error occurred');
		});
	};

	auth.getToken = function()
	{
		return $window.localStorage.getItem('token');
	};

	auth.login = function(username, password)
	{
		$http.post(API+'/auth/login', {username: username, password: password})
		.then(function(response){
			$window.localStorage.setItem('token', response.data.token);

		}, function(response)
		{
			alert('login failed!');
		});
	};

	auth.logout = function()
	{
		$window.localStorage.removeItem('token');
	};

	return auth;	
});

jwt.controller('MainCtrl', function($scope, auth, API, $http){

	$scope.login = function(){
		alert($scope.username);
		//auth.login($scope.username, $scope.password);
	};

	$scope.register = function()
	{
		auth.register($scope.username, $scope.password);
	}

	$scope.logout = function()
	{
		auth.logout();
	};

	$scope.getQuote = function()
	{
		$http.get(API + '/auth/quote')
		.then(function(response){
			$scope.quote = response.data.message;
		}, function(){

		});
	}

});


    jwt.run(setupFakeBackend);

    // setup fake backend for backend-less development
    function setupFakeBackend($httpBackend) {
        var testUser = { username: 'test', password: 'test', firstName: 'Test', lastName: 'User' };

        alert(testUser.username);
        // fake authenticate api end point
        $httpBackend.whenPOST('/api/authenticate').respond(function (method, url, data) {
            // get parameters from post request
            var params = angular.fromJson(data);
            // check user credentials and return fake jwt token if valid
            if (params.username === testUser.username && params.password === testUser.password) {
                return [200, { token: 'fake-jwt-token' }, {}];
            } else {
                return [200, {}, {}];
            }
        });

        // pass through any urls not handled above so static files are served correctly
        $httpBackend.whenGET(/^\w+.*/).passThrough();
    }