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

  $(".game_version").click(function(){
    game = $(this).attr("value");
  });

  $(".cell").click(function(){
    // if(game == userVsUser){
    //   if(win){
    //     return;
    //   }
    //   var id = $(this).attr("id");
    //   var row = id[0];
    //   var column = id[1];
    //   var player;
    //
    //   if(board[row][column] == null){
    //     if(move == 1 || move % 2 != 0){
    //       player = cross;
    //       insertIntoCell(id, cross);
    //     }
    //     else if (move % 2 == 0){
    //       player = zero;
    //       insertIntoCell(id, zero);
    //     }
    //
    //     if(move >= 4){
    //       checkWin(board, row, column, boardLength, player)
    //     }
    //     move ++;
    //   }
    //   endGame();
    // }

    if(game == userVsComputer){
      if(win || noWin){
        return;
      }

      // Find coordinates of the cell user clicks on
      var id = $(this).attr("id");
      var row = id[0];
      var column = id[1];

      // User moves
      if(board[row][column] == null){
        if(move == 1 || move % 2 != 0){
          insertIntoCell(id, cross);
        }
        move ++;
      }
      // First computer's move is random
      if(move == 2){
        var x = generateRandomCoordinate(boardLength-1);
        var y = generateRandomCoordinate(boardLength-1);

        while(board[x][y]!= null){
          x = generateRandomCoordinate(boardLength-1);
          y = generateRandomCoordinate(boardLength-1);
        }

        id = x.toString()+ y.toString();
        insertIntoCell(id, zero);
        move ++;
      }

      if(move >= boardLength){
        // Computer moves
        if(move % 2 == 0){
          var id = selectCoordinates(row, column, board, boardLength)
          if(id != null){
            insertIntoCell(id, zero);
            move ++;
          }
          else{
            noWin = true;
            alert("Loose-loose situation!");
            return;
          }
        }

        // Check if user or computer wins
        // For now user cannot win - something to work on later
        if(checkRow(row, board, boardLength) ||
          checkColumn(column, board, boardLength)||
          checkLeftDiagonal(board, boardLength) && board[0][0] == cross ||
          checkRightDiagonal(board, boardLength) && board[boardLength -1][0] == cross){
          alert("User wins!")
        }
        else if(checkRow(id[0], board, boardLength) ||
          checkColumn(id[1], board, boardLength)||
          checkLeftDiagonal(board, boardLength) && board[0][0] == zero ||
          checkRightDiagonal(board, boardLength) && board[boardLength -1][0] == zero){
          alert("Computer wins!")
        }
      }
      endGame();
    };
  });

  function generateRandomCoordinate(boardLength){
    return Math.round(Math.random()* boardLength);
  }

  function selectCoordinates(x, y, board, boardLength){
    var rowX = countAllRow()[0];
    var rowZero = countAllRow()[1];
    var rowNulles = countAllRow()[2];
    var columnX = countAllColumn()[0];
    var columnZero = countAllColumn()[1];
    var columnNulles = countAllColumn()[2];
    var leftDiagonalX = countAllLeftDiagonal()[0];
    var leftDiagonalZero = countAllLeftDiagonal()[1];
    var leftDiagonalNull = countAllLeftDiagonal()[2];
    var rightDiagonalX = countAllRightDiagonal()[0];
    var rightDiagonalZero = countAllRightDiagonal()[1];
    var rightDiagonalNull = countAllRightDiagonal()[2];

    console.log("before")
    // console.log(rowX)
    // console.log(rowZero)
    // console.log(rowNulles)
    // console.log(columnX)
    // console.log(columnZero)
    // console.log(columnNulles)
    console.log(leftDiagonalX)
    console.log(leftDiagonalZero)
    console.log(leftDiagonalNull)
    // console.log(rightDiagonalX)
    // console.log(rightDiagonalZero)
    // console.log(rightDiagonalNull)

    positionsCloseToWinRowAndColumn(rowX, rowZero);
    positionsCloseToWinRowAndColumn(columnX, columnZero);
    positionsCloseToWinDiagonal(leftDiagonalX, leftDiagonalZero)
    positionsCloseToWinDiagonal(rightDiagonalX, rightDiagonalZero)

    findEmptyRowAndColumn(rowNulles)
    findEmptyRowAndColumn(columnNulles)
    findEmptyDiagonal(leftDiagonalNull)
    findEmptyDiagonal(rightDiagonalNull)

    console.log("after")
    // console.log(rowX)
    // console.log(rowZero)
    // console.log(rowNulles)
    // console.log(columnX)
    // console.log(columnZero)
    // console.log(columnNulles)
    console.log(leftDiagonalX)
    console.log(leftDiagonalZero)
    console.log(leftDiagonalNull)
    // console.log(rightDiagonalX)
    // console.log(rightDiagonalZero)
    // console.log(rightDiagonalNull)

    // if(leftDiagonalX > 0 && leftDiagonalZero > 0){
    //   leftDiagonalX = 0;
    //   leftDiagonalZero = 0;
    // }


    // Count null only if entire diagonal is empty
    // if(leftDiagonalNull < boardLength){
    //   leftDiagonalNull = 0;
    // }

    // If diagonal has X and O, we don't need to count them,
    // neigher computer nor user can win

    // if(rightDiagonalX > 0 && rightDiagonalZero > 0){
    //   rightDiagonalX = 0;
    //   rightDiagonalZero = 0;
    // }

    // Count null only if entire diagonal is empty
    // if(rightDiagonalNull < boardLength){
    //   rightDiagonalNull = 0;
    // }

    // Find position where user is close to win
    var rowXmax = Math.max.apply(Math, rowX);
    var columnXmax = Math.max.apply(Math, columnX);
    var arrayX = [rowXmax, columnXmax, leftDiagonalX, rightDiagonalX]
    var largestCountX = Math.max.apply(Math, arrayX);

    // Find positions where computer is close to win
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

    if(largestCount.toString() != "0" ){
      console.log("largest Count != 0")
      id = generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax);
    }
    //If there is no potential to win but still there is empty row/column
    // else if(emptyRow() || emptyColumn() || emptyLeftDiagonal() || emptyRightDiagonal()){
    //   var x = generateRandomCoordinate(boardLength-1);
    //   var y = generateRandomCoordinate(boardLength-1);
    //
    //   while(board[x][y]!= null){
    //     x = generateRandomCoordinate(boardLength-1);
    //     y = generateRandomCoordinate(boardLength-1);
    //   }
    //
    //   id = x.toString()+ y.toString();
    // }

    else{
      console.log("largest Count != 0 ELSE")

      id=null;
    }

    return id;
  }

  // If X and O are on the same row/column
  // we don't need to count them,
  // neigher computer nor user can win
  function positionsCloseToWinRowAndColumn(x, o){
    for(i=0; i<boardLength; i++){
      if(x[i] > 0 && o[i] > 0){
        x[i]=0;
        o[i]=0;
      }
    }
  }

  // If X and O are on the same row/column
  // we don't need to count them,
  // neigher computer nor user can win
  function positionsCloseToWinDiagonal(diagonalX, diagonalO){
    if(diagonalX > 0 && diagonalO > 0){
      diagonalX = 0;
      diagonalO = 0;
    }
    return diagonalO, diagonalX
  }

  // Finds entire empty row or column
  // Returns an array of count per row or column
  // If value is 4 - that means it's empty
  function findEmptyRowAndColumn(arrayOfEmptyPositionsCount){
    for(i=0; i<boardLength; i++){
      if(arrayOfEmptyPositionsCount[i] < boardLength){
        arrayOfEmptyPositionsCount[i] = 0;
      }
    }
    return arrayOfEmptyPositionsCount;
  }

  function findEmptyDiagonal(countNullOnDiagonal){
    if(countNullOnDiagonal < boardLength){
      countNullOnDiagonal = 0;
    }
    return countNullOnDiagonal;
  }

  // Generates coordinates based on either X positions to prevent user from win
  // or based on O positions in order to win
  function generateCoordinates(largestCount, row, column, leftDiagonal,
                              rightDiagonal, rowMax, columnMax){
    var x, y;

    if(largestCount.toString() == rowMax.toString()){
      x = row.indexOf(largestCount);
      y = generateRandomCoordinate(boardLength-1);

      while(board[x][y]!= null){
        y = generateRandomCoordinate(boardLength-1);
      }
    }
    else if(largestCount.toString() == columnMax.toString()){
      y = column.indexOf(largestCount);
      x = generateRandomCoordinate(boardLength-1);

      while(board[x][y]!= null){
        x = generateRandomCoordinate(boardLength-1);
      }
    }
    else if(largestCount.toString() == leftDiagonal.toString()){
      i = generateRandomCoordinate(boardLength-1);

      while(board[i][i]!= null){
        i = generateRandomCoordinate(boardLength-1);
      }
      x = i;
      y = i;
    }
    else if(largestCount.toString() == rightDiagonal.toString()){
      i = generateRandomCoordinate(boardLength-1);

      while(board[boardLength-i-1][i]!= null){
        i = generateRandomCoordinate(boardLength-1);
      }
      x = boardLength-i-1;
      y = i;
    }
    return id = x.toString() + y.toString();
  }

  function checkWin(board, x, y, boardLength){
    if(checkRow(x, board, boardLength) ||
     checkColumn(y, board, boardLength) ||
     checkLeftDiagonal(board, boardLength) ||
     checkRightDiagonal(board, boardLength)){
     win = true;
     return win;
    }
     return false;
   }

  function insertIntoCell(id, value){
    board[id[0]][id[1]] = value;

    // Lets make computer think for a seconds:)
    if(game == userVsComputer && value == zero){
      setTimeout(function(){ document.getElementById(id).innerHTML = value; }, 500);
    }
    else{
      document.getElementById(id).innerHTML = value;
    }
  }

  // Returns an array of arrays
  // Each array is a count of values X, O and null respectevely
  // Array of value shows the count of the value on each row
  function countAllRow(){
    var countX=0;
    var countO=0;
    var countEmpty=0;

    var allcountX=[]
    var allcountO=[]
    var allcountEmpty=[]

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[i][j] == cross){
          countX++;
        }
        else if(board[i][j] == zero){
          countO++;
        }
        else if(board[i][j] == null){
          countEmpty++;
        }
      }
      allcountX.push(countX)
      allcountO.push(countO)
      allcountEmpty.push(countEmpty)

      countX=0;
      countO=0;
      countEmpty=0;
    }
    return [allcountX, allcountO, allcountEmpty];
  }

  // Returns an array of arrays
  // Each array is a count of values X, O and null respectevely
  // Array of value shows the count of the value on each column
  function countAllColumn(){
    var countX=0;
    var countO=0;
    var countEmpty=0;

    var allcountX=[]
    var allcountO=[]
    var allcountEmpty=[]

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[j][i] == cross){
          countX++;
        }
        else if(board[j][i] == zero){
          countO++;
        }
        else if(board[j][i] == null){
          countEmpty++;
        }
      }
      allcountX.push(countX)
      allcountO.push(countO)
      allcountEmpty.push(countEmpty)

      countX=0;
      countO=0;
      countEmpty=0;
    }
    return [allcountX, allcountO, allcountEmpty];
  }

  // Returns an array with count of values X, O and null on left diagonal
  function countAllLeftDiagonal(){
    var countX=0;
    var countO=0;
    var countEmpty=0;

    for(i=0; i<boardLength; i++){
      if(board[i][i] == cross){
        countX++;
      }
      else if(board[i][i] == zero){
        countO++;
      }
      else if(board[i][i] == null){
        countEmpty++;
      }
    }
    return [countX, countO, countEmpty];
  }

  // Returns an array with count of values X, O and null on right diagonal
  function countAllRightDiagonal(){
    var countX=0;
    var countO=0;
    var countEmpty=0;

    for(i=0; i<boardLength; i++){
      if(board[boardLength-i-1][i] == cross){
        countX++;
      }
      else if(board[i][i] == zero){
        countO++;
      }
      else if(board[i][i] == null){
        countEmpty++;
      }
    }
    return [countX, countO, countEmpty];
  }

  // Check if the row has a win
  function checkRow(x, board, boardLength){
    if(board[x][0] == null){
      return false;
    }

    for(i=1; i<boardLength; i++){
      if(board[x][0]!= board[x][i]){
        return false;
      }
    }
    return true;
  }

  // Check if the column has a win
  function checkColumn(y, board, boardLength){
    if(board[0][y] == null){
      return false;
    }

    for(i=1; i<boardLength; i++){
      if(board[0][y]!=board[i][y]){
        return false;
      }
    }
    return true;
  }

  // Check if the left diagonal has a win
  function checkLeftDiagonal(board, boardLength, player){
    if(board[0][0] == null){
      return false;
    }

    for(i=1; i<boardLength; i++){
      if(board[0][0]!= board[i][i]){
        return false;
      }
    }
    return true;
  }

  // Check if the right diagonal has a win
  function checkRightDiagonal(board, boardLength){
    if(board[boardLength-1][0] == null){
      return false;
    }

    for(i=1; i<boardLength; i++){
      if(board[boardLength-1][0]!= board[boardLength-i-1][i]){
        return false;
      }
    }
    return true;
  }

  function endGame(){
    if(move == 18){
      alert("Game over... It's a tie!")
      window.location.reload();
    }
  }
});
