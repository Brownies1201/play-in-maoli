app.controller('StreetViewCtrl',
  function ($scope, $http, $location, ipCookie, Check) {
	if(ipCookie('streetview')==true){
		ipCookie.remove('streetview');
		location.reload();
	}
	Check.location(true);
});
