$(document).ready(function(){
  var board = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
  var boardLength = board.length;
  var cross = "X";
  var zero = "O";
  var move = 1;
  var win = false;
  var noWin = false;
  var player, computer;

  $(".user_player").click(function() {
    player = $(this).attr("value");
    if (player == cross) {
      computer = zero;
    } else {
      computer = cross;
    }
  });

  $(".cell").click(function() {
    if (win || noWin) {
      return;
    }

    var id = $(this).attr("id");
    var row = id[0];
    var column = id[1];

    if (move == 1 || move % 2 != 0) {
      moveUser(row, column, id);
    }

    if (move == 2) {
      firstRandomComputersMove();
    }

    if (move % 2 == 0 && move > 3) {
      strategicComputersMove(row, column, board, boardLength);
    }

    checkLooseLooseSituation();
  });

  function moveUser(row, column, id) {
    if (board[row][column] == null) {
      insertIntoCell(id, player);
      if(move >= boardLength){
        checkWin(board, row, column, boardLength, player);
      }
      move ++;
    }
  }

  function firstRandomComputersMove() {
    var row = generateRandomCoordinate(boardLength - 1);
    var column = generateRandomCoordinate(boardLength - 1);

    while (board[row][column] != null) {
      row = generateRandomCoordinate(boardLength - 1);
      column = generateRandomCoordinate(boardLength - 1);
    }

    id = row.toString() + column.toString();
    insertIntoCell(id, computer);
    move ++;
  }

  function strategicComputersMove(row, column, board, boardLength) {
    var id = selectCoordinates(row, column, board, boardLength);
    if (id != null) {
      insertIntoCell(id, computer);
      checkWin(board, id[0], id[1], boardLength, computer)
      move ++;
    }
    else {
      noWin = true;
    }
  }

  function checkLooseLooseSituation() {
    if (noWin) {
      alert("Loose-loose situation!");
      return;
    }
  }

  function generateRandomCoordinate(boardLength) {
    return Math.round(Math.random()* boardLength);
  }

  function selectCoordinates(x, y, board, boardLength) {
    var countXRow = countNumberInRow(cross, zero).count;
    var countXColumn = countNumberInColumn(cross, zero).count;
    var leftDiagonalX = countAllLeftDiagonal(cross, zero);
    var rightDiagonalX = countAllRightDiagonal(cross, zero);

    var countZeroRow = countNumberInRow(zero, cross).count;
    var countZeroColumn = countNumberInColumn(zero, cross).count;
    var leftDiagonalZero = countAllLeftDiagonal(zero, cross);
    var rightDiagonalZero = countAllRightDiagonal(zero, cross);

    var arrayX = [countXRow, countXColumn, leftDiagonalX, rightDiagonalX]
    var arrayZero = [countZeroRow, countZeroColumn, leftDiagonalZero, rightDiagonalZero]
    var largestCountX = Math.max.apply(Math, arrayX);
    var largestCountZero = Math.max.apply(Math, arrayZero);

    // console.log("Row X  " + countXRow);
    // console.log("Column X  " + countXColumn);
    // console.log("leftDiagonal X  " + leftDiagonalX)
    // console.log("rightDiagonal X  " + rightDiagonalX)
    //
    // console.log("Row O  " + countZeroRow)
    // console.log("Column O  " + countZeroColumn);
    // console.log("leftDiagonal O  " + leftDiagonalZero)
    // console.log("rightDiagonal O  " + rightDiagonalZero)

    if (largestCountX >= largestCountZero && largestCountX != 0) {
      var value = cross;
      var compareWithValue = zero;
      id = generateCoordinates(largestCountX, arrayX, value, compareWithValue);
    } else if (largestCountZero > largestCountX && largestCountZero != 0) {
      var value = zero;
      var compareWithValue = cross;
      id = generateCoordinates(largestCountZero, arrayZero, value, compareWithValue);
    } else if (largestCountX == 0 && largestCountZero == 0 &&
              !isEmpty(countNumberInRow(null, cross).count) &&
              !isEmpty(countNumberInColumn(null, cross).count) &&
              !isEmpty(countAllLeftDiagonal(null, cross)) &&
              !isEmpty(countAllRightDiagonal(null, cross))) {
      id = null;
    } else {
      row = generateRandomCoordinate(boardLength - 1);
      column = generateRandomCoordinate(boardLength - 1);

      while (board[row][column] != null) {
        row = generateRandomCoordinate(boardLength - 1);
        column = generateRandomCoordinate(boardLength - 1);
      }

      id = row.toString()+ column.toString();
    }

    return id;
  }

  function isEmpty(value) {
    return value == boardLength;
  }

  function generateCoordinates(largestCount, array, value, compareWithValue){
    var x, y;

    if (largestCount.toString() == array[0].toString()) {
      x = countNumberInRow(value, compareWithValue).coordinate;
      y = generateRandomCoordinate(boardLength - 1);
      while (board[x][y] != null) {
        y = generateRandomCoordinate(boardLength - 1);
      }
    } else if (largestCount.toString() == array[1].toString()) {
      y = countNumberInColumn(value, compareWithValue).coordinate;;
      x = generateRandomCoordinate(boardLength - 1);

      while (board[x][y] != null) {
        x = generateRandomCoordinate(boardLength - 1);
      }
    } else if(largestCount.toString() == array[2].toString()){
      i = generateRandomCoordinate(boardLength - 1);

      while (board[i][i] != null) {
        i = generateRandomCoordinate(boardLength - 1);
      }
      x = i;
      y = i;
    } else if (largestCount.toString() == array[3].toString()) {
      i = generateRandomCoordinate(boardLength - 1);

      while (board[boardLength - i - 1][i]!= null) {
        i = generateRandomCoordinate(boardLength - 1);
      }
      x = boardLength - i - 1;
      y = i;
    }
    return id = x.toString() + y.toString();
  }

  function Coordinates(count, coordinate){
    this.count = count;
    this.coordinate = coordinate;
  }

  function countNumberInRow(value, compareWithValue) {
    var maxCount = 0;
    var finalCoordinate;

    for (var i = 0; i < boardLength; i ++) {
      var count = 0;
      var currentCoordinate = i;

      for (var j = 0; j < boardLength; j ++) {
        if (board[i][j] == compareWithValue) {
          count = 0;
          currentCoordinate = null;
          break;
        } else if (board[i][j] == value) {
          count ++;
        }
      }

      if (maxCount < count) {
        maxCount = count;
        finalCoordinate = currentCoordinate;
      }
    }
    return new Coordinates(maxCount, finalCoordinate);
  }

  function countNumberInColumn(value, compareWithValue) {
    var maxCount = 0;
    var finalCoordinate;

    for (var i = 0; i < boardLength; i ++) {
      var count = 0;
      var currentCoordinate = i;

      for (var j = 0; j < boardLength; j ++) {
        if (board[j][i] == compareWithValue) {
          count = 0;
          currentCoordinate = null;
          break;
        } else if (board[j][i] == value) {
          count ++;
        }
      }
      if (maxCount < count) {
        maxCount = count;
        finalCoordinate = currentCoordinate;
      }
    }
    return new Coordinates(maxCount, finalCoordinate);
  }

  function countAllLeftDiagonal(value, compareWithValue) {
    var count = 0;

    for (var i = 0; i < boardLength; i ++) {
      if (board[i][i] == compareWithValue) {
        count = 0;
        break;
      } else if (board[i][i] == value){
        count ++;
      }
    }
    return count;
  }

  function countAllRightDiagonal(value, compareWithValue){
    var count = 0;

    for (var i = 0; i < boardLength; i ++) {
      if(board[boardLength - i - 1][i] == compareWithValue) {
        count = 0;
        break;
      } else if (board[boardLength - i - 1][i] == value) {
        count ++;
      }
    }
    return count;
  }

  function insertIntoCell(id, value) {
    board[id[0]][id[1]] = value;

    // Lets make computer think for a seconds:)
    if (value == computer) {
      setTimeout(function() { document.getElementById(id).innerHTML = value; }, 500);
    } else {
      document.getElementById(id).innerHTML = value;
    }
  }

  function checkWin(board, x, y, boardLength, player) {
    if (checkRow(x, board, boardLength) ||
        checkColumn(y, board, boardLength) ||
        checkLeftDiagonal(board, boardLength) && board[0][0] == player ||
        checkRightDiagonal(board, boardLength) && board[boardLength - 1][0] == player) {
        win = true;
        alert(player + " wins!")
     return win;
    }
     return false;
   }

  // Check if the row has a win
  function checkRow(x, board, boardLength) {
    if (board[x][0] == null) {
      return false;
    }

    for (var i = 1; i < boardLength; i ++) {
      if (board[x][0] != board[x][i]) {
        return false;
      }
    }
    return true;
  }

  // Check if the column has a win
  function checkColumn(y, board, boardLength) {
    if (board[0][y] == null) {
      return false;
    }

    for (var i = 1; i < boardLength; i ++) {
      if (board[0][y] != board[i][y]) {
        return false;
      }
    }
    return true;
  }

  // Check if the left diagonal has a win
  function checkLeftDiagonal(board, boardLength, player){
    if (board[0][0] == null) {
      return false;
    }

    for (var i = 1; i < boardLength; i ++) {
      if (board[0][0] != board[i][i]) {
        return false;
      }
    }
    return true;
  }

  // Check if the right diagonal has a win
  function checkRightDiagonal(board, boardLength) {
    if (board[boardLength - 1][0] == null) {
      return false;
    }

    for (var i = 1; i < boardLength; i ++) {
      if (board[boardLength - 1][0] != board[boardLength - i - 1][i]) {
        return false;
      }
    }
    return true;
  }
});
