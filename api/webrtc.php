<?php
	function stream_start($req, $db) {
		if( isset($req['callee_account'])!=TRUE || $req['callee_account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'stream_start','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//將caller和callee的的status改成2，下次更新視訊中名單時此2人即會被歸類為視訊中
		mysqli_query($db, "update user_status set status = 2 where account like '{$_SESSION['account']}'");
		mysqli_query($db, "update user_status set status = 2 where account like '{$req['callee_account']}'");
		
		echo json_encode(array('resp'=>array('method'=>'stream_start','error'=>0,'data'=>"",'msg'=>"stream start")));
		exit;
	}
	
	function stream_end($req, $db) {
		if( isset($req['callee_account'])!=TRUE || $req['callee_account']=="" ){
			echo json_encode(array('resp'=>array('method'=>'stream_end','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//將caller和callee的的status改成1，下次更新視訊中名單時此2人即會被歸類為在線且非視訊
		mysqli_query($db, "update user_status set status = 1 where account like '{$_SESSION['account']}'");
		mysqli_query($db, "update user_status set status = 1 where account like '{$req['callee_account']}'");
		
		echo json_encode(array('resp'=>array('method'=>'stream_end','error'=>0,'data'=>"",'msg'=>"stream end")));
		exit;
	}
?>