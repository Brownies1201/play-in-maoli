app.controller('FriendCtrl',
  function ($scope, $http, $location, ipCookie, Check, DataPost) {
	Check.location(false);
	Check.location_home(true);
	$scope.friend_lists = [{image: "./img/images1.jpg", name:"周美玉", account: 123132133},
						   {image: "./img/images2.jpg", name:"陳啟文", account: 109103121},
						   {image: "./img/images3.jpg", name:"楊中文", account: 11521237731}
						  ];
	/*Request friend list*/
    //Request friend list success callback
    var LoadFriendListSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.friend_lists = data.resp.data;
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request friend list error callback
    var LoadFriendListErrorCallback = function(data, status) { 
    };
	$scope.LoadFriendList = function(){
        DataPost.Buddy_list(LoadFriendListSuccessCallback, LoadFriendListErrorCallback);
    };
    //Loading friend list
    $scope.LoadFriendList();
    $scope.ChooseFriendToChat = function(){
        var index = DataPost.GetCountPhotoIndex();
        DataPost.SetFriendAccount($scope.friend_lists[index]);
        Check.openFriendChatRoom();
	};
    /*Remove friend*/
    //Remove friend success callback
    var RemoveFriendSuccessCallback = function(data, status, headers, config) {
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.LoadFriendList();
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Remove friend error callback
    var RemoveFriendErrorCallback = function(data, status) { 
    };
    $scope.RemoveFriend = function(){
        var index = DataPost.GetCountPhotoIndex();
        var data = {"sid": $scope.friend_lists[index].sid};
        DataPost.Remove_photo(data, RemovePhotoSuccessCallback, RemovePhotoErrorCallback);
    };
});
