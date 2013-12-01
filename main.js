function initPage() {
	eventHandler();
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
	var flag= new Object();

	flag.panel_direction = 0;

	/*
	 * 2013.11.30 Current Animation List
	 ** shiftPanel()
	 **
	 */
	
	//PBStatus === PanelButton Status
	if(clickEvent.dataset.pbstatus === 'wait') {
		if(clickEvent.id === 'toLeft') {
			flag.panel_direction = 1;
		}
		else if(clickEvent.id === 'toRight') {
			flag.panel_direction = -1;
		}
		else {
			console.log('DO NOTHING');
			return;
		}

		// event 안 막아도 잘 되길래... 주석처리 합니다.
		// 짜는데 오래 걸렸는데... ㅠㅠ
		//changePBStatus();
	}
	else {
		console.log('DO NOTHING');
		return;
	}

	setPanelShifter(flag);
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
		console.log(PBList[idx]);
	}
}

function setPanelShifter(flag) {
	var interval = new Object();
	var panels = document.querySelector('#panels');
	var mList = new Array(
		0, 1, 2, 4, 8, 16, 32, 64, 128, 130,
		150, 142, 93, 88, 54, 34, 21, 13, 8, 5,
		3, 2, 1, 1, 0
		);

	interval.setFn = null;
	interval.count = 0;

	// Must add MOUSE EVENT STOPPER
	// setInterval has own time circuit.
	interval.setFn = setInterval(function() {
		( shiftPanel ) (flag, interval, panels, mList);	
	}, 30);

}

function shiftPanel(flag, interval, panels, mList) {
	if(interval.count >= 25) {
		flag.panel_direction = 0;
		interval.count = 0;
		//changePBStatus();
		clearInterval(interval.setFn);
	}

	var marginLeft = getCSSProperty(panels, 'margin-left');

	panels.style.marginLeft = parseInt(marginLeft)
			+ flag.panel_direction * mList[interval.count] + "px";

	//console.log(interval.count);
	interval.count++;
}

function getCSSProperty(element, attributeName) {
	var styleList = window.getComputedStyle(element);
	var property = styleList.getPropertyValue(attributeName);

	return property;
}

window.onload = initPage;
