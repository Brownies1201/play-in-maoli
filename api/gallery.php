<?php
	function photo_upload($req, $db) {
		//若從前端傳過來的圖片存在
		if(isset($_FILES['photo']) == true && $_FILES['photo'] != "") {
			//以(使用者帳號+當前時間)作md5命名
			$photo_name = md5($_SESSION['account'] . date("Y-m-d H:i:s"));
			//判斷圖檔類別
			switch ($_FILES['photo']['type']) {
				case "image/png":
					$photo_name .= ".png";
					break;
				case "image/jpeg":
					$photo_name .= ".jpg";
					break;
				default:
					echo json_encode(array('resp'=>array('method'=>'photo_upload','error'=>1,'data'=>"",'msg'=>"image type error")));
					exit;	
			}
			//上傳至指定目錄
			move_uploaded_file($_FILES['photo']['tmp_name'], "upload/".$photo_name);
		} else {
			echo json_encode(array('resp'=>array('method'=>'photo_upload','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//type = 1(去背) or 2(合成)
		if( isset($req['type'])!=TRUE || $req['type']=="" ){
			echo json_encode(array('resp'=>array('method'=>'photo_upload','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		//把使用者帳號，圖片名稱，圖片種類存入db
		mysqli_query($db, "insert into gallery (account, photo, type) values ('{$_SESSION['account']}', '$photo_name', '{$req['type']}')");
		
		echo json_encode(array('resp'=>array('method'=>'photo_upload','error'=>0,'data'=>"",'msg'=>"photo upload successfully")));
		exit;
	}
	
	function photo_remove($req, $db) {
		if( isset($req['sid'])!=TRUE || $req['sid']=="" ){
			echo json_encode(array('resp'=>array('method'=>'photo_remove','error'=>1,'data'=>"",'msg'=>"missing parameter")));
			exit;
		}
		
		mysqli_query($db, "delete from gallery where sid = '{$req['sid']}'");
		
		echo json_encode(array('resp'=>array('method'=>'photo_remove','error'=>0,'data'=>"",'msg'=>"photo remove successfully")));
		exit;
	}
	
	function photo_list($req, $db) {
		$all_photo = mysqli_query($db, "select sid, photo, type from gallery where account = '{$_SESSION['account']}'");
		$photo_array = array();
		$photo_array['people'] = array();
		$photo_array['background'] = array();
		
		while($all_photo_row = mysqli_fetch_array($all_photo)) {
			$photo_temp['sid'] = $all_photo_row['sid'];
			$photo_temp['photo'] = url('photo') . $all_photo_row['photo'];
			//把去背/合成圖存入不同陣列
			if($all_photo_row['type'] == 1) {
				array_push($photo_array['people'], $photo_temp);
			} else if($all_photo_row['type'] == 2) {
				array_push($photo_array['background'], $photo_temp);
			}
		}
		
		echo json_encode(array('resp'=>array('method'=>'photo_list','error'=>0,'data'=>$photo_array,'msg'=>"")));
		exit;
	}
?>