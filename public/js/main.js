var fenway;
var mapOption;
var panoramaOptions;
var panorama;

app.controller('MainCtrl',
  function ($scope, $http, $location, ipCookie, $window, DataPost) {
	$scope.street_view_show=false;//Show street view
	$scope.lists = [];//camera user photo lists
	/*Show google map& hide ngView*/
	$scope.$on('Location', function(event, statue){
		$scope.street_view_show = statue;
		console.log(statue);
	});
	$scope.$on('Location_home', function(event, statue){
		$scope.view_home_btn = statue;
	});
	//*Google Map initialize
	var panorama;
	var now_pov_link=0;//目前面向的圖片編號
	function initialize() {
		var fenway = new google.maps.LatLng(24.599646, 120.998735);//設定fenway為座標物件給定做標
		var panoOptions = {//地圖顯示設定
			position: fenway,//設定顯示座標
			addressControl:false,//位置提醒關閉
			zoomControl:false,//放大縮小關閉
			enableCloseButton: false//關閉視窗
		};

		panorama = new google.maps.StreetViewPanorama(//建立地圖為街景模式，設定參數
			document.getElementById('streetview_map'), panoOptions);
			$scope.StreetViewTurn = function(){
				$scope.NoticeBubbleDisappear();
				change_pov();
			};
			$scope.StreetViewForward = function(){
				$scope.NoticeBubbleAppear();
				go_stright();
			};
		// $('#turn').click(function(){change_pov();});//旋轉
		// $('#move').click(function(){go_stright();});//前進			 
	}
	function go_stright(){//由move按鈕觸發
		set_init_pov();//設定初始面向的圖片
		panorama = new google.maps.StreetViewPanorama(//重新顯示街景地圖
				document.getElementById('streetview_map'), {
							pano:panorama.getLinks()[now_pov_link].pano,//設定顯示街景之的圖片ID						
							addressControl:false,//位置提醒關閉
							zoomControl:false,//放大縮小關閉
							enableCloseButton: false,
							pov:panorama.getPov()//設定視角，仰角，縮放與原圖相同
				});
	}
	function calculate_panorama_pov(){//使用者目前的角度
		var pov=panorama.getPhotographerPov().heading+panorama.getPov().heading;
		if(pov>360){
			pov=pov-360;
		}
		else if(pov<0){
			pov=pov+360;
		}
		return pov;
	}
	function set_init_pov(){//設定初始面向的圖片
		now_pov_link=0;//以第0張圖片作為預設值
		var angel_difference,angel_difference_compared,big_angel,small_angel;
		if(panorama.getLinks()[now_pov_link].heading>calculate_panorama_pov()){//計算編號為now_pov_link圖片的視角與使用者視角的差
			big_angel=panorama.getLinks()[now_pov_link].heading;
			small_angel=calculate_panorama_pov();
		}
		else{
			big_angel=calculate_panorama_pov();
			small_angel=panorama.getLinks()[now_pov_link].heading;
		}
		var difference_1,difference_2;
		difference_1=360-big_angel+small_angel;
		difference_2=big_angel-small_angel;
		if(difference_1>difference_2){
			angel_difference=difference_2;
		}
		else{
			angel_difference=difference_1;
		}
		for(var i=0;i<panorama.getLinks().length;i++){//比較編號為now_pov_link圖片的視角與使用者視角的差和編號為I圖片的視角與使用者視角的差取最小值，設為下一個前進之圖片
			if(panorama.getLinks()[i].heading>calculate_panorama_pov()){
				big_angel=panorama.getLinks()[i].heading;
				small_angel=calculate_panorama_pov();
			}
			else{
				big_angel=calculate_panorama_pov();
				small_angel=panorama.getLinks()[i].heading;
			}
			difference_1=360-big_angel+small_angel;
			difference_2=big_angel-small_angel;
			if(difference_1>difference_2){
				angel_difference_compared=difference_2;
			}
			else{
				angel_difference_compared=difference_1;
			}
			if(angel_difference_compared<angel_difference){
				now_pov_link=i;
			}
		}
		
	}
	//由turn觸發，使用者視角，目前規定使用者只能全轉到與目前地圖相關聯圖片的角度
	function change_pov(){
		now_pov_link=now_pov_link+1;
		if(now_pov_link==panorama.getLinks().length){
			now_pov_link=now_pov_link-panorama.getLinks().length;
		}
		var a=panorama.getPhotographerPov().heading-panorama.getLinks()[now_pov_link].heading;//計算使用者是角
		panorama = new google.maps.StreetViewPanorama(//街景模式
				document.getElementById('streetview_map'), {
							pano:panorama.pano,						
							addressControl:false,//位置提醒關閉
							zoomControl:false,//放大縮小關閉
							enableCloseButton: false,
							pov:{heading:a,pitch:panorama.getPov().pitch,zoom:1}
				});
	}
	google.maps.event.addDomListener(window, 'load', initialize);//載入時執行initialize()函式以顯示地圖

	//Trigger notice bubble
	$scope.NoticeBubbleAppear = function(){
		//page change effect
        $(".notice_box").removeClass("animated bounceOut");   
		$(".notice_box").addClass("animated bounceIn");   
	};
	$scope.NoticeBubbleDisappear = function(){
		//page change effect
        $(".notice_box").addClass("animated bounceOut");   
	};
	//Click notice bubble
	$scope.user_lists = [{image: "./img/images1.jpg", name:"周美玉"},
                         {image: "./img/images2.jpg", name:"黃志臨"},
                         {image: "./img/images3.jpg", name:"許坤文"}
                        ];
    
    /*Request  user list*/
    //Request user list success callback
    var LoadUserListSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.user_lists = data.resp.data;
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request user list error callback
    var LoadUserListErrorCallback = function(data, status) { 
    };
    //Request user list
    $scope.LoadUserList = function(){
        DataPost.InitCountPhotoIndex();
        DataPost.Online_list_update(LoadUserListSuccessCallback, LoadUserListErrorCallback);
    };
    /*Request  user list*/
    //Request user list success callback
    var AddNewFriendSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request user list error callback
    var AddNewFriendErrorCallback = function(data, status) { 
    };
    $scope.AddNewFriend = function(){
        var index = DataPost.GetCountPhotoIndex();
        var data = {"sid": $scope.friend_lists[index].sid};
        DataPost.Buddy_add(data, AddNewFriendSuccessCallback, AddNewFriendErrorCallback);
    };
    /*Return home*/
	$scope.BackHome = function(){
		$location.path('/home');
	};
    $scope.ShowUserList = function(){
		//page change effect
        $(".btn_group").addClass("animated zoomOut"); 
        $(".user_carousel" ).css( "visibility", "visible" ); 
        $(".user_carousel").removeClass("animated zoomOut"); 	
		$(".user_carousel").addClass("animated zoomIn"); 
        //Request user list
        $scope.LoadUserList();

	};
    $scope.CloseUserList = function(){
		//page change effect
        $(".user_carousel").addClass("animated zoomOut");
        $(".user_carousel" ).css( "visibility", "hidden" ); 
        $(".btn_group").removeClass("animated zoomOut"); 
        $(".btn_group").addClass("animated zoomIn"); 
	};
    
    /*Request  user personal photo*/
    //Request user personal photo success callback
    var LoadUserPersonPhotoSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        if(data.resp.data!=null){
                            $scope.img_list = data.resp.data.people;
                        }
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request user personal photo error callback
    var LoadUserPersonPhotoErrorCallback = function(data, status) { 
    };
    $scope.LoadUserPersonPhoto = function(){
        DataPost.Photo_list(LoadUserPersonPhotoSuccessCallback, LoadUserPersonPhotoErrorCallback);
    }; 
	/*Camera button*/
	$scope.CameraAppear = function(){
		//page change effect
        $(".street_move_btn").css("z-index", "0"); 
		$(".function_btn").css("z-index", "0");  	
		$(".camera_box").removeClass("animated zoomOut");   
		$(".camera_box").addClass("animated zoomIn");
		$(".camera_box").css("z-index", "13"); 
        //request user persoal photo list
        $scope.LoadUserPersonPhoto();
	};
	$scope.CameraDisappear = function(){
		//page change effect
        $(".camera_box").addClass("animated zoomOut");  
		$(".street_move_btn").css("z-index", "100");  
		$(".function_btn").css("z-index", "100");  
		$(".camera_box").css("z-index", "-1"); 	
	};
	/*Camera gallery*/
	$scope.img_lists = [{ image: './img/images1.jpg'},{ image: './img/images2.jpg'},{ image: './img/images3.jpg'}];
	/*Set media capture*/
    var video = document.getElementById("video"),
		videoObj = { "video": true },
		localStream,
		errBack = function(error) {
			//console.log("Video capture error: ", error.code); 
		};
	/*Go to camera gallery*/
	$scope.GoTakeCamera = function(){
        //page change effect
		$(".take_photo_video").css("visibility", "visible"); 
		$(".streetview_map").css("z-index", "0"); 
		$(".camera_take").removeClass("animated zoomOut");   
		$(".camera_take").addClass("animated zoomInDown"); 
		$(".camera_take").css("z-index", "11"); 
		$(".take_photo_video").css("z-index", "1"); 
		$(".take_camera_btn").css("z-index", "2"); 
		$(".close_camera_btn").css("z-index", "2"); 
        
        //Start media capture
		if(navigator.getUserMedia) { // Standard
			navigator.getUserMedia(videoObj, function(stream) {
				localStream = stream;
				video.src = stream;
				video.play();
			}, errBack);
		} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia(videoObj, function(stream){
				 localStream = stream;
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
			}, errBack);
		}
		else if(navigator.mozGetUserMedia) { // Firefox-prefixed
			navigator.mozGetUserMedia(videoObj, function(stream){
				 localStream = stream;
				video.src = window.URL.createObjectURL(stream);
				video.play();
			}, errBack);
		}
	};
	/*Back to camera gallery*/
	$scope.LeaveTakeCamera = function(){
		//page change effect
        $(".camera_take").addClass("animated zoomOut"); 
		$(".streetview_map").css("z-index", "100"); 
		$(".camera_take").css("z-index", "-1"); 
	};
    var TakeNewPhotoSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    $scope.TakeNewPhotoAndEdit();
                    if(data.resp.msg!=null){
                        
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request Chat room error callback
    var TakeNewPhotoErrorCallback = function(data, status) { 
    };
	/*Take Photo & Edit Photo*/
	$scope.TakeNewPhoto = function(){
		$(".take_photo_video").css("visibility", "hidden"); 
		c.width = video.width;
		c.height= video.height;
		ctx.drawImage(video, 0, 0);
		var canvas_photo;
        //snapshot canvas
        html2canvas($("#photo_canvas"), {
            onrendered: function(canvas) {
                canvas_photo = canvas.toDataURL("image/png");
            }
        });
        //Finish media capture
        localStream.stop();
		
        //The request form
        var form = new FormData();
        form.append('photo', canvas_photo);
        form.append('type', 'people');
        DataPost.Photo_upload(form, TakeNewPhotoSuccessCallback, TakeNewPhotoErrorCallback);
		
	};
	/*set canvas width&height*/
	$scope.width= $window.innerWidth;//set canvas width
	$scope.height= $window.innerHeight;//set canvas height
	/*People photo*/
    $scope.user_image1='./img/old_lady.png';//people photo1
	$scope.user_image2=='';//people photo2
	var image1 = $scope.user_image1;
	var image2 = $scope.user_image2;
	var x, y, w, h,scale=0.5;
	var c = document.getElementById("photo_canvas");
	var ctx = c.getContext("2d");
	$scope.TakeNewPhotoAndEdit = function(){
		//Clean the canvas 
		$('.camera_edit_canvas').removeLayers();
		$scope.user_image1="";
		//Canvas user photo transparent area invisible
		function TransparentPrevent(params) {
			$(this).setPixels({
				x: params.eventX, y: params.eventY,
				width: 1, height: 1,
				// loop through each pixel
				each: function(px, layer) {
					var statue;
					if(px.a==0){
						statue = false;
					}else{
						statue = true;
					}
					$(this).setLayer('image1', {
					   draggable: statue,
					})
					.drawLayers();
				}
			});
		}
		//Canvas user photo draw & control
		$('.camera_edit_canvas').drawImage({
			layer: true, 
			name: 'image1',
			source: image1,
			x: $scope.width/2, y: $scope.height/2,
			scale: scale,
			draggable: true,
			bringToFront : true, 
			mousedown: TransparentPrevent,
			dragstop: function(layer) {
				x = layer.x;
				y = layer.y;
				w = layer.width*scale;
				h = layer.height*scale;
				console.log(w, h);
			},
		});

		//Page change effect
		$(".camera_edit").removeClass("animated zoomOut"); 
		$(".camera_take").addClass("animated zoomOut"); 
		$(".camera_not_edit_area").addClass("animated zoomOut"); 
		$(".camera_take").css("z-index", "-1");  
		$(".camera_edit").addClass("animated zoomIn"); 
		$(".camera_edit").css("z-index", "13");
		
	};
	/*Zoom user photo*/
	$scope.ZoomUserImage = function(x){
		scale+=x*0.1;
		if(scale>=0.1 && scale<=1.5){
			$('.camera_edit_canvas').setLayer('image1', {
				scale: scale,
				name: 'image1'
			}).drawLayers();
		}else{
			scale-=x*0.1;
		}
		
	};
    //Finish photo edit
	$scope.FinishEdit = function(){
		//remove img layer
		$('.camera_edit_canvas').clearCanvas();
		$('.camera_edit_canvas').removeLayers();
	
		//Page change effect
		$(".camera_edit").addClass("animated zoomOut"); 
		$(".camera_edit").css("z-index", "-1"); 
		$(".camera_not_edit_area").removeClass("animated zoomOut"); 
		$(".camera_not_edit_area").addClass("animated zoomIn"); 
		$(".camera_box").addClass("animated zoomOut");  
		$(".street_move_btn").css("z-index", "100");  
		$(".function_btn").css("z-index", "100");  
		$(".camera_box").css("z-index", "-1"); 	
		
	};
    /*Cancel photo edit*/
	$scope.LeaveNewPhotoAndEdit = function(){
		//remove img layer
		$('.camera_edit_canvas').clearCanvas();
		$('.camera_edit_canvas').removeLayers();
	
		//Page change effect
		$(".camera_edit").addClass("animated zoomOut"); 
		$(".camera_edit").css("z-index", "-1"); 
		$(".camera_not_edit_area").removeClass("animated zoomOut"); 
		$(".camera_not_edit_area").addClass("animated zoomIn"); 
	};

    /*Request Chat room*/
    //Chat room success callback
    var GoChatSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //Request Chat room error callback
    var GoChatErrorCallback = function(data, status) { 
    };
    //Chat start
    $scope.GoChat = function(){
        var account = DataPost.GetFriendAccount();
        var data = {"callee_account": account};
        DataPost.Stream_start(data, GoChatSuccessCallback, GoChatErrorCallback);
    };
    /*Request end chat room*/
    //End chat room success callback
    var EndChatSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        
                    }
                }else if(data.resp.error==1){
                }
            }
        }
    };
    //End chat room error callback
    var EndChatErrorCallback = function(data, status) { 
    };
    //Chat end
    $scope.EndChat = function(){
        var account = DataPost.GetFriendAccount();
        var data = {"callee_account": account};
        DataPost.Stream_start(data, GoChatSuccessCallback, GoChatErrorCallback);
    };
	/*Chat room */
    //open chat room
	$scope.OpenFriendChatRoom = function(){
		//page change effect
        $(".view_box").addClass("animated zoomOut"); 
		$(".friend_chat_room").css("z-index", "2"); 
		$(".view_box").css("z-index", "1"); 
		$(".friend_chat_room").removeClass("animated zoomOut"); 
		$(".friend_chat_room").addClass("animated zoomIn"); 
        //chat start request
        $scope.GoChat();
	};
	$scope.$on('OpenFriendChatRoom', function(event){
		$scope.OpenFriendChatRoom();
	});
    //close chat room
	$scope.CloseFriendChatRoom = function(){
		//Page change effect
		$(".friend_chat_room").addClass("animated zoomOut"); 
		$(".view_box").css("z-index", "2"); 
		$(".friend_chat_room").css("z-index", "1"); 
		$(".view_box").removeClass("animated zoomOut"); 
		$(".view_box").addClass("animated zoomIn"); 
        //chat end request
        $scope.EndChat();
	};
});
