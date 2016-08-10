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
    computer = player == cross ? zero : cross;
  });

  $(".cell").click(function() {
    if (win || noWin) {
      return;
    }

    var id = $(this).attr("id");

    if (move == 1 || move % 2 != 0) {
      userGoes(id);
    }

    if (move == 2) {
      computerGoesFirstTimeRandomly();
    }

    if (move % 2 == 0 && move > 3) {
      computerThinksBeforeGo(id, board);
    }

    checkLooseLooseSituation();
  });

  /**
   * Insert user's value into the cell and check if there is a win
   *
   * @param {id} id - cell id

   */
  function userGoes(id) {
    var row = id[0];
    var column = id[1];

    if (board[row][column] == null) {
      insertIntoCell(id, player);
      if(move >= boardLength){
        checkWin(row, column, player);
      }
      move ++;
    }
  }

  /**
   * Insert computer's value into the cell (just first computer's move)
   *
   * @param {id} id - cell id

   */
  function computerGoesFirstTimeRandomly() {
    var id = generateRandomCoordinates();

    if (board[id[0]][id[1]] == null) {
      insertIntoCell(id, computer);
      move ++;
    }
  }

  /**
   * Insert computer's value into the cell and check if there is a win
   *
   * @param {id} id - cell id, that user clicks on
   * @param {board} board - game board (array)
   */
  function computerThinksBeforeGo(id, board) {
    var id = selectCoordinates(id[0], id[1]);
    if (id != null) {
      insertIntoCell(id, computer);
      checkWin(id[0], id[1], computer)
      move ++;
    }
    else {
      noWin = true;
    }
  }

  /**
   * Check if there is no-win situation
   * @return nothing, just alert
   */
  function checkLooseLooseSituation() {
    if (noWin) {
      alert("Loose-loose situation!");
      return;
    }
  }

  /**
   * Get a random number from 0 inclusively to boardLength-1 inclusively
   *
   * @return {integer} a random integer number
   */
  function generateRandomNumber() {
    var max = boardLength - 1;
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

    while (board[row][column] != null) {
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
    return value == boardLength;
  }

  /**
   * Helper method for selectCoordinates(x, y) function
   *
   * @param {largestCount} largestCount - the largest count of X or O on the board
   * @param {array} array - array of X or O counts on the board
   * @param {value} value - value on X or O (needed to internal funcion countNumberInRow())
   * @param {compareWithValue} compareWithValue - value of O or X (the opposite to the above value)
   * @return {string} a random string coordinates "xy"
   */
  function generateCoordinates(largestCount, array, value, compareWithValue){
    var x, y;

    if (largestCount.toString() == array[0].toString()) {
      // Largest count in the row
      // find row and generate random column;
      x = countNumberInRow(value, compareWithValue).coordinate;
      y = generateRandomNumber();
      while (board[x][y] != null) {
        y = generateRandomNumber();
      }
    } else if (largestCount.toString() == array[1].toString()) {
      // Largest count in the column
      // find column and generate random row;
      y = countNumberInColumn(value, compareWithValue).coordinate;;
      x = generateRandomNumber();

      while (board[x][y] != null) {
        x = generateRandomNumber();
      }
    } else if(largestCount.toString() == array[2].toString()){
      // Largest count in the left diagonal
      // generate random coordinate in the left diagonal;
      i = generateRandomNumber();

      while (board[i][i] != null) {
        i = generateRandomNumber();
      }
      x = i;
      y = i;
    } else if (largestCount.toString() == array[3].toString()) {
      // Largest count in the right diagonal
      // generate random coordinate in the right diagonal;
      i = generateRandomNumber();

      while (board[boardLength - i - 1][i]!= null) {
        i = generateRandomNumber();
      }
      x = boardLength - i - 1;
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

  /**
   * Insert value (X or O) in a specific cell on the board
   *
   * @param {id} id - cell's id
   * @param {value} value - the value (X or O) that has to be inserted into the cell
   */
  function insertIntoCell(id, value) {
    board[id[0]][id[1]] = value;

    // Lets make computer think for a seconds:)
    if (value == computer) {
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
        checkLeftDiagonal() && board[0][0] == player ||
        checkRightDiagonal() && board[boardLength - 1][0] == player) {
        win = true;
        alert(player + " wins!")
     return win;
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

  /**
   * Check win for the value of X or O on the column
   *
   * @param {y} y - coordinate y on the board that user clicks on
   * @return {boolean} returns true column has a win combination
   */
  function checkColumn(y) {
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

  /**
   * Check win for the value of X or O on the left diagonal
   *
   * @return {boolean} returns true left diagonal has a win combination
   */
  function checkLeftDiagonal(){
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

  /**
   * Check win for the value of X or O on the rigth diagonal
   *
   * @return {boolean} returns true rigth diagonal has a win combination
   */
  function checkRightDiagonal() {
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
