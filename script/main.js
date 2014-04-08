// 2014.04.08

/**
  intPage()
  window.onload시 실행되도록 되어있다.
  즉 페이지 로딩과 함께 실행되는 함수이다.
 */
function initPage() {
	getPanelContents();
	eventHandler();
}

/**
  getPanelContents()
  뉴스스탠드는 각 언론사마다 panel이 1개 할당되어 있다.
  이 함수는 다음 순서로 일을 진행한다.
     1. panel을 5개 생성
	 2. 각 신문사를 panel에 랜덤으로 할당
	 3. 각 신문사의 기사를 할당된 panel에 넣어준다.
 */
function getPanelContents() {
	// main.html에서 head를 가져와 eleHead로 저장한다
	var eleHead = document.getElementsByTagName('head')[0];
	// <script>를 생성한다.
	var eleScript = document.createElement('script');
	// main.html에서 id가 'panelButton'인 놈을 가져온다.
	var panelButton = document.querySelector('#panelButton');

	// 언론사 정보를 가져오기 위한 영역이다.
	// (교수님 방식. 시간이 지나도 매 번 새로운 함수를 받아올 수 있다)
	var sDate = String( (new Date()).getTime() );
	//   1. 현재 시간으로 string을 만든다.
	var sGetPressData = "getPressData" + sDate;
	//   2. 해당 이름으로 callback함수를 생성한다.
	//    (php파일에 구현되어 있음)
	//    (해당 callback함수는 언론사 정보를 Array형태로 보내준다)
	var serverURL = "./server/getPressData.php?callback=" + sGetPressData;

	//   3. 2에서 만든 함수를 <script>에 external include한다.
	eleScript.src = serverURL;

	//   4. 받아온 데이터 어떻게 써먹을지 구현한 부분. 
	window[sGetPressData] = function(arrayPressData) {
		// 받아온 데이터는 전역변수로 선언한다.
		window.arrayPressData = arrayPressData;
		// main.html에서 id가 'panels'인 놈을 가져온다.
		var panels = document.querySelector('#panels');

		// 언론사 정보가 1개일 때와 아닐 때로 구분해서 처리한다.
		// (1개일 때는 panel을 1개, 그보다 많으면 5개 생성)
		if(arrayPressData.length == 1) {
			window.front = 0;
			window.numPanel = 1;

			var elePanelWrapper = document.createElement('div');
			elePanelWrapper.className = "panelWrapper";
			elePanelWrapper.id = "pw" + idx;

			panels.appendChild(elePanelWrapper);
		}
		else if (arrayPressData.length == 0) {
			// ERROR
		}
		else {
			// front indicates panelWrapper id == pw0
			window.front = -2;
			window.numPanel = 5;
			arrayShuffle(window.arrayPressData);

			for(var idx = 0; idx < numPanel; idx++) {
				var elePanelWrapper = document.createElement('div');
				elePanelWrapper.className = "panelWrapper";
				elePanelWrapper.id = "pw" + idx;

				panels.appendChild(elePanelWrapper);
			}
		}

		// panels의 자식들을 arrayPanelWrapper에 저장.
		var arrayPanelWrapper =	panels.children;
		for(var idx = 0; idx < numPanel; idx++) {
			// panelContents를 채워주는 fillPanelContents() 함수를 실행한다.
			// 인자는 panelWrapper와 pressData이다.
			// 저장된 언론사 정보를 가져와 HTML 코드를 생성, 채워넣는다.
			fillPanelContents(arrayPanelWrapper[idx % numPanel],
					arrayPressData[mod(idx - 2, arrayPressData.length)]
			);
		}

		// panelButton을 생성하는 fillPanelButton() 함수를 실핸하다.
		fillPanelButton(panelButton);

		// 언론사 thumbnail 부분을 생성하는 부분이다.
		// 현재 보고있는 언론사를 강조해주는 border가 있는데,
		//    지금 안 돌아감. 나중에 손 봐야 함.
		var thumbnails = document.querySelector('#thumbnails');
		for(var idx = 0; idx < arrayPressData.length; idx++) {
			var thumb = document.createElement('div');
			// pressThumbnail을 생성하는 fillPressThumbnail() 을 실행한다.
			fillPressThumbnail(thumb,
					arrayPressData[idx % arrayPressData.length]
			);
			if(idx === 0) {
				thumb.className = "selected";
			}
			thumbnails.appendChild(thumb);
		}
	};

	eleHead.appendChild(eleScript);
}

