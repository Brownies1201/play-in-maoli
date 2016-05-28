<?php
	function checkSession(){
		if ( isset($_SESSION['account'])!=TRUE ){
			echo json_encode(array('resp'=>array('method'=>'checkSession','error'=>1,'data'=>"",'msg'=>"need login")));
			exit(0);
		}
	}
	
	function user_register($req, $db){
		//檢查前端的參數有否正確傳過來
		if( isset($req['account'])!=TRUE || $req['account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_register','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		if( isset($req['birthday'])!=TRUE || $req['birthday']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_register','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		if( isset($req['name'])!=TRUE || $req['name']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_register','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		if( isset($req['language'])!=TRUE || $req['language']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_register','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		
		//檢查帳號是否有重複，有重覆則傳送account duplicated到前端
		$account_list = mysqli_query($db, "select account from user");
		while($account_list_row = mysqli_fetch_array($account_list)) {
			if($req['account'] == $account_list_row['account']) {
				echo json_encode(array('resp'=>array('method'=>'user_register','error'=>1,'data'=>"",'msg'=>"account duplicated")));
				exit;
			}
		}
		
		//將使用者所填之資料寫入db
		mysqli_query($db, "insert into user(account, birthday, name, language) values ('{$req['account']}', '{$req['birthday']}', '{$req['name']}', '{$req['language']}')");
		//將上線狀態更新到db，由於剛註冊從沒上過線，status設為0代表離線
		mysqli_query($db, "insert into user_status(account, status) values ('{$req['account']}', '0')");
		
		//回傳註冊成功的register successfully到前端
		echo json_encode(array('resp'=>array('method'=>'user_register','error'=>0,'data'=>"",'msg'=>"register successfully")));
	}
	
	function user_login($req, $db, $online_list) {
		//檢查前端的參數有否正確傳過來
		if( isset($req['account'])!=TRUE || $req['account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_login','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		if( isset($req['peerid'])!=TRUE || $req['peerid']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_login','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		
		//檢查帳號是否正確，不正確則傳送login error回到前端，若正確則將資訊存入session並回傳login successfully到前端，並更新使用者最新狀態到db
		$user_data = mysqli_query($db, "select name, language from user where account like '{$req['account']}'");
		$user_data_row = mysqli_fetch_array($user_data);
		if(isset($user_data_row) != TRUE || $user_data_row == "") {
			echo json_encode(array('resp'=>array('method'=>'user_login','error'=>1,'data'=>"",'msg'=>"login error")));
			exit;
		}
		else if(isset($user_data_row) == TRUE && $user_data_row != "") {
			//把登入資訊存入session
			$_SESSION['account'] = $req['account'];
			$_SESSION['name'] = $user_data_row['name'];
			$_SESSION['language'] = $user_data_row['language'];
			//登入後，並把狀態設成1(在線且非視訊中)
			mysqli_query($db, "update user_status set status = '1', peerid = '{$req['peerid']}' where account like '{$req['account']}'");
			
			echo json_encode(array('resp'=>array('method'=>'user_login','error'=>0,'data'=>"",'msg'=>"login successfully")));
			exit;
		}
	}
	
	function user_logout($req, $db) {
		//登出後，將status設為0(離線)
		mysqli_query($db, "update user_status set status = '0' where account like '{$_SESSION['account']}'");
		//釋放session
		session_unset();
		session_destroy();
		
		echo json_encode(array('resp'=>array('method'=>'user_logout','error'=>0,'data'=>"",'msg'=>"logout successfully")));
		exit;
	}
	
	function user_forget_acc($req, $db) {
		//檢查前端的參數有否正確傳過來
		if( isset($req['name'])!=TRUE || $req['name']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_forget_acc','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		if( isset($req['birthday'])!=TRUE || $req['birthday']=="" ){
			echo json_encode(array('resp'=>array('method'=>'user_forget_acc','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		
		//檢查姓名與生日是否符合，符合則回傳帳號，否則回傳name or birthday error
		$user_data = mysqli_query($db, "select account from user where name = '{$req['name']}' and birthday = '{$req['birthday']}'");
		$user_data_row = mysqli_fetch_array($user_data);
		if(isset($user_data_row) != TRUE || $user_data_row == "") {
			echo json_encode(array('resp'=>array('method'=>'user_forget_acc','error'=>1,'data'=>"",'msg'=>"name or birthday error")));
			exit;
		}
		else if(isset($user_data_row) == TRUE && $user_data_row != "") {
			$res['account'] = $user_data_row['account'];
			echo json_encode(array('resp'=>array('method'=>'user_forget_acc','error'=>0,'data'=>$res,'msg'=>"")));
			exit;
		}
	}
	//此方法由客戶端定時呼叫來更新在線名單
	function online_list_update($req, $db) {
		$online_list = array();
		//從db中尋找status=1的視為上線
		$all_user_list = mysqli_query($db, "select account, peerid from user_status where status = '1'");
		while($user_list_row = mysqli_fetch_array($all_user_list)) {
			//找出使用者name
			$user_name = mysqli_query($db, "select name from user where account = '{$user_list_row['account']}'");
			$user_name_row = mysqli_fetch_array($user_name);
			//將account和peerid存入在線名單
			$user_temp['account'] = $user_list_row['account'];
			$user_temp['name'] = $user_name_row['name'];
			$user_temp['peerid'] = $user_list_row['peerid'];
			array_push($online_list, $user_temp);
		}
		echo json_encode(array('resp'=>array('method'=>'online_list_update','error'=>0,'data'=>$online_list,'msg'=>"")));
		exit;
	}
	//此方法同上，差異為此方法更新的是視訊中的名單
	function streaming_list_update($req, $db) {
		$streaming_list = array();
		//從db中尋找status=2的為視訊中
		$all_user_list = mysqli_query($db, "select account, peerid from user_status where status = '2'");
		while($user_list_row = mysqli_fetch_array($all_user_list)) {
			//找出使用者name
			$user_name = mysqli_query($db, "select name from user where account = '{$user_list_row['account']}'");
			$user_name_row = mysqli_fetch_array($user_name);
			//將account和peerid存入視訊中名單
			$user_temp['account'] = $user_list_row['account'];
			$user_temp['name'] = $user_name_row['name'];
			$user_temp['peerid'] = $user_list_row['peerid'];
			array_push($streaming_list, $user_temp);
		}
		echo json_encode(array('resp'=>array('method'=>'streaming_list_update','error'=>0,'data'=>$streaming_list,'msg'=>"")));
		exit;
	}
?>