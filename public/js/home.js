app.controller('HomeCtrl',
  function ($scope, $http, $location, ipCookie,Check) {
	Check.location(false);
	Check.location_home(false);
	$scope.GoFriend = function(){
		$location.path('/friend');
	};
	$scope.GoStreetView = function(){
		ipCookie('streetview', true);
		$location.path('/streetview');
	};
	$scope.GoGallery = function(){
		$location.path('/gallery');
	};
	
});
