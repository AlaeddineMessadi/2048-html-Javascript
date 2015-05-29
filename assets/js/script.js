var GRID_SIZE = 4;
var ANIMATION_DURATION = 100;

var grid = [];
var merging = [];

for (var i = 0; i < GRID_SIZE; i++) {
	var row1 = [];
	var row2 = [];

	for (var j = 0; j < GRID_SIZE; j++) {
		row1.push(null);
		row2.push(false);
	}

	grid.push(row1);
	merging.push(row2);
}

function makeNew(row, col) {
	var number = Math.random() < 0.9 ? 2 : 4;
	var color = pikColor(number);
	var textcolor = textColor(number);

	return grid[row][col] = $('<div>').css({
		background : color,
		color : textColor,
		top : row * 100 + 'px',
		left : col * 100 + 'px'
	}).text(number).addClass('box').appendTo($('#grid'));
	// $('#grid').append($('#grid .box:first'));
}

function hasUnusedCell() {
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			if (grid[i][j] == null) {
				return true;
			}
		}
	}

	return false;
}

// Find Unused Cell
function findUnusedCell() {
	while (true) {
		var row = Math.floor(Math.random() * GRID_SIZE);
		var col = Math.floor(Math.random() * GRID_SIZE);

		if (grid[row][col] == null) {
			return [ row, col ];
		}
	}
}

// check if relationBlocked
function isRelationBlocked(row1, col1, row2, col2) {
	if (row1 == row2) {
		var min = Math.min(col1, col2);
		var max = Math.max(col1, col2);

		for (var mid = min + 1; mid < max; mid++) {
			if (grid[row1][mid])
				return true;
		}
	} else {
		var min = Math.min(row1, row2);
		var max = Math.max(row1, row2);

		for (var mid = min + 1; mid < max; mid++) {
			if (grid[mid][col1])
				return true;
		}
	}

	return false;
}
// try to move
function tryMove(row1, col1, row2, col2) {
	if (grid[row1][col1] == null || isRelationBlocked(row1, col1, row2, col2)) {
		return false;
	}

	if (grid[row2][col2] == null) {
		return move(row1, col1, row2, col2);
	} else if (grid[row1][col1].text() == grid[row2][col2].text()) {
		return merge(row1, col1, row2, col2);
	}

	return false;
}

// Tile moving
function move(row1, col1, row2, col2) {
	grid[row2][col2] = grid[row1][col1];
	grid[row1][col1] = null;
	var number = grid[row2][col2].text() * 1;
	var color = pikColor(number);
	var textcolor = textColor(number);

	grid[row2][col2].css({
		background : color,
		color : textcolor
	}).animate({
		top : row2 * 100 + 'px',
		left : col2 * 100 + 'px'
	}, 100).text(number);

	return true;
}

// move the cell up
function moveUp() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			for (var k = j + 1; k < GRID_SIZE; k++) {
				if (tryMove(k, i, j, i)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
	}
}

// move the cell down
function moveDown() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = GRID_SIZE - 1; j >= 0; j--) {
			for (var k = j - 1; k >= 0; k--) {
				if (tryMove(k, i, j, i)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
	}
}

// move the cell left
function moveLeft() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			for (var k = j + 1; k < GRID_SIZE; k++) {
				if (tryMove(i, k, i, j)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
	}
}

// move the cell right
function moveRight() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = GRID_SIZE - 1; j >= 0; j--) {
			for (var k = j - 1; k >= 0; k--) {
				if (tryMove(i, k, i, j)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
	}
}

// merge two cells
function merge(row1, col1, row2, col2) {
	if (merging[row2][col2]) {
		return false;
	}

	grid[row2][col2].remove();
	grid[row2][col2] = grid[row1][col1];
	grid[row1][col1] = null;
	var number = grid[row2][col2].text() * 2;
	var color = pikColor(number);
	var textcolor = textColor(number);
	merging[row2][col2] = true;

	grid[row2][col2].css({
		top : row2 * 100 + 'px',
		left : col2 * 100 + 'px'
	}).text(number).animate({
		height : '90px',
		width : '90px'
	}, 100).animate({
		backgroundColor : color,
		color : textcolor
	}, 100).animate({
		height : '80px',
		width : '80px'
	}, 100);

	return true;
}

// cleare merging
function clearMerging() {
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			merging[i][j] = false;
		}
	}
}

function didMovement() {
	clearMerging();

	if (hasUnusedCell()) {
		var unused = findUnusedCell();
		makeNew(unused[0], unused[1]);
	}
}
