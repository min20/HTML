// 2013.12.28
/* MUST OPERATE WITH

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

	window.front = -2;
	window.numPanel = 5;
	window[sGetPressData] = function(arrayPressData) {
		window.arrayPressData = arrayPressData;
		arrayShuffle(window.arrayPressData);

		var panels = document.querySelector('#panels');
		for(var idx = 0; idx < numPanel; idx++) {
			var elePanelWrapper = document.createElement('div');
			elePanelWrapper.className = "panelWrapper";
			elePanelWrapper.id = "pw" + idx;

			panels.appendChild(elePanelWrapper);
		}

		var arrayPanelWrapper =	panels.children;
		for(var idx = 0; idx < numPanel; idx++) {
			fillPanelContents(arrayPanelWrapper[idx % numPanel],
					arrayPressData[mod(idx - 2, arrayPressData.length)]
			);
		}

		var thumbnails = document.querySelector('#thumbnails');
		for(var idx = 0; idx < arrayPressData.length; idx++) {
			var thumb = document.createElement('div');
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

	var result = panelTemplate(pressData);
	elePanelWrapper.insertAdjacentHTML("beforeend", result);
}

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

function eventHandler() {
	var panelButton = document.querySelector('#panelButton')
	var panels = document.querySelector('#panels');
	panelButton.addEventListener('click',
		function(event) {
			selectAction(event, panels);
		}, false
	);

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
	var thumbnails = document.querySelector('#thumbnails');
	var elePanelWrapper = document.createElement('div');
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
			arrayPressData[mod(front, arrayPressData.length)]
		);
		panels.appendChild(elePanelWrapper);
		front = front + 1;
	}
	panels.className = "";

	thumbnails.querySelector(".selected").className = "";
	thumbnails.children[mod(front + 2, thumbnails.children.length)].
			className = "selected";
}

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

function shiftPanels(buttonId, panels) {
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
