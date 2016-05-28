<?php
	global $_DB;	
	$_DB['host'] = 'localhost';
    $_DB['username'] = 'play_miaoli';
    $_DB['password'] = 'csie1935';
    $_DB['dbname'] = 'play_miaoli';
	
	function url($type) {
		switch($type) {
			case 'photo':
				return '127.0.0.1/~kiner/play_miaoli/upload/';
				break;
		}
	}
?>