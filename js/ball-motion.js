/* ------- CONTROLS ------- */
// win/loss parameters
var maxMisses = 3;
var winningRadius = initialRad() / 20;

// reduction factors
var shrinkFactor = 0.9;
var velocityFactor = initialRad()/200;
var velocityGrowth = initialRad()/400;

// initial ball size
// var initialR = 90;
var initialR = initialRad();
function initialRad() {
	return Math.min(window.innerWidth, window.innerHeight) * .2;
};

// colors
var initialBgColor = "rgba(100, 100, 100, 1)";
var initialBallColor = '#123abc';

// set initial ball size
var r = initialRad();

// bar height
var barHeight = 90;
var minSize = 320;

// initial colors
var bgColor = initialBgColor;
var ballColor = initialBallColor;

// box size
var boxSize = {
	width: (window.innerWidth > minSize) ? 'window.innerWidth' : minSize,
	// width: window.innerWidth,
	height: (window.innerHeight> minSize) ? 'window.innerHeight' : minSize
}

var highScores = [
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,],
	["Name", 0, 0,]
]

var colorSchemes = [
	['#0d0630', '#18314f', '#384e77', '#8bbeb2', '#e6f9af'],
	['hsl(25, 80%, 25%)', 'hsl(25, 80%, 40%)', 'hsl(25, 80%, 55%)', 'hsl(25, 80%, 70%)','hsl(37, 100%, 92%)'],
	['#22223b', '#494968', '#8b8b99', '#a7a7c9', '#e3e3f2'],
	['hsl(200, 77%, 20%)', 'hsl(200, 84%, 28%)', 'hsl(200, 53%, 41%)', 'hsl(200, 53%, 50%)', 'hsl(37, 100%, 92%)'],
	['#3c1518', '#69140e', '#a44200', '#d58936', '#f2f3ae'],
	['#215448', '#91e0ce', '#9effe8', '#91e0ce', '#ddfff7'],
	['#5B100C', '#82110B', '#9E3631', '#c3433c', '#papayawhip'],
	['hsl(246, 17%, 32%)', 'hsl(272, 15%, 42%)', 'hsl(343, 40%, 59%)', 'hsl(349, 40%, 69%)', 'hsl(192, 15%, 94%)'],
	['hsl(85, 77%, 20%)', '#2d3d23', 'hsl(85, 53%, 41%)', 'hsl(85, 53%, 50%)', 'hsl(37, 100%, 92%)'],
	['#e54b4b', '#ffa987', '#f7ebe8', '#444140', '#1e1e24'],
	['#1c2321', '#7d98a1', '#5e6572', '#a9b4c2', '#eef1ef']
]

// framerate stuff
// goes here

/*** ADDITION START ***/

// function setColorScheme(level) {
//     $('#logo').css('background-color', colorSchemes[level][0]);
//     $('#canvas').css('background-color', colorSchemes[level][1]);
//     $('#level-span').css('background-color', colorSchemes[level][2]);
//     $('#score-span').css('background-color', colorSchemes[level][3]);
//     $('body').css('background-color', colorSchemes[level][4]);
//     $('*').css('color', colorSchemes[level][4]);
//     $('#restartButton').css('opacity', 0.5);
//     $('#highScoresButton').css('opacity', 0.5);
//     ballColor = colorSchemes[level][4];
//     // logo, canvas, level-span, score-span, ball,text,stars
// }

// cache selectors
var $logo = $('#logo'),
	$canvas = $('#canvas'),
	$levelSpan = $('#level-span'),
	$scoreSpan = $('#score-span'),
	$body = $('body'),
	$all = $('*'),
	$restartButton = $('#restartButton'),
	$highScoresButton = $('#highScoresButton');

function setColorScheme(level) {
	$logo.css('background-color', colorSchemes[level][0]);
	$canvas.css('background-color', colorSchemes[level][1]);
	$levelSpan.css('background-color', colorSchemes[level][2]);
	$scoreSpan.css('background-color', colorSchemes[level][3]);
	$body.css('background-color', colorSchemes[level][4]);
	$all.css('color', colorSchemes[level][4]);
	$restartButton.css('opacity', 0.5);
	$highScoresButton.css('opacity', 0.5);
	ballColor = colorSchemes[level][4];
}

/***  ADDITION END  ***/




