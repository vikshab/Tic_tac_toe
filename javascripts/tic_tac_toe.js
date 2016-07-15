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
    // Find all X's on the board and count them
    var rowX = countRow(cross);
    var columnX = countColumn(cross);
    var leftDiagonalX = countLeftDiagonal(cross)
    var rightDiagonalX = countRightDiagonal(cross)

    // Find all O's on the board and count them
    var rowZero = countRow(zero);
    var columnZero = countColumn(zero)
    var leftDiagonalZero = countLeftDiagonal(zero);
    var rightDiagonalZero = countRightDiagonal(zero);

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
    console.log("rows columns and diagonals")
    console.log(rowX)
    console.log(columnX)
    console.log(leftDiagonalX)
    console.log(rightDiagonalX)
    console.log(rowZero)
    console.log(columnZero)
    console.log(leftDiagonalZero)
    console.log(rightDiagonalZero)
    console.log("largest count x and zero")
    console.log(largestCountX)
    console.log(largestCountZero)
    console.log(largestCount)


    // If there is a potential to win- generate coordinates based on either X or O positions
    if(largestCount.toString() != "0" ){
      id = generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax);
    }
    //If there is no potential to win but still there is empty row/column
    else if(emptyRow() || emptyColumn() || emptyLeftDiagonal() || emptyRightDiagonal()){
      var x = generateRandomCoordinate(boardLength-1);
      var y = generateRandomCoordinate(boardLength-1);

      while(board[x][y]!= null){
        x = generateRandomCoordinate(boardLength-1);
        y = generateRandomCoordinate(boardLength-1);
      }

      id = x.toString()+ y.toString();
    }
    else{
      id=null;
    }

    return id;
  }

  function generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax){
    var x, y;

    if(largestCount.toString() == rowMax.toString()){
      x = row.indexOf(largestCount);
      y = generateRandomCoordinate(boardLength-1);

      while(board[x][y]!= null){
        console.log("1")
        y = generateRandomCoordinate(boardLength-1);
      }
    }
    else if(largestCount.toString() == columnMax.toString()){
      y = column.indexOf(largestCount);
      x = generateRandomCoordinate(boardLength-1);

      while(board[x][y]!= null){
        console.log("2")

        x = generateRandomCoordinate(boardLength-1);
      }
    }
    else if(largestCount.toString() == leftDiagonal.toString()){
      i = generateRandomCoordinate(boardLength-1);

      while(board[i][i]!= null){
        console.log("3")

        i = generateRandomCoordinate(boardLength-1);
      }
      x = i;
      y = i;
    }
    else if(largestCount.toString() == rightDiagonal.toString()){
      i = generateRandomCoordinate(boardLength-1);

      while(board[boardLength-i-1][i]!= null){
        console.log("4")

        i = generateRandomCoordinate(boardLength-1);
      }
      x = boardLength-i-1;
      y = i;
    }
    return id = x.toString() + y.toString();
    console.log(id)
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

  function emptyRow(){
    var countNull=0;
    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[i][j] != null){
          break;
        }
        else{
          countNull++;
          console.log(countNull)
        }
      }
      if(countNull == boardLength){
        return true;
      }
      countNull=0;
    }
    return false;
  }

  function emptyColumn(){
    var countNull=0;
    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[j][i] != null){
          break;
        }
        else{
          countNull++;
        }
      }
      if(countNull == boardLength){
        return true;
      }
      countNull=0;
    }
    return false;
  }

  function emptyLeftDiagonal(){
    var countNull=0;
    for(i=0; i<boardLength; i++){
      if(board[i][i]!= null){
        break;
      }
      else{
        countNull++;
      }
    }
    if(countNull == boardLength){
      return true;
    }
    return false;
  }

  function emptyRightDiagonal(){
    var countNull=0;
    for(i=0; i<boardLength; i++){
      if(board[boardLength-i-1][i] != null){
        break;
      }
      else{
          countNull++;
      }
    }
    if(countNull == boardLength){
      return true;
    }
    return false;
  }

  // Returns an array of integers, where index
  // corresponds to row number and value (int)
  // represents count of X or O
  function countRow(value){
    var countPerRow=0;
    var allRows=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[i][j] != value && board[i][j] != null ){
          countPerRow = 0;
          break;
        }
        else if(board[i][j] == value){
          countPerRow++;
        }
      }
      allRows.push(countPerRow);
      countPerRow=0;
    }
    return allRows;
  }

  // Returns an array of integers, where index
  // corresponds to column number and value (int)
  // represents count of X or O
  function countColumn(value){
    var countPerColumn=0;
    var allColumns=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[j][i] != value && board[j][i] != null ){
          countPerColumn = 0;
          break;
        }
        else if(board[j][i] == value){
          countPerColumn++;
        }
      }
      allColumns.push(countPerColumn);
      countPerColumn=0;
    }
    return allColumns;
  }

  // Returns an integer that
  // represents count of X or O on left diagonal
  function countLeftDiagonal(value){
    var count=0;

    for(i=0; i<boardLength; i++){
      if(board[i][i] != value && board[i][i] != null){
        count = 0;
        break;
      }
      else if(board[i][i] == value){
        count++;
      }
    }
    return count;
  }

  // Returns an integer that
  // represents count of X or O on right diagonal
  function countRightDiagonal(value){
    var count=0;

    for(i=0; i<boardLength; i++){
      if(board[boardLength-i-1][i] != value && board[boardLength-i-1][i] != null){
        count=0
        break;
      }
      else if(board[boardLength-i-1][i] == value){
        count++;
      }
    }
    return count;
  }

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
