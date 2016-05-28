var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ivpusic.cookie', 'ngTouch']);

app.config(function($routeProvider) {
    $routeProvider.
	when('/login', {templateUrl:'page/login.html', controller: 'LoginCtrl'}).
	when('/home', {templateUrl:'page/home.html', controller: 'HomeCtrl'}). 
	when('/friend', {templateUrl:'page/friend.html', controller: 'FriendCtrl'}).
	when('/streetview', {templateUrl:'page/streetview.html', controller: 'StreetViewCtrl'}).
	when('/gallery', {templateUrl:'page/gallery.html', controller: 'GalleryCtrl'}).
    otherwise({redirectTo:'/login'});
});
app.service('Check', function($rootScope){
	this.location = function(statue){
		$rootScope.$broadcast('Location', statue);
	};
	this.location_home = function(statue){
		$rootScope.$broadcast('Location_home', statue);
	};
	this.openFriendChatRoom = function(){
		$rootScope.$broadcast('OpenFriendChatRoom');
	};
});
app.factory('DataPost', function($http, $location, ipCookie){
	var post = {};
    post.url = "../api/index.php?method=";
    post.CheckLogin = function(){
                          
    };
    //Set user data in cookie
    post.Set_user_data = function(data){
        ipCookie('user', data);                      
    };
    //Get user data in cookie
    post.Get_user_data = function(){
        return ipCookie('user');                      
    };
    //Remove user data in cookie
    post.Remove_user_data = function(){
        ipCookie.remove('user', data);                      
    };
    //User register request
    post.User_register = function(data, successCallback, errorCallback){
        $http.post(post.url+'user_register', data
        ).success(successCallback).error(errorCallback);                 
    };
    //User login request
    post.User_login = function(data, successCallback, errorCallback){
        $http.post(post.url+'user_login', data
        ).success(successCallback).error(errorCallback);                    
    }; 
    //Logout success callback
    var LogoutSuccessCallback = function(data, status, headers, config) {
		
	};
    //Logout error callback
	var LogoutErrorCallback = function(data, status) { 
		
	};
    //User logout request
    post.User_logout = function(){
        $http.post(post.url+'user_logout', {}
        ).success(LogoutSuccessCallback).error(LogoutErrorCallback);                    
    };
    //Stream start-start chat
    post.Stream_start = function(data, successCallback, errorCallback){
        $http.post(post.url+'stream_start', data
        ).success(successCallback).error(errorCallback); 
    };
    //Online list update-User list request
    post.Online_list_update = function(successCallback, errorCallback){
        $http.post(post.url+'online_list_update', {}
        ).success(successCallback).error(errorCallback); 
    };
    //Buddy add-User add friend request
    post.Buddy_add = function(data, successCallback, errorCallback){
        $http.post(post.url+'buddy_add', data
        ).success(successCallback).error(errorCallback); 
    };
    //Buddy list-User friends list request
    post.Buddy_list = function(successCallback, errorCallback){
        $http.post(post.url+'buddy_list', {}
        ).success(successCallback).error(errorCallback); 
    };
    //Upload photo request
    post.Photo_upload = function(form, successCallback, errorCallback){
        $http.post(post.url+'photo_upload', form
        ).success(successCallback).error(errorCallback); 
    };
    //Remove photo request
    post.Photo_remove = function(data, successCallback, errorCallback){
        $http.post(post.url+'photo_remove', data
        ).success(successCallback).error(errorCallback); 
    };
    //Photo list request
    post.Photo_list = function(successCallback, errorCallback){
        $http.post(post.url+'photo_list', {}
        ).success(successCallback).error(errorCallback); 
    };
    //Count photo index
    post.count = 0;
    post.InitCountPhotoIndex = function(){
       post.count = 0; 
    };
    post.SetCountPhotoIndex = function(b){
       post.count = b; 
    };
    post.GetCountPhotoIndex = function(){
       return post.count; 
    };
    //Chat friend account
    post.friend_account = 0;
    post.SetFriendAccount = function(data){
       post.friend_account = data.account; 
    };
    post.GetFriendAccount = function(){
       return post.friend_account; 
    };
	return post;
});
app.directive('disableNgAnimate',
    ['$animate', function ($animate) {
        return {
            link: function ($scope, $element, $attrs) {

                $scope.$watch(
                    function() {
                        return $scope.$eval($attrs.setNgAnimate, $scope);
                    },
                    function(newVal) {
                        $animate.enabled(!!newVal, $element);
                    }
                );
            }
        };
    }]
);