/* ------- SETUP ------- */

// Cicrcle object type definition

/*** ADDITION START ***/

// GameCircle = function(ctx, x, y, r, circleColor) {
var GameCircle = function(ctx, x, y, r, circleColor) {

/*** ADDITION END ***/

	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI); // x, y, r, rad-start->0, rad-end->2*Pi
	ctx.fillStyle = circleColor;
	ctx.fill();
};

// ------- Load starting parameters
// set counters
var lost = false;
var score = 0;
var missedClicksInARow = 0;
var scoresFromMainScreen = false;

/*** ADDITION START ***/

// initialize score increment and cache animation target
var scoreIncrement;
var $scoreIncrement = $('#score-increment');

/*** ADDITION END ***/

function currentLevel() {
	var currentLevel = Math.ceil((initialRad() - r)/10);//max levels 10
	 return (currentLevel === 0) ? '1' : currentLevel;
}

// starting ball position
var position = {
	x: 5,
	y: 5
}
position.x = newX();
position.y = newY();

// set stating velocity
var velocity = {
	direction: Math.random() * 2 * Math.PI,
	speed: velocityFactor
}

//canvas and context variables
var can;
var ctx;
var overlay = document.getElementById('canvas-overlay');;

// sets the canvas
function setTheCanvas() {
	can = document.getElementById('canvas');
	can.width = (window.innerWidth > minSize) ? window.innerWidth : minSize;
	can.height = (window.innerHeight > minSize) ? window.innerHeight - barHeight: minSize - barHeight;
	ctx = can.getContext('2d');

	// overlay = document.getElementById('canvas-overlay');
	// console.log(overlay);
	// overlay.style.height = can.height;
	// overlay.height = can.height;
}

setTheCanvas();


function onScreenChange() {
	can.width = window.innerWidth;
	can.height = window.innerHeight - barHeight;
	
	can.width = (window.innerWidth > minSize) ? window.innerWidth : minSize;
	can.height = (window.innerHeight > minSize) ? window.innerHeight - barHeight: minSize - barHeight;
	x = newX();
	y = newY();

	// overlay = document.getElementById('canvas-overlay');
	// overlay.height = can.height;

	restart();
	//call redraw   
}

// window.addEventListener('orientationchange', onScreenChange);

window.onresize = function() {
	onScreenChange();
	// resetZoom();
}

/* --------- GAME LOOP --------- */
function draw() {
	// clear the canvas
	ctx.clearRect(0,0,can.width,can.height);

	// place the ball
	var gameBall = GameCircle(ctx, position.x, position.y, r, ballColor);

	// ctx.beginPath();
	// ctx.arc(100, 100, 50, 0, 2 * Math.PI); // x, y, r, rad-start->0, rad-end->2*Pi
	// ctx.fillStyle = circleColor;
	// ctx.fill();

	// increment the next position of the ball
	position.x += velocity.speed * Math.cos(velocity.direction);
	position.y += velocity.speed * Math.sin(velocity.direction);
	// increaseSpeed();
	// changeDirection()l

	// detect left/right wall
	if (position.x - r <= 0 || position.x + r >= can.width) {
		// change horizontal ball velocity
		velocity.direction = Math.PI * 3 - velocity.direction; 

	}
	// detect top/bottom wall
	if (position.y + r >= can.height || position.y - r <= 0) {
		// change vertical ball velocity
		velocity.direction = 2 * Math.PI - velocity.direction; 
	}

	if(lost) {
		return;
	}
	// draw background & ball
	requestAnimationFrame(draw);
}
/* -------- END GAME LOOP ------ */

// start the game
function startGame() {
	setColorScheme(currentLevel() - 1);
	draw();
	newEventListener();
}

// listen for clicks on the canvas
function newEventListener() {

	// var old_element = can;
	// var new_element = can.cloneNode(true);

	can.addEventListener('mousedown', function(event) {
		// if click is on the circle...
		if (clickIsInCircle(event)) {
			// do the clickedOnCircle action
			clickedOnCircle();
		} else {
			// do missed click action
			missedClick();
		}
	}, false);
}


