app.controller('GalleryCtrl',
  function ($scope, $http, $location, ipCookie, $window, Check, DataPost) {
	 Check.location(false);
	 Check.location_home(true);
     DataPost.InitCountPhotoIndex();
	 $scope.gallery_lists = [{photo: "./img/gallery1.jpg"},
							 {photo: "./img/gallery2.jpg"},
							 {photo: "./img/gallery3.jpg"}
							];
    /*Photo list*/
    //Photo list success callback
    var LoadPhotoListSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.gallery_lists = data.resp.data;
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Photo list error callback
    var LoadPhotoListErrorCallback = function(data, status) { 
    };
	$scope.LoadPhotoList = function(){
        DataPost.Photo_list(LoadPhotoListSuccessCallback, LoadPhotoListErrorCallback);
    };
    //Loading photo list
    $scope.LoadPhotoList();
    $scope.ChooseFriendToChat = function(){
		Check.openFriendChatRoom();
	};
    
    /*Remove photo*/
    //Remove photo success callback
    var RemovePhotoSuccessCallback = function(data, status, headers, config) {
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.LoadPhotoList();
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Remove photo error callback
    var RemovePhotoErrorCallback = function(data, status) { 
    };
    $scope.PhotoRemove = function(){
        var index = DataPost.GetCountPhotoIndex();
        var data = {"sid": $scope.gallery_lists[index].sid};
        DataPost.Photo_remove(data, RemovePhotoSuccessCallback, RemovePhotoErrorCallback);
    };
});
 