<?php
	function buddy_list($req, $db) {
		//根據session中的account，先到buddy找出該使用者所有好友
		$buddylist = mysqli_query($db, "select account, peerid, status from user_status where account in (select buddy_account from buddy where account = '{$_SESSION['account']}')");
		$buddylist_array = array();
		$buddylist_array['offline'] = array();
		$buddylist_array['online'] = array();
		$buddylist_array['streaming'] = array();
		while($buddylist_row = mysqli_fetch_array($buddylist)) {
			//根據找出來在線上的好友帳號，從user找出帳號主人的名字
			$buddy_name_result = mysqli_query($db, "select name from user where account = '{$buddylist_row['account']}'");
			$buddy_name_row = mysqli_fetch_array($buddy_name_result);
			
			$buddy_temp['account'] = $buddylist_row['account'];
			$buddy_temp['name'] = $buddy_name_row['name'];
			$buddy_temp['peerid'] = $buddylist_row['peerid'];
			
			//分別把在線/離線/視訊中的好友存入不同陣列
			switch ($buddylist_row['status']) {
				case 0:
					array_push($buddylist_array['offline'], $buddy_temp);
					break;
				case 1:
					array_push($buddylist_array['online'], $buddy_temp);
					break;
				case 2:
					array_push($buddylist_array['streaming'], $buddy_temp);
					break;
			}
		}
		echo json_encode(array('resp'=>array('method'=>'buddy_list','error'=>0,'data'=>$buddylist_array,'msg'=>"")));
		exit;
	}
	
	function buddy_add($req, $db) {
		if( isset($req['buddy_account'])!=TRUE || $req['buddy_account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'buddy_add','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//將傳過來的對方帳號加入自己的好友
		mysqli_query($db, "insert into buddy (account, buddy_account) values ('{$_SESSION['account']}', '{$req['buddy_account']}')");
		//也將自己加入對方好友
		mysqli_query($db, "insert into buddy (account, buddy_account) values ('{$req['buddy_account']}', '{$_SESSION['account']}')");
		
		echo json_encode(array('resp'=>array('method'=>'buddy_add','error'=>0,'data'=>"",'msg'=>"buddy add successfully")));
		exit;
	}
	
	function buddy_remove($req, $db) {
		if( isset($req['buddy_account'])!=TRUE || $req['buddy_account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'buddy_remove','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//將對方從自己好友中刪除
		mysqli_query($db, "delete from buddy where account = '{$_SESSION['account']}' and buddy_account = '{$req['buddy_account']}'");
		//也將自己從對方好友刪除
		mysqli_query($db, "delete from buddy where account = '{$req['buddy_account']}' and buddy_account = '{$_SESSION['account']}'");
		
		echo json_encode(array('resp'=>array('method'=>'buddy_remove','error'=>0,'data'=>"",'msg'=>"buddy remove successfully")));
		exit;
	}
?>