/*
  fillPanelContents(elePanelWrapper, pressData)
  panelWrapper 코드와 pressData를 받아와서 HTML코드를 생성하고 추가한다.
  underscore.js의 template를 사용하였다.
  매우 편한게 HTML코드를 추가할 수 있다.
 */
function fillPanelContents(elePanelWrapper, pressData) {
	var panelTemplate = _.template(
			"<div class=\"panel\">" +
				"<div class=\"panelContents\">" +
					"<h3>" +
						"<a " +
							"href=\"<%= titleAddr %>\" " +
							"target=\"_blank\"> " +
								"<img src=\"<%= titleImg %>\"" +
								"width=\"260\" height=\"55\" " +
							"alt=\"<%= title %>\">" +
						"</a>" +
					"</h3>" +
					"<iframe " +
						"src=\"<%= htmlAddr %>\" " +
						"width=\"840\" " +
						"height=\"380\" " +
						"frameborder=\"0\" " +
						"scrolling=\"no\" " +
						"class=\"ifr_arc\" " +
						"allowtransparency=\"true\" " +
						"title=\"<%= title %> 주요뉴스\"> " +
					"</iframe>" +
				"</div>" +
			"</div>"
	);

	// panelTemplate라는 함수가 pressData를 잘 파싱하여
	// 적절한 부분에 채워넣는다.
	// return은 완성된 HTML코드이다. 이를 result에 저장한다.
	var result = panelTemplate(pressData);
	// beforeend는 "생성된 HTML코드를 마지막 더할게요"하는 옵션이다.
	elePanelWrapper.insertAdjacentHTML("beforeend", result);
}

/*
  fillPressThumbnail(elePressThumbnail, pressData)
  temlpate를 사용한 함수는 fillPanelContents 함수를 참고.
  나머지 template는설명하지 않겠다.
 */
function fillPressThumbnail(elePressThumbnail, pressData) {
	var thumbnailTemplate = _.template(
			"<a " +
				"href=\"<%= titleAddr %>\" "+
				"target=\"_blank\">" +
					"<img src=\"<%= thumbnail  %>\" />" +
			"</a>"
	);

	var result = thumbnailTemplate(pressData);
	elePressThumbnail.insertAdjacentHTML("beforeend", result);
}

/*
  fillPanelButton(panelButton)
  temlpate를 사용한 함수는 fillPanelContents 함수를 참고.
  나머지 template는설명하지 않겠다.
 */
function fillPanelButton(panelButton) {
	var buttons = 
			"<a id=\"toLeft\" href=\"#\">" +
				"<p>왼쪽 신문</p>" +
			"</a>" +
			"<a id=\"toRight\" href=\"#\">" +
				"<p>오른쪽 신문</p>" +
			"</a>";
	if(arrayPressData.length != 1) {
		panelButton.insertAdjacentHTML("beforeend", buttons);
	}
	else {
		return;
	}
}

/*
  eventHandler()
  event listener를 추가하는 함수이다.
  NEWS STAND에서는 다음 2가지의 event를 처리한다.
  (chrome과 safari의 문법이 달라 addEventListener는 3개이다)
    1. panelButton의 click 이벤트
	2. CSS3의 animation 종료 이벤트.
 */
function eventHandler() {
	var panelButton = document.querySelector('#panelButton')
	var panels = document.querySelector('#panels');

	// paenlButton의 click 이벤트는 selectAction() 함수로 넘긴다.
	panelButton.addEventListener('click',
		function(event) {
			selectAction(event, panels);
		}, false
	);

	// CSS3 animation 종료 이벤트는 getNextPanelWrapper() 함수로 넘긴다.
	panels.addEventListener('animationend',
		function(event) {
			getNextPanelWrapper(panels);
		}, false
	);
	panels.addEventListener('webkitAnimationEnd',
		function(event) {
			getNextPanelWrapper(panels);
		}, false
	);
}

