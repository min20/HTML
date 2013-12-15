function initPage() {
	shufflePanel();
	eventHandler();
}

function shufflePanel() {
	var url = "pressData.json";

	var left = document.querySelector("#left");
	var center = document.querySelector("#center");
	var right = document.querySelector("#right");
}

function eventHandler() {
	document.addEventListener('click',
		function(event){
			selectAction(event);
		}, false
	);
}

function selectAction(event) {
	event.preventDefault();

	var clickEvent = event.target;
	var shifterSet = new Object();

	shifterSet.panelDirection = 0;

	/*
	 * 2013.11.30 Current Animation List
	 ** shiftPanel()
	 **
	 */
	
	//PBStatus means PanelButton Status
	if(clickEvent.dataset.pbstatus === 'wait') {
		if(clickEvent.id === 'toLeft') {
			shifterSet.panelDirection = 1;
		}
		else if(clickEvent.id === 'toRight') {
			shifterSet.panelDirection = -1;
		}
		else {
			console.log('DO NOTHING');
			return;
		}

		// 기존 html 구조에서는 버그가 좀 있어서 리팩토링 했습니다.
		// 그 후 event를 막지 않아도 잘 되더군요..... 이에 주석처리 합니다.
		// 주석 해제시 rolling 중 버튼 클릭 이벤트를 막습니다.
		// (shiftPanel()의 종료조건 안에도 있음. 그것도 해제합시다)
		changePBStatus();
	}
	else {
		console.log('DO NOTHING');
		return;
	}

	setPanelShifter(shifterSet);
}

function changePBStatus() {
	var PBList = document.querySelectorAll('#panelButton a');

	// 정상작동 하는 것으로 보아 로직은 제대로 되었는데,
	// 실제 찍어보니까 한 박자 늦은 값이 나온다.
	// console.log에 latency가 있나?

	//console.log(PBList);
	for(var idx = 0; idx < PBList.length; idx++) {
		if(PBList[idx].dataset.pbstatus == 'wait') {
			PBList[idx].dataset.pbstatus = 'operating'
		}
		else {
			PBList[idx].dataset.pbstatus = 'wait';
		}
		//console.log(PBList[idx]);
	}
}

function setPanelShifter(shifterSet) {
	var panels = document.querySelector('#panels');
	var mList = new Array(
			1, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 56, 64, 68, 70, 71,
			70, 68, 64, 58, 50, 40, 32, 26, 21, 17, 14, 12, 10,
			8, 6, 5, 4, 3, 2, 1, 1, 1, 1
		);

	shifterSet.intervalId = null;
	shifterSet.intervalCount = 0;

	// Must add MOUSE EVENT STOPPER
	// setInterval has own time circuit.
	shifterSet.intervalId = setInterval(function() {
		( shiftPanel ) (shifterSet, panels, mList);	
	}, 15);

}

function shiftPanel(shifterSet, panels, mList) {
	if(shifterSet.intervalCount >= mList.length) {
		shifterSet.panelDirection = 0;
		shifterSet.intervalCount = 0;
		changePBStatus();
		clearInterval(shifterSet.intervalId);
	}

	var marginLeft = getCSSProperty(panels, 'margin-left');

	//console.log(panels.style.marginLeft);
	panels.style.marginLeft = parseInt(marginLeft)
			+ shifterSet.panelDirection
			* mList[shifterSet.intervalCount] + "px";

	//console.log(shifterSet.intervalCount);
	shifterSet.intervalCount++;
}

function getCSSProperty(element, attributeName) {
	var styleList = window.getComputedStyle(element);
	var property = styleList.getPropertyValue(attributeName);

	return property;
}

window.onload = initPage;
