<? header("Content-type:text/css; charset=utf-8"); ?>
<?php	
	$callbackName = $_GET['callback'];
	$data =
'[
		{
			"title" : "지디넷코리아",   
			"titleImg" : "./img/pressTitle/nsd11491303.gif",
			"titleAddr" : "http://www.zdnet.co.kr/",
			"htmlAddr" : "http://newsstand.naver.com/include/page/092.html",
			"thumbnail" : "./img/pressThumbnail/nsd18341092.gif"
		},

		{
			"title" : "디지털데일리",
			"titleImg" : "./img/pressTitle/nsd114654225.gif",
			"titleAddr" : "http://www.ddaily.co.kr/",
			"htmlAddr" : "http://newsstand.naver.com/include/page/138.html",
			"thumbnail" : "./img/pressThumbnail/nsd8044593.gif",
		},

		{
			"title" : "블로터닷넷",
			"titleImg" : "./img/pressTitle/nsd114723490.gif",
			"titleAddr" : "http://www.bloter.net/",
			"htmlAddr" : "http://newsstand.naver.com/include/page/293.html",
			"thumbnail" : "./img/pressThumbnail/nsd16353971.gif"
		}
]';

	echo $callbackName."(".$data.")";
?>
