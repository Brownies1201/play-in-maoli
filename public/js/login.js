app.controller('LoginCtrl',
  function ($scope, $http, $location, ipCookie, Check, DataPost) {
    Check.location(false);
    $scope.login_statue = "btn-primary";
    $scope.warning_alert = '';
    $scope.account = '';
     var phoneRule = /^[0-9]*$/;
    $scope.ChangeStatue = function(x){
        if(x==0){
            $scope.login_statue = "btn-primary";
            $scope.register_statue = "";
        }else{
            $scope.login_statue = "";
            $scope.register_statue = "btn-primary";
        }
    };
    $scope.ChangeLanguage = function(x){
        if(x==0){
            $scope.lang_mandarin = "lang_onclick";
            $scope.lang_chinese = "";
            $scope.lang_hakka = "";
            $scope.language = "mandarin";
        }else if(x==1){
            $scope.lang_mandarin = "";
            $scope.lang_chinese = "lang_onclick";
            $scope.lang_hakka = "";
            $scope.language = "chinese";
        }else if(x==2){
            $scope.lang_mandarin = "";
            $scope.lang_chinese = "";
            $scope.lang_hakka = "lang_onclick";
            $scope.language = "hakka";
        }
    };
    $scope.CleanLanguage = function(){
        $scope.lang_mandarin = "";
        $scope.lang_chinese = "";
        $scope.lang_hakka = "";
    };
    $scope.ClickButton = function(){
      
        if($scope.login_statue!=""){
            $scope.Login();
        }else{
            $scope.Register();
        }
    };
    /*Register*/
    //Register success callback
    var RegisterSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        console.log(data, status, headers, config);
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        $scope.warning_alert='';
                        $scope.account = '';
                        $scope.birthday = '';
                        $scope.name = '';
                        $scope.language = '';
                        if(data.resp.data!=null){
                            DataPost.Set_user_data(data.resp.data);
                            $location.path('/home');
                        }
                        $location.path('/home');
                    }
                }else if(data.resp.error==1){
                    if(data.resp.msg=="missing parameter"){
                        $scope.warning_alert = '註冊失敗';  
                    }else if(data.resp.msg=="account duplicated"){
                        $scope.warning_alert = '帳戶重複';  
                    }
                }
            }
        }
    };
    //Register error callback
    var RegisterErrorCallback = function(data, status) { 
         console.log(data, status);
        $scope.warning_alert = '註冊失敗';
    };
   
    $scope.Register = function(){
        $scope.warning_alert = '';
        var i;
        if($scope.account.length>13){
            $scope.warning_alert = '不能輸入超過13個字';  
        }else if($scope.account[0]=='+' || $scope.account[0].search(phoneRule)!=-1){
            for(i=1; i<$scope.account.length; i++){
                if(i<$scope.account.length-1){
                    if($scope.account[i].search(phoneRule)==-1){
                        $scope.warning_alert = '只能輸入數字';  
                        break;
                    }
                }else{
                    if($scope.name!='' && $scope.birthday!='' && $scope.language!=''){
                       data = {'account': $scope.account,
                            'birthday': $scope.birthday,
                            'name': $scope.name,
                            'language': $scope.language
                           }; 
                        DataPost.User_register(data, RegisterSuccessCallback, RegisterErrorCallback); 
                    }
                }
            }   
        }else{
            $scope.warning_alert = '只能輸入數字';  
        }
    };
    /*Login*/
    //Login success callback
    var LoginSuccessCallback = function(data, status, headers, config) {
        $scope.warning_alert = '';
        if(data.resp==null){
        }else{
            if(data.resp.error==null){
            }else{
                if(data.resp.error==0){
                    if(data.resp.msg!=null){
                        $scope.warning_alert='';
                        if(data.resp.data!=null){
                            DataPost.Set_user_data(data.resp.data);
                            $location.path('/home');
                        }
                    }
                }else if(data.resp.error==1){
                    if(data.resp.msg=="missing parameter"){
                        $scope.warning_alert = '登入失敗';  
                    }else if(data.resp.msg=="login error"){
                        $scope.warning_alert = '帳戶錯誤';  
                    }
                }
            }
        }
    };
    //Login error callback
    var LoginErrorCallback = function(data, status) { 
        console.log(data, status);
        $scope.warning_alert = '登入失敗';
    };
    $scope.Login = function(){
        $scope.warning_alert = '';
        var i;
        if($scope.account.length>13){
            $scope.warning_alert = '不能輸入超過13個字';  
        }else if($scope.account[0]=='+' || $scope.account[0].search(phoneRule)!=-1){
            for(i=1; i<$scope.account.length; i++){
                if(i<$scope.account.length-1){
                    if($scope.account[i].search(phoneRule)==-1){
                        $scope.warning_alert = '只能輸入數字';  
                        break;
                    }
                }else{
                    data = {'account': $scope.account};
                    DataPost.User_login(data, LoginSuccessCallback, LoginErrorCallback); 
                }
            }   
        }else{
            $scope.warning_alert = '只能輸入數字';  
        }
    };
   
});
