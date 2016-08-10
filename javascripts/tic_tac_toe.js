$(document).ready(function(){
  // Board options
  var BOARD3x3 = [[null, null, null],
                  [null, null, null],
                  [null, null, null]];
  var BOARD4x4 = [[null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null]];
  var BOARD5x5 = [[null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null]];
  var BOARD6x6 =  [[null, null, null, null, null, null],
                  [null, null, null, null, null, null],
                  [null, null, null, null, null, null],
                  [null, null, null, null, null, null],
                  [null, null, null, null, null, null],
                  [null, null, null, null, null, null]];
  var BOARD;
  var SELECTEDBOARD = null;
  var BOARDLENGTH;
  var CROSS = "X";
  var ZERO = "O";
  var MOVE;
  var WIN, NOWIN;
  var USER, COMPUTER;

  $(".user_player").click(function() {
    USER = $(this).attr("value");
    COMPUTER = USER == CROSS ? ZERO : CROSS;
    if (USER && BOARD) {
      cleanBoard();
    }
    startGame()
  });

  $(".selected_board").click(function() {
    SELECTEDBOARD = $(this).attr("value");
    if (USER && BOARD) {
      cleanBoard();
    }
    startGame()
  });

  $("#reset").click(function() {
    $(".cell").empty()
    cleanBoard();
    // location.reload();
    startGame()
  });

  // $("#start").click(function() {
  //   var boardGameExists = $(".game").children()[0] != null ? true : false;
  //   if (boardGameExists) {
  //     $(".game").empty();
  //   }
  //   start();
  // });

  function startGame() {
    if (USER && SELECTEDBOARD) {
      var boardGameExists = $(".game").children()[0] != null ? true : false;
      if (boardGameExists) {
        $(".game").empty();
        cleanBoard();
      }
      WIN = false;
      NOWIN = false;
      MOVE = 1;
      start();
    }
  }

  function cleanBoard() {
    for (var i = 0; i < BOARD.length; i ++) {
      for (var j = 0; j < BOARD.length; j ++) {
        BOARD[i][j] = null;
      }
    }
  }

  function start() {
    switch (SELECTEDBOARD) {
      case "board3x3":
      BOARD = BOARD3x3;
      break;
      case "board4x4":
      BOARD = BOARD4x4;
      break;
      case "board5x5":
      BOARD = BOARD5x5;
      break;
      case "board6x6":
      BOARD = BOARD6x6;
      break;
      default :
      null;
    }
    if (BOARD == null) {
      alert("Select board");
      return;
    }

    if (USER == null) {
      alert("Select value, please");
      return;
    }

    BOARDLENGTH = BOARD.length;

    var gameLocation = $(".game");
    var gameboard = document.createElement('div');
    var cells = document.createElement('div');
    gameboard.className = "gameboard";
    gameboard.id = SELECTEDBOARD;
    cells.className = "cells";

    gameLocation[0].appendChild(gameboard);
    gameboard.appendChild(cells);

    for (var i = 0; i < BOARD.length; i ++) {
      for (var j = 0; j < BOARD.length; j ++) {
        var cell = document.createElement('div');
        cell.id = i.toString() + j.toString();
        cell.className = "cell";
        cell.onclick = function() { play(this) };
        cell.setAttribute("value", "false");
        cells.appendChild(cell);
      }
    }
  }

  function play(that) {
    // console.log("got here")
    // console.log(that)
    // console.log(that.getAttribute("id"))

    if (WIN || NOWIN) {
      return;
    }

    var id = that.getAttribute("id");

    if (MOVE == 1 || MOVE % 2 != 0) {
      userGoes(id);
    }

    if (MOVE == 2) {
      computerGoesFirstTimeRandomly();
    }

    if (MOVE % 2 == 0 && MOVE > 3) {
      computerThinksBeforeGo(id);
    }

    checkLooseLooseSituation();
  }

  /**
   * Insert user's value into the cell and check if there is a win
   *
   * @param {id} id - cell id

   */
  function userGoes(id) {
    var row = id[0];
    var column = id[1];

    if (BOARD[row][column] == null) {
      insertIntoCell(id, USER);
      if(MOVE >= BOARDLENGTH){
        if(checkWin(row, column, USER)) {
          return;
        }
      }
      MOVE ++;
    }
  }

  /**
   * Insert computer's value into the cell (just first computer's move)
   *
   * @param {id} id - cell id

   */
  function computerGoesFirstTimeRandomly() {
    var id = generateRandomCoordinates();

    if (BOARD[id[0]][id[1]] == null) {
      insertIntoCell(id, COMPUTER);
      MOVE ++;
    }
  }

  /**
   * Insert computer's value into the cell and check if there is a win
   *
   * @param {id} id - cell id, that user clicks on
   */
  function computerThinksBeforeGo(id) {
    var id = selectCoordinates(id[0], id[1]);
    if (id != null) {
      insertIntoCell(id, COMPUTER);
      checkWin(id[0], id[1], COMPUTER)
      MOVE ++;
    }
    else {
      NOWIN = true;
    }
  }

  /**
   * Check if there is no-win situation
   * @return nothing, just alert
   */
  function checkLooseLooseSituation() {
    if (NOWIN) {
      alert("Loose-loose situation!");
      return;
    }
  }

  /**
   * Get a random number from 0 inclusively to BOARDLENGTH-1 inclusively
   *
   * @return {integer} a random integer number
   */
  function generateRandomNumber() {
    var max = BOARDLENGTH - 1;
    var min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random coordinates xy
   *
   * @return {string} a random string coordinates "xy"
   */
  function generateRandomCoordinates() {
    var row = generateRandomNumber();
    var column = generateRandomNumber();

    while (BOARD[row][column] != null) {
      row = generateRandomNumber();
      column = generateRandomNumber();
    }

    var id = row.toString() + column.toString();
    return id;
  }

  /**
   * Generate coordinates based on the positions of X or O
   *
   * @param {x} x - coordinate x of value (X or O)
   * @param {y} y - coordinate y of value (X or O)
   * @return {string} a random string coordinates "xy"
   */
  function selectCoordinates(x, y) {
    var countXRow = countNumberInRow(CROSS, ZERO).count;
    var countXColumn = countNumberInColumn(CROSS, ZERO).count;
    var leftDiagonalX = countAllLeftDiagonal(CROSS, ZERO);
    var rightDiagonalX = countAllRightDiagonal(CROSS, ZERO);

    var countZeroRow = countNumberInRow(ZERO, CROSS).count;
    var countZeroColumn = countNumberInColumn(ZERO, CROSS).count;
    var leftDiagonalZero = countAllLeftDiagonal(ZERO, CROSS);
    var rightDiagonalZero = countAllRightDiagonal(ZERO, CROSS);

    console.log("countXRow " + countXRow)
    console.log("countXColumn " + countXColumn)
    console.log("leftDiagonalX " + leftDiagonalX)
    console.log("rightDiagonalX" + rightDiagonalX)

    console.log("countZeroRow " + countZeroRow)
    console.log("countZeroColumn " + countZeroColumn)
    console.log("leftDiagonalZero " + leftDiagonalZero)
    console.log("rightDiagonalZero" + rightDiagonalZero)

    var arrayX = [countXRow, countXColumn, leftDiagonalX, rightDiagonalX]
    var arrayZero = [countZeroRow, countZeroColumn, leftDiagonalZero, rightDiagonalZero]
    var largestCountX = Math.max.apply(Math, arrayX);
    var largestCountZero = Math.max.apply(Math, arrayZero);

    if (largestCountX >= largestCountZero && largestCountX != 0) {
      var value = CROSS;
      var compareWithValue = ZERO;
      id = generateCoordinates(largestCountX, arrayX, value, compareWithValue);
    } else if (largestCountZero > largestCountX && largestCountZero != 0) {
      var value = ZERO;
      var compareWithValue = CROSS;
      id = generateCoordinates(largestCountZero, arrayZero, value, compareWithValue);

    } else if (largestCountX == 0 && largestCountZero == 0 &&
              !isEmpty(countNumberInRow(null, CROSS).count) &&
              !isEmpty(countNumberInColumn(null, CROSS).count) &&
              !isEmpty(countAllLeftDiagonal(null, CROSS)) &&
              !isEmpty(countAllRightDiagonal(null, CROSS))) {
      id = null;
    } else {
      id = generateRandomCoordinates();
    }

    return id;
  }

  /**
   * Check if row/column/diagonals is empty
   *
   * @param {value} value - count of NUll by row||column||diagonal
   * @return {bolean} true if board has empty row||column||diagonal
   */
  function isEmpty(value) {
    return value == BOARDLENGTH;
  }

  /**
   * Helper method for selectCoordinates(x, y) function
   *
   * @param {largestCount} largestCount - the largest count of X or O on the board
   * @param {array} array - array of X or O counts on the board
   * @param {value} value - value on X or O (needed to internal funcion countNumberInRow())
   * @param {compareWithValue} compareWithValue - value of O or X (the opposite to the above value)
   * @return {string} random string coordinates "xy"
   */
  function generateCoordinates(largestCount, array, value, compareWithValue){
    var x, y;

    if (largestCount.toString() == array[0].toString()) {
      // Largest count in the row
      // find row and generate random column;
      x = countNumberInRow(value, compareWithValue).coordinate;
      y = generateRandomNumber();
      while (BOARD[x][y] != null) {
        y = generateRandomNumber();
      }
    } else if (largestCount.toString() == array[1].toString()) {
      // Largest count in the column
      // find column and generate random row;
      y = countNumberInColumn(value, compareWithValue).coordinate;;
      x = generateRandomNumber();

      while (BOARD[x][y] != null) {
        x = generateRandomNumber();
      }
    } else if(largestCount.toString() == array[2].toString()){
      // Largest count in the left diagonal
      // generate random coordinate in the left diagonal;
      i = generateRandomNumber();

      while (BOARD[i][i] != null) {
        i = generateRandomNumber();
      }
      x = i;
      y = i;
    } else if (largestCount.toString() == array[3].toString()) {
      // Largest count in the right diagonal
      // generate random coordinate in the right diagonal;
      i = generateRandomNumber();

      while (BOARD[BOARDLENGTH - i - 1][i]!= null) {
        i = generateRandomNumber();
      }
      x = BOARDLENGTH - i - 1;
      y = i;
    }
    return id = x.toString() + y.toString();
  }

  /**
   * Helper method for countNumberInRow() and countNumberInColumn() functions
   *
   * @param {count} count - the largest count of X or O on the board
   * @param {coordinate} coordinate - coordinate of the largest count of X or O
   */
  function Coordinates(count, coordinate){
    this.count = count;
    this.coordinate = coordinate;
  }

  /**
   * Find the largest count of X or O by rows
   *
   * @param {value} value - the value (X or O) that need to be counted on rows
   * @param {compareWithValue} compareWithValue - the opposite (O or X) to the above value
   * @return {object} object that contains largest count of the value and its row number
   * if row contains both values - count set to 0 and coordinate to null
   */
  function countNumberInRow(value, compareWithValue) {
    var maxCount = 0;
    var finalCoordinate;

    for (var i = 0; i < BOARDLENGTH; i ++) {
      var count = 0;
      var currentCoordinate = i;

      for (var j = 0; j < BOARDLENGTH; j ++) {
        if (BOARD[i][j] == compareWithValue) {
          count = 0;
          currentCoordinate = null;
          break;
        } else if (BOARD[i][j] == value) {
          count ++;
        }
      }

      if (maxCount < count) {
        maxCount = count;
        // finalCoordinate = currentCoordinate;
        finalCoordinate = currentCoordinate;
      }
    }
    return new Coordinates(maxCount, finalCoordinate);
  }

  /**
   * Find the largest count of X or O by columns
   *
   * @param {value} value - the value (X or O) that need to be counted on the columns
   * @param {compareWithValue} compareWithValue - the opposite (O or X) to the above value
   * @return {object} object that contains largest count of the value and its column number
   * if column contains both values - count set to 0 and coordinate to null
   */
  function countNumberInColumn(value, compareWithValue) {
    var maxCount = 0;
    var finalCoordinate;

    for (var i = 0; i < BOARDLENGTH; i ++) {
      var count = 0;
      var currentCoordinate = i;

      for (var j = 0; j < BOARDLENGTH; j ++) {
        if (BOARD[j][i] == compareWithValue) {
          count = 0;
          currentCoordinate = null;
          break;
        } else if (BOARD[j][i] == value) {
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

  /**
   * Find the largest count of X or O on the left diagonal
   *
   * @param {value} value - the value (X or O) that need to be counted on the diagonal
   * @param {compareWithValue} compareWithValue - the opposite (O or X) to the above value
   * @return {integer} integer - count of X or O on the left diagonal, if diagonal contains
   * both values - returns 0
   */
  function countAllLeftDiagonal(value, compareWithValue) {
    var count = 0;

    for (var i = 0; i < BOARDLENGTH; i ++) {
      if (BOARD[i][i] == compareWithValue) {
        count = 0;
        break;
      } else if (BOARD[i][i] == value){
        count ++;
      }
    }
    return count;
  }

  /**
   * Find the largest count of X or O on the right diagonal
   *
   * @param {value} value - the value (X or O) that need to be counted on the diagonal
   * @param {compareWithValue} compareWithValue - the opposite (O or X) to the above value
   * @return {integer} integer - count of X or O on the right diagonal, if diagonal contains
   * both values - returns 0
   */
  function countAllRightDiagonal(value, compareWithValue){
    var count = 0;

    for (var i = 0; i < BOARDLENGTH; i ++) {
      if(BOARD[BOARDLENGTH - i - 1][i] == compareWithValue) {
        count = 0;
        break;
      } else if (BOARD[BOARDLENGTH - i - 1][i] == value) {
        count ++;
      }
    }
    return count;
  }

  /**
   * Insert value (X or O) in a specific cell on the board
   *
   * @param {id} id - cell's id
   * @param {value} value - the value (X or O) that has to be inserted into the cell
   */
  function insertIntoCell(id, value) {
    BOARD[id[0]][id[1]] = value;

    // Delay in computer's move, so it will insert value a bit later than
    if (value == COMPUTER) {
      setTimeout(function() { document.getElementById(id).innerHTML = value; }, 500);
    } else {
      document.getElementById(id).innerHTML = value;
    }
  }

  /**
   * Check win for the value of X or O
   *
   * @param {x} x - coordinate x on the board that user clicks on
   * @param {y} y - coordinate y on the board that user clicks on
   * @param {player} player - value (X or O)
   * @return {boolean} returns true if there is a win
   */
  function checkWin(x, y, player) {
    if (checkRow(x) ||
        checkColumn(y) ||
        checkLeftDiagonal() && BOARD[0][0] == player ||
        checkRightDiagonal() && BOARD[BOARDLENGTH - 1][0] == player) {
        WIN = true;
        alert(player + " wins!")
     return WIN;
    }
     return false;
   }


   /**
    * Check win for the value of X or O on the row
    *
    * @param {x} x - coordinate x on the board that user clicks on
    * @return {boolean} returns true row has a win combination
    */
  function checkRow(x) {
    if (BOARD[x][0] == null) {
      return false;
    }

    for (var i = 1; i < BOARDLENGTH; i ++) {
      if (BOARD[x][0] != BOARD[x][i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check win for the value of X or O on the column
   *
   * @param {y} y - coordinate y on the board that user clicks on
   * @return {boolean} returns true column has a win combination
   */
  function checkColumn(y) {
    if (BOARD[0][y] == null) {
      return false;
    }

    for (var i = 1; i < BOARDLENGTH; i ++) {
      if (BOARD[0][y] != BOARD[i][y]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check win for the value of X or O on the left diagonal
   *
   * @return {boolean} returns true left diagonal has a win combination
   */
  function checkLeftDiagonal(){
    if (BOARD[0][0] == null) {
      return false;
    }

    for (var i = 1; i < BOARDLENGTH; i ++) {
      if (BOARD[0][0] != BOARD[i][i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check win for the value of X or O on the rigth diagonal
   *
   * @return {boolean} returns true rigth diagonal has a win combination
   */
  function checkRightDiagonal() {
    if (BOARD[BOARDLENGTH - 1][0] == null) {
      return false;
    }

    for (var i = 1; i < BOARDLENGTH; i ++) {
      if (BOARD[BOARDLENGTH - 1][0] != BOARD[BOARDLENGTH - i - 1][i]) {
        return false;
      }
    }
    return true;
  }
});
