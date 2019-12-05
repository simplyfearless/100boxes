import { fabric } from 'fabric';
import './style/style.css';
import colors from './constants/colors';
import elements from './constants/elements';
import generateBoard from './components/board/generateBoard';

/**
 * @const {object}
 */
const [score, canvas] = elements;

/**
 * @const {string}
 */
const [colorClicked, colorClick, colorDefault] = colors;

/**
 * @let {array}
 */
let boardSquares = [];

/** Function that set canvas dimensions. */
function setCanvasDimensions() {
	canvas.setDimensions({ width: window.innerHeight, height: window.innerHeight });
}

/** Function that restarts the game. */
function restartGame() {
	boardSquares.forEach((square) => {
		square.clickable = true;
		square.clicked = false;
		square.color = colorDefault;
		score.innerHTML = '0';
		square.draw();
	});
}

/**
 * Function that update boards
 * squares state based on
 * square that is passed
 * as parametar.
 *
 * @param {object} clickedSquare - A clickedSquare value
 *
 */
function update(clickedSquare) {
	if (clickedSquare.clicked || !clickedSquare.clickable) return;
	clickedSquare.clicked = true;
	clickedSquare.clickable = false;
	clickedSquare.color = colorClicked;
	clickedSquare.draw();

	boardSquares.forEach((square) => {
		if (square.clicked) return;

		const { x: squareX, y: squareY } = square.index;
		const { x: clickedSquareX, y: clickedSquareY } = clickedSquare.index;
		if (
			squareX === clickedSquareX
			&& (squareY === clickedSquareY + 3 || squareY === clickedSquareY - 3)
		) {
			square.clickable = true;
			square.color = colorClick;
		} else if (
			squareY === clickedSquareY
			&& (squareX === clickedSquareX + 3 || squareX === clickedSquareX - 3)
		) {
			square.clickable = true;
			square.color = colorClick;
		} else if (
			squareY === clickedSquareY - 2
			&& (squareX === clickedSquareX + 2 || squareX === clickedSquareX - 2)
		) {
			square.clickable = true;
			square.color = colorClick;
		} else if (
			squareY === clickedSquareY + 2
			&& (squareX === clickedSquareX + 2 || squareX === clickedSquareX - 2)
		) {
			square.clickable = true;
			square.color = colorClick;
		} else {
			square.clickable = false;
			square.color = colorDefault;
		}
		square.draw();
	});
	
	/**
	 * @const {array}
	 */
	const clickableSquaresLeft = boardSquares.filter((square) => square.clickable);
	
	if (!clickableSquaresLeft.length) {
		/**
		 * @const {object}
		 */
		const rect = new fabric.Rect({
			top: 0,
			left: 0,
			width: window.innerHeight,
			height: window.innerHeight,
			fill: 'rgba(0,0,0,0.7)',
			strokeWidth: 0.2,
			selectable: false,
		});
		canvas.add(rect);

		canvas.add(new fabric.IText('GAME OVER', {
			fontFamily: '28px Arial',
			fill: '#fff',
			textAlign: 'center',
			top: window.innerHeight / 2,
		}));

		canvas.add(new fabric.IText('Press SPACEBAR to play again', {
			fontFamily: '22px Arial #fff',
			fill: '#fff',
			textAlign: 'center',
			top: 40 + window.innerHeight / 2,
		}));
	}
	
	/**
	 * @const {array}
	 */
	const numberOfClicks = boardSquares.filter((square) => square.clicked).length;
	score.innerHTML = numberOfClicks;
}

/**
 * Function that sets event listeners
 * on canvas object.
 *
 */
function initCanvasEvents() {
	canvas.on('mouse:down', (event) => {
		const { x, y } = event.absolutePointer;

		boardSquares.forEach((square) => {
			if (
				y > square.position.y
				&& y < square.position.y + square.height
				&& x > square.position.x
				&& x < square.position.x + square.width
			) {
				update(square);
			}
		});
	});
}

/**
 * Function that sets event listeners
 * on document object.
 *
 */
function initDocumentEvents() {
	document.addEventListener('keydown', (event) => {
		if (event.keyCode === 32) {
			restartGame();
		}
	});
}

/**
 * Function that set canvas dimenssions
 * initiate game board and event listeners.
 *
 */
function init() {
	setCanvasDimensions();
	boardSquares = generateBoard();
	boardSquares.forEach((square) => {
		square.draw();
	});
	
	initCanvasEvents();
	initDocumentEvents();
}

/**
 * Function that sets event listeners
 * on window object.
 *
 */
function initWindowEvents() {
	window.addEventListener('resize', () => {
		canvas.setDimensions({ width: window.innerHeight, height: window.innerHeight });
		init();
	});
}

init();
initWindowEvents();
