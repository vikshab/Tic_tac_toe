$(document).ready(function(){
  var game;
  var board = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
  var boardLength = board.length;
  var cross = "X";
  var zero = "O";
  var move = 1;
  var win = false;
  var nobody = false;
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
      if(win || nobody){
        return;
      }

      // Find coordinates of the cell user clicks on
      var id = $(this).attr("id");
      var row = id[0];
      var column = id[1];

      // User moves
      if(move == 1 || move % 2 != 0){
        insertIntoCell(id, cross);
      }
      move ++;

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
            nobody = true;
            alert("Nobody wins");
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
    var rowX = countXRow();
    var columnX = countXColumn();
    var leftDiagonalX = countXLeftDiagonal()
    var rightDiagonalX = countXRightDiagonal()

    // Find all O's on the board and count them
    var rowZero = countZeroRow();
    var columnZero = countZeroColumn()
    var leftDiagonalZero = countZeroLeftDiagonal();
    var rightDiagonalZero = countZeroRightDiagonal();

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

    var x;
    var y;

    // Compare user's and computure's 'close to win' positions and
    // assign variable accordingly
    var largestCount = largestCountX >= largestCountZero ?  largestCountX : largestCountZero;
    var row =  largestCountX >= largestCountZero ? rowX : rowZero;
    var column = largestCountX >= largestCountZero ? columnX : columnZero;
    var leftDiagonal = largestCountX >= largestCountZero ?  leftDiagonalX : leftDiagonalZero;
    var rightDiagonal = largestCountX >= largestCountZero ? rightDiagonalX : rightDiagonalZero;
    var rowMax = largestCountX >= largestCountZero ? rowXmax : rowZeroMax;
    var columnMax = largestCountX >= largestCountZero ? columnXmax : columnZeroMax;

    if(largestCount.toString() != "0"){
      generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax);
    }
    else{
      id = null;
    }
    return id;
  }

  function generateCoordinates(largestCount, row, column, leftDiagonal, rightDiagonal, rowMax, columnMax){
    var generatedCoordinates=[];

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

    generatedCoordinates.push(x);
    generatedCoordinates.push(y);

    id = generatedCoordinates[0].toString() + generatedCoordinates[1].toString();
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

  function checkEmptyRow(){
    var empty = false;
    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[i][j] != null){
          break;
        }
        else {
          empty=true;
        }
      }
    }
    return empty;
  }

  function checkEmptyColumn(){
    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){
        if(board[j][i] != null){
          return false;
        }
      }
    }
    return true;
  }

  function checkEmptyLeftDiagonal(){
    for(i=0; i<boardLength; i++){
      if(board[i][i]!= null){
        return false;
      }
    }
    return true;
  }

  function checkEmptyRightDiagonal(){
    for(i=0; i<boardLength; i++){
      if(board[boardLength-i-1][i] != null){
        return false;
      }
    }
    return true;
  }

  // Returns an array of integers, where index
  // corresponds to row number and value (int)
  // corresponds to X count respectevely
  function countXRow(){
    var rowCountOfX=0;
    var xCountPerRow=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){

        // if row contains O
        // we don't count X's on this row
        if(board[i][j] == zero){
          rowCountOfX = 0;
          break;
        }
        else if(board[i][j] == cross){
          rowCountOfX++;
        }
      }
      xCountPerRow.push(rowCountOfX);
      rowCountOfX=0;
    }
    return xCountPerRow;
  }

  // Returns an array of integers, where index
  // corresponds to column number and value (int)
  // corresponds to X count respectevely
  function countXColumn(){
    var columnCountOfX=0;
    var xCountPerColumn=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){

        // if column contains O
        // we don't count X's on this column
        if(board[j][i] == zero){
          columnCountOfX = 0;
          break;
        }
        else if(board[j][i] == cross){
          columnCountOfX++;
        }
      }
      xCountPerColumn.push(columnCountOfX);
      columnCountOfX=0;
    }
    return xCountPerColumn;
  }

  // Returns an integer that
  // represents X count on left diagonal
  function countXLeftDiagonal(){
    var leftDiagonalCount=0;

    for(i=0; i<boardLength; i++){

      // if left giagonal contains O
      // we don't count X's on the whole diagonal
      if(board[i][i] == zero){
        leftDiagonalCount = 0;
        break;
      }
      else if(board[i][i] == cross){
        leftDiagonalCount++;
      }
    }

    return leftDiagonalCount;
  }

  // Returns an integer that
  // represents X count on right diagonal
  function countXRightDiagonal(){
    var rightDiagonalCount=0;

    for(i=0; i<boardLength; i++){

      // if right giagonal contains O
      // we don't count X's on the whole diagonal
      if(board[boardLength-i-1][i] == zero){
        rightDiagonalCount=0
        break;
      }
      else if(board[boardLength-i-1][i] == cross){
        rightDiagonalCount++;
      }
    }
    return rightDiagonalCount;
  }

  function countZeroRow(){
    var rowCountOfZero=0;
    var zeroCountPerRow=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){

        // if row contains X
        // we don't count O's on this row
        if(board[i][j] == cross){
          rowCountOfZero = 0;
          break;
        }
        else if(board[i][j] == zero){
          rowCountOfZero++;
        }
      }
      zeroCountPerRow.push(rowCountOfZero);
      rowCountOfZero=0;
    }
    return zeroCountPerRow;
  }

  function countZeroColumn(){
    var columnCountOfZero=0;
    var zeroCountPerColumn=[];

    for(i=0; i<boardLength; i++){
      for(j=0; j<boardLength; j++){

        // if column contains X
        // we don't count O's on this column
        if(board[j][i] == cross){
          columnCountOfZero = 0;
          break;
        }
        else if(board[j][i] == zero){
          columnCountOfZero++;
        }
      }
      zeroCountPerColumn.push(columnCountOfZero);
      columnCountOfY=0;
    }
    return zeroCountPerColumn;
  }

  function countZeroLeftDiagonal(){
    var leftDiagonalCount=0;

    for(i=0; i<boardLength; i++){

      // if left giagonal contains X
      // we don't count O's on the whole diagonal
      if(board[i][i] == cross){
        leftDiagonalCount = 0;
        break;
      }
      else if(board[i][i] == zero){
        leftDiagonalCount++;
      }
    }

    return leftDiagonalCount;
  }

  function countZeroRightDiagonal(){
    var rightDiagonalCount=0;

    for(i=0; i<boardLength; i++){

      // if right giagonal contains X
      // we don't count O's on the whole diagonal
      if(board[boardLength-i-1][i] == cross){
        rightDiagonalCount=0
        break;
      }
      else if(board[boardLength-i-1][i] == zero){
        rightDiagonalCount++;
      }
    }
    return rightDiagonalCount;
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
