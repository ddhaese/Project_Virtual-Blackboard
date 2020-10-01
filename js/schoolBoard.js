let canvas = null;
let board = null;
let paths = [];
let path = [];
let state = 0;
let drawTool = "chalk";
let curPos = [0, 0];

// Customize here >>>
let drawColors = ["#ffffff", "#f5f591", "#fdaa72", "#f196ea", "#74f37f",
	"#047a0a", "#1fa59a", "#094fe6", "#a902af", "#ee0202", "#000000"];
let boardTypes = ["black", "green", "white"]
let lineWidths = [2, 3, 5, 7];
let drawColor = 0;
let lineWidth = 1;
let boardType = 1;
let eraserSize = [40, 100];
// <<<

function loadBoard() {
	canvas = document.getElementById("board");
	board = canvas.getContext("2d");

	let control = document.getElementById("control");
	let spacer = document.createElement("li");
	let saveButtonSVG = document.createElement("li");
	let saveButtonPNG = document.createElement("li");

	spacer.classList.add("spacer");
	saveButtonSVG.id = "save-button-svg";
	saveButtonPNG.id = "save-button-png";

	canvas.style.backgroundImage = "url('img/greenboard.png')";

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	//board.fillStyle = "white";
	board.lineCap = 'round';

	// Line widths
	for (let i = 0; i < lineWidths.length; i++) {
		const lw = lineWidths[i];
		let newElem = document.createElement("li");
		newElem.id = "line-width-" + i;
		newElem.style =
			"width: " + lw * 3 + "px; height: " + lw * 3 +
			"px; border-radius: " + lw * 1.5 + "px;";
		newElem.classList.add("line-width");

		if (i == lineWidth) {
			newElem.classList.add("selected");
		}

		control.appendChild(newElem);
	}

	control.appendChild(spacer);

	// Colors
	for (let i = 0; i < drawColors.length; i++) {
		const col = drawColors[i];
		let newElem = document.createElement("li");
		newElem.id = "draw-color-" + i;
		newElem.style = "background-color: " + col + ";";
		newElem.classList.add("draw-color");

		if (i == drawColor) {
			newElem.classList.add("selected");
		}

		control.appendChild(newElem);
	}

	control.appendChild(spacer.cloneNode(true));

	// Board types
	for (let i = 0; i < boardTypes.length; i++) {
		const bt = boardTypes[i];
		let newElem = document.createElement("li");
		newElem.id = "board-type-" + i;
		newElem.style = "background: url(img/" + bt + "board.png);";
		newElem.classList.add("board-type");

		if (i == boardType) {
			newElem.classList.add("selected");
		}

		control.appendChild(newElem);
	}

	control.appendChild(spacer.cloneNode(true));
	control.appendChild(saveButtonSVG);
	control.appendChild(saveButtonPNG);

	// Event-listeners
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", onMousemove);

	document.querySelectorAll(".line-width").forEach(b => {
		b.addEventListener("click", setLineWidth);
	});

	document.querySelectorAll(".draw-color").forEach(b => {
		b.addEventListener("click", setDrawColor);
	});

	document.querySelectorAll(".board-type").forEach(b => {
		b.addEventListener("click", setBoardType);
	});

	document.addEventListener("keypress", function (evt) {
		if (evt.keyCode == 32) {
			clearBoard();
		} else if (evt.keyCode == 99){
			toggleColor();
		}
	});

	saveButtonSVG.addEventListener("click", onSaveSVG);
	saveButtonPNG.addEventListener("click", onSavePNG);
}

function onMouseDown(event) {

	state = 1 - event.button;

	if (state === 1) {
		x = event.pageX - canvas.offsetLeft;
		y = event.pageY - canvas.offsetTop;

		path.push([x, y]);
		draw();
	} else if (state === -1) {
		erase();
	}
}

function onResize() {
	if (canvas) {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}
}

function onMouseUp() {
	state = 0;
	paths.push(path);
	path = [];
}

function onMousemove(event) {
	curPos = [
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop];

	if (state === 1) {
		path.push(curPos);
		draw();
	} else if (state === -1) {
		erase()
	}
}

