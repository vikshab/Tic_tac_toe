$(document).ready(function(){
  var BOARD;
  var SELECTEDBOARD;
  var BOARDLENGTH;
  var CROSS = "X";
  var ZERO = "O";
  var MOVE;
  var WIN, NOWIN;
  var USER, COMPUTER;
  var USERSCOLOR, COMPUTERSCOLOR;

  /**
   * @summary Set up the value.
   */
  $(".user_player").click(function() {
    USER = $(this).attr("value");
    startGame();
  });

  /**
   * @summary Set up the board size.
   */
  $(".selected_board").click(function() {
    SELECTEDBOARD = $(this).attr("value");
    startGame();
  });

  /**
   * @summary Reset existing game.
   */
  $("#reset").click(function() {
    $(".cell").empty();
    startGame();
  });

  /**
   * @summary Set up the color for user.
   */
  $(".user_color").click(function() {
    USERSCOLOR = $(this).attr("value");
  });

  /**
   * @summary Set up the color for computer.
   */
  $(".computer_color").click(function() {
    COMPUTERSCOLOR = $(this).attr("value");
  });

  /**
   * @summary Set up the game configuration.
   */
  function startGame() {

    // Cells need to be emptied every time user either switches to a new board size
    // or reset existing game (so that array's values were null)
    if (USER && BOARD) {
      emptyCells();
    }

    // When user selects value and board size (or just switching between different board sizes)
    // We want to draw a new board
    if (USER && SELECTEDBOARD) {

      // before a new board will be drawn the old one must be deleted (if it exists)
      var boardGameExists = $(".game").children()[0] != null ? true : false;
      if (boardGameExists) {
        $(".game").empty();
      }
      drawBoard();
      setUpValues();
    }
  }

  /**
   * @summary Empties cells of the game board (rolls back values of array to null).
   */
  function emptyCells() {
    for (var i = 0; i < BOARD.length; i ++) {
      for (var j = 0; j < BOARD.length; j ++) {
        BOARD[i][j] = null;
      }
    }
  }

  /**
   * @summary Draws the game board.
   */
  function drawBoard() {
    BOARD = [];

    // Set up the board size
    switch (SELECTEDBOARD) {
    case "board3x3":
          BOARDLENGTH = 3;
          break;
    case "board4x4":
          BOARDLENGTH = 4;
          break;
    case "board5x5":
          BOARDLENGTH = 5;
          break;
    case "board6x6":
          BOARDLENGTH = 6;
          break;
    default:
          null;
    }

    // Append 'gameboard' div to 'game' div
    var gameLocation = $(".game");
    var gameboard = document.createElement('div');
    var cells = document.createElement('div');
    gameboard.className = "gameboard";
    gameboard.id = SELECTEDBOARD;
    cells.className = "cells";

    // Append 'cells' div to "gameboard" div
    gameLocation[0].appendChild(gameboard);
    gameboard.appendChild(cells);

    // Append 'cell' div to 'cells' div
    for (var i = 0; i < BOARDLENGTH; i ++) {
      for (var j = 0; j < BOARDLENGTH; j ++) {
        var cell = document.createElement('div');
        cell.id = i.toString() + j.toString();
        cell.className = "cell";
        cell.onclick = function() { play(this) };
        cell.setAttribute("value", "false");
        cells.appendChild(cell);
      }
      BOARD.push([]);
    }
  }

  /**
   * @summary Sets up the Global variables for the game,
   * we need to set them up every time user changes game configuration.
   */
  function setUpValues() {
    BOARDLENGTH = BOARD.length;
    WIN = false;
    NOWIN = false;
    MOVE = 1;
    COMPUTER = USER == CROSS ? ZERO : CROSS;
  }

  /**
   * @summary Play function triggers every time user clicks on the cell.
   *
   * @param {object} that Div(cell) that user clicks on.
   */
  function play(that) {


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
   * @summary Insert user's value into the cell and check if there is a win.
   *
   * @param {string} id Cell's id.

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
   * @summary Insert computer's value into the cell (just first computer's move).
   */
  function computerGoesFirstTimeRandomly() {
    var id = generateRandomCoordinates();

    if (BOARD[id[0]][id[1]] == null) {
      insertIntoCell(id, COMPUTER);
      MOVE ++;
    }
  }

  /**
   * @summary Insert computer's value into the cell and check if there is a win.
   *
   * @param {string} id Cell's id, that user clicks on.
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
   * @summary Check if there is no-win situation.
   * @return nothing, just alert
   */
  function checkLooseLooseSituation() {
    if (NOWIN) {
      $("#game_name").addClass("animated infinite bounce")
      alert("Loose-loose situation!");
      return;
    }
  }

  /**
   * @summary Get a random number from 0 inclusively to BOARDLENGTH-1 inclusively.
   *
   * @return {integer} Random number
   */
  function generateRandomNumber() {
    var max = BOARDLENGTH - 1;
    var min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @summary Generate random coordinates xy.
   *
   * @return {string} Random coordinates "xy"
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
   * @summary Generate coordinates based on the positions of X or O.
   *
   * @param {string} x Coordinate x of value.
   * @param {string} y Coordinate y of value.
   * @return {string} Random coordinates "xy"
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
   * @summary Check if row/column/diagonals is empty.
   *
   * @param {integer} value Count of NUll by row||column||diagonal.
   * @return {bolean} True if board has empty row||column||diagonal.
   */
  function isEmpty(value) {
    return value == BOARDLENGTH;
  }

  /**
   * @summary Helper method for selectCoordinates(x, y) function.
   *
   * @param {integer} largestCount The largest count of X or O on the board.
   * @param {object} array Array of X or O counts on the board.
   * @param {string} value Value on X or O (needed to internal funcion countNumberInRow()).
   * @param {string} compareWithValue Value of O or X (the opposite to the above value).
   * @return {string} Random string coordinates "xy".
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
   * @summary Helper method for countNumberInRow() and countNumberInColumn() functions.
   *
   * @param {integer} count The largest count of X or O on the board.
   * @param {integer} coordinate Coordinate of the largest count of X or O.
   */
  function Coordinates(count, coordinate){
    this.count = count;
    this.coordinate = coordinate;
  }

  /**
   * @summary Find the largest count of X or O by rows.
   *
   * @param {string} value The value (X or O) that need to be counted on rows.
   * @param {string} compareWithValue The opposite (O or X) to the above value.
   * @return {object} Object that contains largest count of the value and its row number
   * if row contains both values - count set to 0 and coordinate to null.
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
        finalCoordinate = currentCoordinate;
      }
    }
    return new Coordinates(maxCount, finalCoordinate);
  }

  /**
   * @summary Find the largest count of X or O by columns.
   *
   * @param {string} value The value (X or O) that need to be counted on the columns.
   * @param {string} compareWithValue The opposite (O or X) to the above value.
   * @return {object} object that contains largest count of the value and its column number
   * if column contains both values - count set to 0 and coordinate to null.
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
   * @summary Find the largest count of X or O on the left diagonal.
   *
   * @param {string} value The value (X or O) that need to be counted on the diagonal.
   * @param {string} compareWithValue The opposite (O or X) to the above value.
   * @return {integer} Count of X or O on the left diagonal, if diagonal contains
   * both values - returns 0.
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
   * @summary Find the largest count of X or O on the right diagonal.
   *
   * @param {string} value The value (X or O) that need to be counted on the diagonal.
   * @param {string} compareWithValue The opposite (O or X) to the above value.
   * @return {integer} Count of X or O on the right diagonal, if diagonal contains
   * both values - returns 0.
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
   * @summary Insert value (X or O) in a specific cell on the board.
   *
   * @param {string} id Cell's id.
   * @param {string} value The value (X or O) that has to be inserted into the cell.
   */
  function insertIntoCell(id, value) {
    BOARD[id[0]][id[1]] = value;
    var div = document.getElementById(id);

    // Delay in computer's move, so it will insert value a bit later than
    if (value == COMPUTER) {
      // div.setAttribute("value", true);
      setTimeout(function() { div.innerHTML = value; }, 500);
      setTimeout(function() { $(div).addClass("color" + COMPUTERSCOLOR); }, 500);
    } else {
      div.innerHTML = value;
      // div.setAttribute("value", true);
      // var div = document.getElementById(id);
      $(div).addClass("color" + USERSCOLOR);
    }
  }

  /**
   * @summary Check win for the value of X or O.
   *
   * @param {string} x Coordinate x on the board that user clicks on.
   * @param {string} y Coordinate y on the board that user clicks on.
   * @param {string} player User's or Computer's value.
   * @return {boolean} True if there is a win on the board.
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
    * @summary Check win for the value of X or O on the row.
    *
    * @param {string} x Coordinate x on the board that user clicks on.
    * @return {boolean} True if row has a win combination.
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
   * @summary Check win for the value of X or O on the column.
   *
   * @param {string} y Coordinate y on the board that user clicks on.
   * @return {boolean} True if column has a win combination.
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
   * @summary Check win for the value of X or O on the left diagonal.
   *
   * @return {boolean} True is left diagonal has a win combination.
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
   * @summary Check win for the value of X or O on the rigth diagonal.
   *
   * @return {boolean} True if rigth diagonal has a win combination.
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
