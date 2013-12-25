function initPage() {
	changeTitle();
}

// 2013.12.09 수업시간에 작성
function changeTitle() {
	var url = "../json/pressData.json";
	var obj = new Object();
	obj.newTitle = null;
	obj.mainTitle = document.querySelector("#header h1");
	var header = document.querySelector("#header");
	var request = new XMLHttpRequest();


	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function() {
		( hehe ) ( request, obj );
	}

	obj.mainTitle.style.color = "#77BB77";

	header.style.backgroundColor = "#444444";
}

function hehe(request, obj) {
	if(request.readyState == 4 && request.status == 200) {
		obj.newTitle = JSON.parse(request.responseText);
		alert("mainTitle이 NewsStand에서" + obj.newTitle.title + "로 바뀔꺼예요\n"
				+ "더불어 header의 배경색이 약간 변해요"
		);
		obj.mainTitle.innerHTML = obj.newTitle.title;
	}
}