/* ---------- UTILITIES ---------- */
// returns true if event has a click inside the game circle
// otherwise returns false
function clickIsInCircle(event) {
	// var position = getMousePos(can, event);
	var clickX = event.clientX;
	var clickY = event.clientY;

	// Uses circle as click-box -- harder
	// check sqrt((x0 - x1)^2 + (y0 - y1)^2)) < r
	if (Math.sqrt(Math.pow(position.x - clickX, 2) + Math.pow(position.y - clickY, 2)) < r) {
		return true;
	}

	// Uses square around circle as click-box -- easier
	// Leave for options
	// if (Math.abs(x - clickX) < r && Math.abs(y - clickY) < r){
	//     return true;
	// }

	return false;
}

// executes on circle click
function clickedOnCircle() {

	// change ball color

	// increment the score
	level = currentLevel();
	scoreIncrement = (maxMisses - missedClicksInARow) * level;
	score += (maxMisses - missedClicksInARow) * level;

	// update score counter
	updateScoreCounter();

	// reset missed click counter
	missedClicksInARow = 0;

	updateMissCounter();

	// update level counter
	updateLevelCounter();

	// change ball size
	r -= shrinkFactor;

	// check for win
	if (r < winningRadius) {
		youWin();
		return;
	}
	
	// change ball speed & angle
	velocity.speed += velocityGrowth;
	velocity.direction = Math.random() * 2 * Math.PI;
}

// executes when a click is missed
function missedClick() {
	missedClicksInARow++;
	updateMissCounter();

	if (missedClicksInARow > maxMisses) {
		lost = true;
		youLose();
	}
}

function showHighScores() {
	getAndSortScores();
	showModal(highScoreContent());
}

// on win
function youWin() {
	getAndSortScores();
	showModal(winMessageContent());
}

// on loss
function youLose() {
	getAndSortScores();
	// show you lose caption
	showModal(loseMessageContent());
		// restart(); // move this to click listener inside lose caption
}

function getAndSortScores() {
	if (score > highScores[highScores.length - 1][1] && !scoresFromMainScreen) {
		writeNewScore(); 
	}
	retrieveScores();
	highScores.sort(sortHighScores);
}


function setStartingVelocity() {
	velocity.direction = Math.random() * 2 * Math.PI;
	velocity.speed = velocityFactor;
}

// restart game
function restart() {
	lost = false;

	// reset the counter
	score = 0;
	updateScoreCounter();

	// reset the circle size
	missedClicksInARow = 0;

	/*** ADDITION START ***/

	// reset miss counter
	updateMissCounter();

	/*** ADDITION END ***/

	// reset circle color
	ballColor = initialBallColor;

	// reset starting position
	position.x = newX();
	position.y = newY();

	// reset velocity
	setStartingVelocity();

	// reset ball size
	r = initialRad();
	updateLevelCounter();

	setColorScheme(currentLevel() - 1);

	// draw();
}

// ---------- Display scores
// update score counter
function updateScoreCounter() {
	document.getElementById("current-score").textContent = score;
	// animate score increment
	if (score > 0 ) {
		$scoreIncrement
			.finish() // stop any previous animations
			.text('+' + scoreIncrement)
			.css('top', '50%')
			.fadeIn('fast')
			.animate({
				opacity: 1,
				top: '25%'
			}, 100)
			.fadeOut('fast');
	}
}

function updateLevelCounter() {
	document.getElementById("level").textContent = currentLevel(); 
	setColorScheme(currentLevel() - 1);   
}

// update miss counter 
function updateMissCounter() {
	if (missedClicksInARow === 4 || missedClicksInARow === 0) {
		$('i').css("opacity", "1");
		for (i = 1; i <= maxMisses; ++i) {
			// $('i:nth-of-type(i)').last().css("opacity", "1");  
		}
			// $('i:nth-of-type(3)').last().css("opacity", "1");
	}
	else {
		// remove the last remaining star
		var n = maxMisses - missedClicksInARow + 1;
		var selectorString = "i.stars:nth-of-type(" + n + ")";
		$(selectorString).css("opacity", "0");
	}
}



// ----------- Other
// Generates random acceptable starting
// X coordinate based on boxWidth
function newX() {
	return window.innerWidth / 2 - r;
}

// Generates random acceptable starting
// Y coordingate based on boxHeight
function newY() {
	return window.innerHeight / 2 - r;
}


/*** ADDITION START ***/

