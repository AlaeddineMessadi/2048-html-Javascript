/*
 *  2048 implementation of the famous game 2048 with pure HTML , JQuery and CSS
 *  Copyright (C) 2015-2016 by Alaeddine Messadi
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *  
 *  written by Alaeddine Messadi
 *  https://github.com/AlaeddineMessadi/2048_pure_html
 */

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

// pick a color

function pikColor(number) {
	var color;
	switch (number) {
	case 2:
		color = '#EEEE4DA'
		break;
	case 4:
		color = '#EDE0C8'
		break;
	case 8:
		color = '#F2B179'
		break;
	case 16:
		color = '#EE770F'
		break;
	case 32:
		color = '#EE4A0F'
		break;
	case 64:
		color = '#EE0F0F'
		break;
	case 128:
		color = '#E4D505'
	case 256:
		color = '#EDED62'
		break;
	case 512:
		color = '#B4C953'
	case 1024:
		color = '#E5FF71'
	default:
		color = '#3CF713'
	}
	return color;
}

// text's color 
function textColor(number) {
	var textColor;
	if (number <= 4) {
		textColor = "#776E65";
	} else {
		textColor = "#F9F6F2";
	}
	return textColor;
}

$(document).ready(function() {
    $(document).keydown(function(e) {
      if (e.keyCode == 37) moveLeft();
      if (e.keyCode == 38) moveUp();
      if (e.keyCode == 39) moveRight();
      if (e.keyCode == 40) moveDown();
    });

    var unused = findUnusedCell();
    makeNew(unused[0], unused[1]);

    var unused = findUnusedCell();
    makeNew(unused[0], unused[1]);
  });