/*
  getNextPanelWrapper(panels)
  이 함수는 CSS3 animation 이벤트가 종료된 후에 시행된다.
  다음 기능을 수행한다.
    1. 화면이 이동함에 따라 새로운 panel을 생성한다.
	2. 화면이 이동함에 따라 가려지는 panel을 삭제한다.
 */
function getNextPanelWrapper(panels) {
	var thumbnails = document.querySelector('#thumbnails');
	var elePanelWrapper = document.createElement('div');
	thumbnails.querySelector(".selected").className = "";
	thumbnails.children[mod(front + 2, thumbnails.children.length)].
			className = "selected";
	elePanelWrapper.className = "panelWrapper";

	if(panels.className === "shiftPanelLeft") {
		elePanelWrapper.id = "pw0";
		panels.removeChild(panels.children[4]);

		for(var idx = 0; idx < numPanel - 1; idx++) {
			panels.children[idx].id = "pw" + (idx + 1);
		}

		front = front - 1;
		fillPanelContents(elePanelWrapper,
			arrayPressData[mod(front, arrayPressData.length)]
		);
		panels.insertBefore(elePanelWrapper, panels.children[0]);
	}
	else {
		elePanelWrapper.id = "pw4";
		panels.removeChild(panels.children[0]);

		for(var idx = 0; idx < numPanel - 1; idx++) {
			panels.children[idx].id = "pw" + idx;
		}

		fillPanelContents(elePanelWrapper,
			arrayPressData[mod(front + 5, arrayPressData.length)]
		);
		panels.appendChild(elePanelWrapper);
		front = front + 1;
	}
	panels.className = "";
}

/*
  selectAction(event, panels)
  왼쪽 버튼 클릭인지 오른쪽 버튼 클릭인지 판단하여 shiftPanels()를 실행한다.
 */
function selectAction(event, panels) {
	event.preventDefault();
	var clickEvent = event.target;

	if(clickEvent.id === "toLeft" || clickEvent.id === "toRight") {
		shiftPanels(clickEvent.id, panels);
	}
	else {
		console.log('DO NOTHING');
		return;
	}
}

/*
  shiftPanels(buttonId, panels)
  className를 바꾸는 게 주 업무임.
  특정 className, 여기에서는 shiftPanelLeft로 바뀌는 순간,
    CSS3 aniamtion이 실행된다.
 */
function shiftPanels(buttonId, panels) {
	if(buttonId === "toLeft") {
		panels.className = "shiftPanelLeft";
	}
	else {
		panels.className = "shiftPanelRight";
	}

	// panel 생성, 삭제 등의 잡다한 로직은
	//   eventListener로 animationEnd 이벤트를 받아 진행한다
}

// 유틸리티
/*
  getCSSProperty(element, attributeName)
  element와 css attributeName (속성 이름)을 받아서,
  해당 property (속성값)을 return한다.
 */
function getCSSProperty(element, attributeName) {
	var styleList = window.getComputedStyle(element);
	var property = styleList.getPropertyValue(attributeName);

	return property;
}

/*
  arrayShuffle(array)
  array를 임의의 순서로 섞는 함수이다.
  언론사 정보가 담긴 array를 임의순서로 섞을 때 사용한다. 
 */
function arrayShuffle(array) {
	var randomIdx;
	var temp;
	for(idx = 0; idx < array.length; idx++) {
		randomIdx = idx + Math.floor(Math.random() * (array.length - idx));
		temp = array[idx];
		array[idx] = array[randomIdx];
		array[randomIdx] = temp;
	}
}

/*
  mod(target, division)
  음수에 대한 modular 연산이 서비스에 적합하지 않아서 새로 만들었다.
  (음수 % 양수)의 결과값이 항상 음수가 나옴.
 */
function mod(target, division) {
	return ( (target % division) + division ) % division;
}

// 페이지 로드 시 initPage를 실행한다.
window.onload = initPage;