// START THE GAME
// startGame();
var $startBtn = $('#startBtn'),
	$startModal = $('#startModal');

$startModal.on('click', function() {
	$startModal.css('display', 'none');
	startGame();
});

/***  ADDITION END  ***/

// UPDATE PLAYER SCORES
function writeNewScore() {
	// A post entry.
	var postData = {
		name: prompt("New high score!"),
		score: score,
		level: currentLevel()
	};

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('players').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/players/' + newPostKey] = postData;
	return firebase.database().ref().update(updates);
}

// writeNewPlayer();


// contents for display overlays
function loseMessageContent() {

	var returnMessage = $('<div>');
	returnMessage.append($('<h4>').text("You lose!"));
	returnMessage.append($('<p>').text("Try again."));
	returnMessage.append(highScoreTable());

	return returnMessage;
}

function highScoreTable() {
	var table = $('<table>');

	table.append($('<thead>'));
	table.append($('<th>').text("Name"));
	table.append($('<th>').text("Score"));
	table.append($('<th>').text("Level"));

	var tableBody = table.append($('<tbody>'));

	for (var i = 0; i < highScores.length; ++i) {
		var scoreRow = $('<tr>');
		scoreRow.append($('<td>').text(highScores[i][0]));
		scoreRow.append($('<td>').text(highScores[i][1]));
		scoreRow.append($('<td>').text(highScores[i][2]));

		tableBody.append(scoreRow);
	}

	return table;
}

function winMessageContent() {

	var returnMessage = $('<div>');
	returnMessage.append($('<h4>').text("You win!"));
	returnMessage.append($('<p>').text("Congratulations!"));
	returnMessage.append(highScoreTable());

	return returnMessage;
}

function highScoreContent() {
	var returnMessage = $('<div>');
	returnMessage.append($('<h4>').text("High Scores"));
	returnMessage.append(highScoreTable());

	return returnMessage;

}

function loadMessageContent() {
	
}

// Get the modal
var modal = document.getElementById('myModal');

/*** ADDITION START ***/


/* UNUSED */
// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

/* MORE SEMANTIC NAME */
var closeBtn = document.getElementsByClassName("close")[0];

/* UNUSED */
// // When the user clicks the button, open the modal
// btn.onclick = function() {
// }

/***  ADDITION END  ***/

function showModal(fullMessage) {

	/*** ADDITION START ***/

	// cache selectors
	var $modalContent = $('.modal-content');
	var $modalContentBox = $('.modal-content-box');

	// $('.modal-content').css('background-color', colorSchemes[currentLevel() - 1][0]);
	// $('.modal-content-box').empty();
	// $('.modal-content-box').append(fullMessage);
	$modalContent.css('background-color', colorSchemes[currentLevel() - 1][0]);
	$modalContentBox.empty();
	$modalContentBox.append(fullMessage);
	modal.style.display = "block";

	/***  ADDITION END  ***/	
}

function hideModal() {
	modal.style.display = "none";
	if (!scoresFromMainScreen) {
		restart();
		draw();
	}
	else {
		scoresFromMainScreen = !scoresFromMainScreen;
	}
}

/*** ADDITION START ***/

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
// 	hideModal();
// }
closeBtn.onclick = function() {
	hideModal();
}

/***  ADDITION END  ***/

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		hideModal();
	}
}

function retrieveScores() {
	// retrieve the first 10 scores, sorted by value
	firebase.database().ref('players').orderByChild('score').limitToLast(10).on('value', function(snapshot) {
		var topRecords = snapshot.val();
		var i = 0;

		for (obj in topRecords) {
			highScores[i][0] = topRecords[obj].name;
			highScores[i][1] = topRecords[obj].score;
			highScores[i][2] = topRecords[obj].level;
			++i;
		}
	});
}

function sortHighScores(a,b) {
	return b[1] - a[1];
}


function resetZoom() {
	// document.body.style.zoom = 1.0;
}

function setButtonListeners() {
	var restartButton = document.getElementById("restartButton");
	restartButton.addEventListener('mousedown', function(event) {
		restart();
	});


	var highScoresButton = document.getElementById("highScoresButton");
	highScoresButton.addEventListener('mousedown', function(event) {
		scoresFromMainScreen = true;
		showHighScores();
	});
}

retrieveScores();
// sortHighScores();
setButtonListeners();