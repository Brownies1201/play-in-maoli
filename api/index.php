<?php
	session_start();
	// api/index.php is route
	header('Content-Type: application/json; charset=utf-8');
	$content_type_args = explode(';', $_SERVER['CONTENT_TYPE']);
	if ($content_type_args[0] == 'application/json')
		$_POST = json_decode(file_get_contents('php://input'),true);
	
	// require file
	require_once('config.php');
	require_once('user.php');
	require_once('webrtc.php');
	require_once('buddy.php');
	require_once('gallery.php');
	
	date_default_timezone_set('asia/taipei');
	ignore_user_abort(true); //忽略連線中斷
	set_time_limit(0); //設定執行時間不限

	$db = mysqli_connect($_DB['host'], $_DB['username'], $_DB['password'], $_DB['dbname']);
	mysqli_set_charset($db, "utf8");
	
	switch($_GET['method']){
		case 'user_register':
			user_register($_POST,$db);
			exit(0);
		case 'user_login':
			user_login($_POST,$db);
			exit(0);
		case 'user_logout':
			user_logout($_POST, $db);
			exit(0);
		case 'user_forget_acc':
			user_forget_acc($_POST,$db);
			exit(0);
		case 'online_list_update':
			online_list_update($_POST, $db);
			exit(0);
		case 'streaming_list_update':
			streaming_list_update($_POST, $db);
			exit(0);
		case 'stream_start':
			stream_start($_POST,$db);
			exit(0);
		case 'stream_end':
			stream_end($_POST,$db);
			exit(0);
		case 'buddy_list':
			buddy_list($_POST,$db);
			exit(0);
		case 'buddy_add':
			buddy_add($_POST,$db);
			exit(0);
		case 'buddy_remove':
			buddy_remove($_POST,$db);
			exit(0);
		case 'photo_upload':
			photo_upload($_POST,$db);
			exit(0);
		case 'photo_remove':
			photo_remove($_POST,$db);
			exit(0);
		case 'photo_list':
			photo_list($_POST,$db);
			exit(0);
		default:
			echo json_encode(array('resp'=>array('method'=>'unknown','error'=>1,'data'=>"",'msg'=>"unknown method")));
			exit(0);
	}
?> 