function draw() {
	x2 = path[path.length - 1][0];
	y2 = path[path.length - 1][1];
	x1 = path.length > 1 ? path[path.length - 2][0] : x2;
	y1 = path.length > 1 ? path[path.length - 2][1] : y2;
	dx = x2 - x1;
	dy = y2 - y1;

	board.lineWidth = lineWidths[lineWidth];
	board.strokeStyle = drawColors[drawColor];

	board.beginPath();
	board.moveTo(x1, y1);
	board.lineTo(x2, y2);
	board.stroke();
	board.closePath();

	if (drawTool === "chalk") {
		let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		var length = Math.round(dist / 5 * lineWidths[lineWidth]);

		var xUnit = (dx) / length;
		var yUnit = (dy) / length;

		for (var i = 0; i < length; i++) {
			var xCurrent = x1 + (i * xUnit);
			var yCurrent = y1 + (i * yUnit);
			var xRandom = xCurrent + (Math.random() - 0.5) * 1.2 * lineWidths[lineWidth];
			var yRandom = yCurrent + (Math.random() - 0.5) * 1.2 * lineWidths[lineWidth];

			board.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
		}
	}
}

const erase = () => {
	board.clearRect(curPos[0] - 0.5 * eraserSize[0], curPos[1] - 0.5 * eraserSize[1],
		eraserSize[0], eraserSize[1]);
	return;
}

function setLineWidth(event) {
	id = event.target.id;
	lineWidth = parseInt(id.replace("line-width-", ""));

	document.querySelectorAll(".line-width").forEach(b => {
		b.classList.remove("selected");
	});

	event.target.classList.add("selected");
}

function setDrawColor(event) {
	id = event.target.id;
	drawColor = parseInt(id.replace("draw-color-", ""));

	document.querySelectorAll(".draw-color").forEach(b => {
		b.classList.remove("selected");
	});

	event.target.classList.add("selected");
}

function setBoardType(event) {
	id = event.target.id;
	boardType = parseInt(id.replace("board-type-", ""));

	if (boardType === 2) {
		setDrawTool("marker");
	} else {
		setDrawTool("chalk");
	}

	let background = "url('img/" + boardTypes[boardType] + "board.png')";
	canvas.style.backgroundImage = background;

	document.querySelectorAll(".board-type").forEach(b => {
		b.classList.remove("selected");
	});

	event.target.classList.add("selected");
}

function setDrawTool(tool) {
	drawTool = tool;
	canvas.style.cursor = "url(img/" + tool + ".png), auto";
}

function clearBoard() {
	board.clearRect(0, 0, canvas.width, canvas.height);
	path = [];
	paths = []
}

function onSaveSVG(event) {
	event.stopPropagation();

	const polyLines = paths.map(p => {
		const points = p.map(pnt => {
			return pnt.join(",");
		});
		return `<polyline points="${points.join(" ")}" stroke="${drawColors[drawColor]}" stroke-width="${lineWidths[lineWidth]}" fill-opacity="0"></polyline>`;
	})

	const svgBody = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${polyLines.join("")}</svg> `;
	const blob = new Blob([svgBody]);
	const element = document.createElement("a");

	element.download = `Export_${new Date().toISOString().substring(0, 10)}.svg`;
	element.href = window.URL.createObjectURL(blob);
	element.click();
	element.remove();
	path = [];
	paths = []
}

function onSavePNG(event) {
	event.stopPropagation();

	canvas.toBlob(function (blob) {
		const element = document.createElement("a");

		element.download = `Export_${new Date().toISOString().substring(0, 10)}.png`;
		element.href = window.URL.createObjectURL(blob);
		element.click();
		element.remove();
	});
	path = [];
	paths = []
}

function toggleColor(){
	drawColor = (drawColor + 1) % drawColors.length;
	
	document.querySelectorAll(".draw-color").forEach(b => {
		b.classList.remove("selected");
	});

	document.getElementById("draw-color-" + drawColor).classList.add("selected");
}
