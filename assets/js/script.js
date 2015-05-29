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

  return grid[row][col] = $('<div>')
    .css({
	  background: color,
	  color: textColor,
      top  : row * 100 + 'px',
      left : col * 100 + 'px'
    })
    .text(number)
    .addClass('box')
    .appendTo($('#grid'));
	//$('#grid').append($('#grid .box:first'));
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