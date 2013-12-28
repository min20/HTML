// 2013.12.26

/* MUST OPERATE WITH
 ** underscore.js
 */

/*
 * Current Function List
 **
 ** shiftPanel()
 **** setPanelShifter()
 **** changePBStatus()
 **
 ** getPanelData()
 **** fillPanelContents()
 */	

function initPage() {
	getPanelContents();
	eventHandler();
}

function getPanelContents() {
	var eleHead = document.getElementsByTagName('head')[0];
	var eleScript = document.createElement('script');

	var sDate = String( (new Date()).getTime() );
	var sGetPressData = "getPressData" + sDate;
	var serverURL = "./server/getPressData.php?callback=" + sGetPressData;

	eleScript.src = serverURL;

	window[sGetPressData] = function(arrayPressData) {
		this.arrayPanelWrapper = document.getElementsByClassName('panelWrapper');
		this.arrayPressData = arrayPressData;
		this.front = 0;
		arrayShuffle(arrayPressData);
		for(var idx = 0; idx < arrayPanelWrapper.length; idx++) {
			fillPanelContents(arrayPanelWrapper[idx],
					arrayPressData[idx % arrayPressData.length]
			);
			
		}
	};

	eleHead.appendChild(eleScript);
}

function fillPanelContents(elePanelWrapper, pressData) {
	var panelTemplate = _.template(
		"<div class=\"panel\">" +
			"<div class=\"panelContents\">" +
				"<h3>" +
					"<a "+
						"href=\"<%= titleAddr %>\" "+
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

	var result = panelTemplate(pressData);
	elePanelWrapper.insertAdjacentHTML("beforeend", result);
}

function eventHandler() {
	document.addEventListener('click',
		function(event) {
			selectAction(event);
		}, false
	);

	var panels = document.querySelector('#panels');
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

function getNextPanelWrapper(panels) {
	var elePanelWrapper = document.createElement('div');
	elePanelWrapper.className = "panelWrapper";
	if(panels.className === "shiftPanelLeft") {
		elePanelWrapper.id = "pw0";
		panels.removeChild(panels.children[4]);

		for(var idx = 0; idx < 4; idx++) {
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

		for(var idx = 0; idx < 4; idx++) {
			panels.children[idx].id = "pw" + idx;
		}

		front = front + 1;
		fillPanelContents(elePanelWrapper,
			arrayPressData[mod(front + 5, arrayPressData.length)]
		);
		panels.appendChild(elePanelWrapper);
	}
	panels.className = "";
}

function selectAction(event) {
	event.preventDefault();
	var clickEvent = event.target;

	if(clickEvent.parentElement.id === "panelButton") {
		shiftPanels(clickEvent.id);
	}
	else {
		console.log('DO NOTHING');
	}
}

function shiftPanels(buttonId) {
	var panels = document.getElementById('panels');
	var elePanelWrapper = document.createElement('div');
	elePanelWrapper.className = "panelWrapper";
	
	if(buttonId === "toLeft") {
		panels.className = "shiftPanelLeft";
	}
	else {
		panels.className = "shiftPanelRight";
	}

	// 이하 처리는 eventListener로 animationEnd 이벤트를 받아 진행한다
}

function getCSSProperty(element, attributeName) {
	var styleList = window.getComputedStyle(element);
	var property = styleList.getPropertyValue(attributeName);

	return property;
}

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

function mod(target, division) {
	return ( (target % division) + division ) % division;
}

window.onload = initPage;
