interval = null;
intervalCount = 0;
im = 0; // movementCount
directionFlag = 0;

function initPage() {
	eventHandler();
}

function eventHandler() {
	document.addEventListener('click',
		function(event){
			selectAction(event);
		}, false);
}

function selectAction(event) {
	event.preventDefault();

	var direction = event.target.parentElement.id;

	if(direction === 'to_left') {
		directionFlag = -1;
	}
	else if(direction === 'to_right') {
		directionFlag = 1;
	}
	else {
		console.log('DO NOTHING');
		return;
	}

	shiftPanel();
}

function shiftPanel() {
	interval = setInterval(_panelAction, 25);
}

function _panelAction() {
	if(im > 20) {
		im = 0;
		clearInterval(interval);
	}
	var panelList = document.querySelectorAll('.panel');
	var mList = new Array(0, 1, 2, 4, 8, 16, 32, 64, 128,
		140, 210, 140, 128, 64, 32, 16, 8, 4, 2, 1);

	for(var idx_panel = 0; idx_panel < panelList.length; idx_panel++) {
		var	panel = panelList[idx_panel];
		var marginLeft = getCSSProperty(panel, 'margin-left');

		panel.style.marginLeft = parseInt(marginLeft)
			 + directionFlag * mList[im] + "px";

	}

	im++;
}

/* NOT USED(Old methods)

function shiftPanel() {
	interval = setInterval(_panelAction, 30);
}

function _panelAction() {
	var panelList = document.querySelectorAll('.panel');
	for(var idx_panel = 0; idx_panel < panelList.length; idx_panel++) {
		var	panel = panelList[idx_panel];
		var marginLeft = getCSSProperty(panel, 'margin-left');
		panel.style.marginLeft = parseInt(marginLeft)
			 + directionFlag * 100 + "px";
	}

	intervalCount++;
	if(intervalCount >= 10) {
		intervalCount = 0;
		clearInterval(interval);
	}
}

*/

function getCSSProperty(element, attributeName) {
	var styleList = window.getComputedStyle(element);
	var property = styleList.getPropertyValue(attributeName);

	return property;
}

window.onload = initPage;
