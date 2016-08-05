$(document).ready(function(){
  var game;
  var board = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
  var boardLength = board.length;
  var cross = "X";
  var zero = "O";
  var move = 1;
  var win = false;
  var noWin = false;
  var userVsUser = "userVsUser";
  var userVsComputer = "userVsComputer";

  $(".game_version").click(function() {
    game = $(this).attr("value");
  });

  $(".cell").click(function() {
    // if (game == userVsUser) {
    //   if (win) {
    //     return;
    //   }
    //   var id = $(this).attr("id");
    //   var row = id[0];
    //   var column = id[1];
    //   var player;
    //
    //   if (board[row][column] == null) {
    //     if (move == 1 || move % 2 != 0) {
    //       player = cross;
    //       insertIntoCell(id, cross);
    //     } else if (move % 2 == 0) {
    //       player = zero;
    //       insertIntoCell(id, zero);
    //     }
    //
    //     if (move >= 4) {
    //       checkWin(board, row, column, boardLength, player)
    //     }
    //     move ++;
    //   }
    //   endGame();
    // }

    if (game == userVsComputer) {
      if (win || noWin) {
        return;
      }

      // Find coordinates of the cell user clicks on
      var id = $(this).attr("id");
      var row = id[0];
      var column = id[1];

      // User moves
      if (board[row][column] == null) {
        if (move == 1 || move % 2 != 0) {
          insertIntoCell(id, cross);
        }
        move ++;
      }
      // First computer's move is random
      if (move == 2) {
        var x = generateRandomCoordinate(boardLength - 1);
        var y = generateRandomCoordinate(boardLength - 1);

        while (board[x][y] != null) {
          x = generateRandomCoordinate(boardLength - 1);
          y = generateRandomCoordinate(boardLength - 1);
        }

        id = x.toString()+ y.toString();
        insertIntoCell(id, zero);
        move ++;
      }

      if(move >= boardLength){
        // Computer moves
        if (move % 2 == 0) {
          var id = selectCoordinates(row, column, board, boardLength);
          if (id != null) {
            insertIntoCell(id, zero);
            move ++;
          } else {
            noWin = true;
            alert("Loose-loose situation!");
            return;
          }
        }

        // Check if user or computer wins
        // For now user cannot win - something to work on later
        if (checkRow(row, board, boardLength) ||
            checkColumn(column, board, boardLength)||
            checkLeftDiagonal(board, boardLength) &&
            board[0][0] == cross ||
            checkRightDiagonal(board, boardLength)
            && board[boardLength -1][0] == cross) {
          alert("User wins!");
        } else if (checkRow(id[0], board, boardLength) ||
                  checkColumn(id[1], board, boardLength)||
                  checkLeftDiagonal(board, boardLength) &&
                  board[0][0] == zero ||
                  checkRightDiagonal(board, boardLength)
                  && board[boardLength - 1][0] == zero){
          alert("Computer wins!");
        }
      }
      endGame();
    };
  });

  function generateRandomCoordinate(boardLength) {
    return Math.round(Math.random()* boardLength);
  }

  function selectCoordinates(x, y, board, boardLength) {
    // Count X by rows, columns and diagonals
    // rowX is an array of counts per row, where index represents row number
    var rowX = countNumberInRow(cross);

    // columnX is an array of counts per column, where index represents column number
    var columnX = countNumberInColumn(cross);

    // leftDiagonalX and rightDiagonalX is a number that represents count of X
    // on left and right diagonals respectevely
    var leftDiagonalX = countAllLeftDiagonal(cross);
    var rightDiagonalX = countAllRightDiagonal(cross);

    // Find number of all O's on board (rows, columns and diagonals)
    var rowZero = countNumberInRow(zero);
    var columnZero = countNumberInColumn(zero);
    var leftDiagonalZero = countAllLeftDiagonal(zero);
    var rightDiagonalZero = countAllRightDiagonal(zero);

    // var rowNulles = countNumberInRow(null);
    // var columnNulles = countNumberInColumn(null);
    // var leftDiagonalNull = countAllLeftDiagonal(null);
    // var rightDiagonalNull = countAllRightDiagonal(null);

    // Update number of "X" depends on "O" positions on board
    // Let's say we have 2 "X" and 1 "O" on the 1st row, then
    // we can set count of "X" and "O" to 0, none of them can win on that row.
    rowX = positionsCloseToWinRowAndColumn(rowX, rowZero)[0];
    columnX = positionsCloseToWinRowAndColumn(columnX, columnZero)[0];
    leftDiagonalX = positionsCloseToWinDiagonal(leftDiagonalX, leftDiagonalZero)[0];
    rightDiagonalX = positionsCloseToWinDiagonal(rightDiagonalX, rightDiagonalZero)[0];

    rowZero = positionsCloseToWinRowAndColumn(rowX, rowZero)[1];
    columnZero = positionsCloseToWinRowAndColumn(columnX, columnZero)[1];
    leftDiagonalZero = positionsCloseToWinDiagonal(leftDiagonalX, leftDiagonalZero)[1];
    rightDiagonalZero = positionsCloseToWinDiagonal(rightDiagonalX, rightDiagonalZero)[1];

    // hasEmptyInRowOrColumn(rowNulles)
    // hasEmptyInRowOrColumn(columnNulles)
    // hasEmptyInDiagonal(leftDiagonalNull)
    // hasEmptyInDiagonal(rightDiagonalNull)

    // Find the closiest to win position of X
    var rowXmax = Math.max.apply(Math, rowX);
    var columnXmax = Math.max.apply(Math, columnX);
    var arrayX = [rowXmax, columnXmax, leftDiagonalX, rightDiagonalX]
    var largestCountX = Math.max.apply(Math, arrayX);

    // Find the closiest to win position of O
    var rowZeroMax = Math.max.apply(Math, rowZero);
    var columnZeroMax = Math.max.apply(Math, columnZero);
    var arrayZero = [rowZeroMax, columnZeroMax, leftDiagonalZero, rightDiagonalZero]
    var largestCountZero = Math.max.apply(Math, arrayZero);

    // Compare user's and computure's 'close to win' positions and
    // assign variable accordingly
    var largestCount = largestCountX >= largestCountZero ?  largestCountX : largestCountZero;
    var row =  largestCountX >= largestCountZero ? rowX : rowZero;
    var column = largestCountX >= largestCountZero ? columnX : columnZero;
    var leftDiagonal = largestCountX >= largestCountZero ?  leftDiagonalX : leftDiagonalZero;
    var rightDiagonal = largestCountX >= largestCountZero ? rightDiagonalX : rightDiagonalZero;
    var rowMax = largestCountX >= largestCountZero ? rowXmax : rowZeroMax;
    var columnMax = largestCountX >= largestCountZero ? columnXmax : columnZeroMax;

    if (largestCount.toString() != "0" ) {
      id = generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax);
    }
    //If there is no potential to win but still there is empty row/column
    // else if(hasEmptyInRowOrColumn(rowNulles) || hasEmptyInRowOrColumn(columnNulles) || hasEmptyInDiagonal(leftDiagonalNull) || hasEmptyInDiagonal(rightDiagonalNull)){
    //   var x = generateRandomCoordinate(boardLength - 1);
    //   var y = generateRandomCoordinate(boardLength - 1);
    //
    //   while(board[x][y]!= null){
    //     x = generateRandomCoordinate(boardLength - 1);
    //     y = generateRandomCoordinate(boardLength - 1);
    //   }
    //   id = x.toString()+ y.toString();
    // }

    else {
      id = null;
    }
    return id;
  }

  // If X and O are on the same row/column
  // we don't need to count them,
  // neigher computer nor user can win
  function positionsCloseToWinRowAndColumn(x, o) {
    for (var i = 0; i < boardLength; i++) {
      if (x[i] > 0 && o[i] > 0) {
        x[i] = 0;
        o[i] = 0;
      }
    }
    return [x, o];
  }

  // If X and O are on the same row/column
  // we don't need to count them,
  // neigher computer nor user can win
  function positionsCloseToWinDiagonal(diagonalX, diagonalO) {
    if (diagonalX > 0 && diagonalO > 0) {
      diagonalX = 0;
      diagonalO = 0;
    }
    return [diagonalO, diagonalX];
  }

  // Finds entire empty row or column
  // Returns an array of count per row or column
  // If value is 4 - that means it's empty
  function hasEmptyInRowOrColumn(arrayOfEmptyPositionsCount) {
    for (var i = 0; i < boardLength; i ++) {
      if (arrayOfEmptyPositionsCount[i] > 1) {
        return true;
      }
    }
    return false;
  }

  function hasEmptyInDiagonal(countNullOnDiagonal) {
    if (countNullOnDiagonal > 1) {
      return true;
    }
    return false;
  }

  // Generates coordinates based on either X positions to prevent user from win
  // or based on O positions in order to win
  function generateCoordinates(largestCount, row, column, leftDiagonal,
                              rightDiagonal, rowMax, columnMax){
    var x, y;
    console.log("largest count " + largestCount)
    console.log("left diagonal " + leftDiagonal)

    if (largestCount.toString() == rowMax.toString()) {
      if (hasEmptyInRowOrColumn(countNumberInRow(null))) {
        x = row.indexOf(largestCount);
        y = generateRandomCoordinate(boardLength - 1);
        while (board[x][y] != null) {
          console.log("loop 1")
          y = generateRandomCoordinate(boardLength - 1);
        }
      } else if (hasEmptyInRowOrColumn(countNumberInColumn(null)) |
                hasEmptyInDiagonal(countAllRightDiagonal(null)) |
                hasEmptyInDiagonal(countAllLeftDiagonal(null))) {
        x = generateRandomCoordinate(boardLength - 1);
        y = generateRandomCoordinate(boardLength - 1);
        while (board[x][y] != null) {
          x = generateRandomCoordinate(boardLength - 1);
          y = generateRandomCoordinate(boardLength - 1);
        }
      }
    } else if (largestCount.toString() == columnMax.toString()) {
      if (hasEmptyInRowOrColumn(countNumberInColumn(null))) {
        y = column.indexOf(largestCount);
        x = generateRandomCoordinate(boardLength - 1);

        while (board[x][y] != null) {
          console.log("loop 2")

          x = generateRandomCoordinate(boardLength - 1);
        }
      } else if (hasEmptyInRowOrColumn(countNumberInRow(null)) |
                hasEmptyInDiagonal(countAllRightDiagonal(null)) |
                hasEmptyInDiagonal(countAllLeftDiagonal(null))) {
        x = generateRandomCoordinate(boardLength - 1);
        y = generateRandomCoordinate(boardLength - 1);
        while (board[x][y] != null) {
          x = generateRandomCoordinate(boardLength - 1);
          y = generateRandomCoordinate(boardLength - 1);
        }
      }
    } else if(largestCount.toString() == leftDiagonal.toString()){
      if (hasEmptyInDiagonal(countAllLeftDiagonal(null))) {
        i = generateRandomCoordinate(boardLength - 1);

        while (board[i][i]!= null) {
          console.log("loop 3")
          i = generateRandomCoordinate(boardLength - 1);
        }
        x = i;
        y = i;
      } else if (hasEmptyInRowOrColumn(countNumberInRow(null)) |
                hasEmptyInRowOrColumn(countNumberInColumn(null))) {
        x = generateRandomCoordinate(boardLength - 1);
        y = generateRandomCoordinate(boardLength - 1);
        while (board[x][y] != null) {
          x = generateRandomCoordinate(boardLength - 1);
          y = generateRandomCoordinate(boardLength - 1);
        }
      }
    } else if (largestCount.toString() == rightDiagonal.toString()) {
      if (hasEmptyInDiagonal(countAllRightDiagonal(null))) {
        i = generateRandomCoordinate(boardLength - 1);

        while (board[boardLength - i - 1][i]!= null) {
          console.log("loop 4")
          i = generateRandomCoordinate(boardLength - 1);
        }
        x = boardLength - i - 1;
        y = i;
      } else if (hasEmptyInRowOrColumn(countNumberInRow(null)) |
                hasEmptyInRowOrColumn(countNumberInColumn(null))) {
        x = generateRandomCoordinate(boardLength - 1);
        y = generateRandomCoordinate(boardLength - 1);
        while(board[x][y] != null) {
          x = generateRandomCoordinate(boardLength - 1);
          y = generateRandomCoordinate(boardLength - 1);
        }
      }
    }
    return id = x.toString() + y.toString();
  }

  function checkWin(board, x, y, boardLength) {
    if (checkRow(x, board, boardLength) ||
        checkColumn(y, board, boardLength) ||
        checkLeftDiagonal(board, boardLength) ||
        checkRightDiagonal(board, boardLength)) {
        win = true;
     return win;
    }
     return false;
   }

  function insertIntoCell(id, value) {
    board[id[0]][id[1]] = value;

    // Lets make computer think for a seconds:)
    if (game == userVsComputer && value == zero) {
      setTimeout(function() { document.getElementById(id).innerHTML = value; }, 500);
    } else {
      document.getElementById(id).innerHTML = value;
    }
  }

  function countNumberInRow(value) {
    var count = 0;
    var result = [];

    for (var i = 0; i < boardLength; i ++) {
      for (var j = 0; j < boardLength; j ++) {
        if (board[i][j] == value) {
          count ++;
        }
      }
      result.push(count)
      count = 0;
    }
    return result;
  }

  function countNumberInColumn(value) {
    var count = 0;
    var result = [];

    for (var i = 0; i < boardLength; i ++) {
      for (var j = 0; j < boardLength; j ++){
        if (board[j][i] == value) {
          count ++;
        }
      }
      result.push(count)
      count = 0;
    }
    return result;
  }

  function countAllLeftDiagonal(value) {
    var count = 0;

    for (var i = 0; i < boardLength; i ++) {
      if (board[i][i] == value) {
        count ++;
      }
    }
    return count;
  }

  function countAllRightDiagonal(value){
    var count = 0;

    for (var i = 0; i < boardLength; i ++) {
      if(board[boardLength - i - 1][i] == value) {
        count ++;
      }
    }
    return count;
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

  function endGame() {
    if (move == 18) {
      alert("Game over... It's a tie!")
      window.location.reload();
    }
  }
});
