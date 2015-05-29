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

function findUnusedCell() {
	while (true) {
		var row = Math.floor(Math.random() * GRID_SIZE);
		var col = Math.floor(Math.random() * GRID_SIZE);

		if (grid[row][col] == null) {
			return [ row, col ];
		}
	}
}

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