var fbRef, id, player, inGame;
$(function(){
  fbRef = new Firebase("https://fluidcode-tictactoe.firebaseio.com/games/");
  inGame = false;
  fbRef.on("child_added", listGames);
});

function joinGame(){
  console.log("Joined Game!");
  inGame = true;
  $("#btnCreateGame").hide();
  $("#welcome").hide();
}

function joinGameByID(gameId){
  fbRef.off("child_added", listGames);
  inGame = true;
  id = new Firebase("https://fluidcode-tictactoe.firebaseio.com/games/-" + gameId);
  player = 'O';
  id.child("players").set(2);
  id.on('value', displayGame);
}

function createGame(){
  fbRef.off("child_added", listGames);
  inGame = true;
  if(fbRef!==undefined){
    id = fbRef.push(Game, joinGame);
    player = 'X';
    id.on('value', displayGame);
  }
}

function rematch(){
    if(Game.isOver){
      Game.isOver = false;
      Game.turn = 'X';
      Game.players = 2;
      Game.tiles = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
      id.set(Game, function(Error){console.log(Error);});
      $("#btnRematch").remove();
    }
}

// TODO: Enforce Turns
function selectToe(row, col){
  if(Game.isOver)return;
  if(Game.players===2 && Game.turn == player){
    console.log("ROW " + row + " COL " + col);
    if(Game.tiles[row][col]===' '){
      Game.tiles[row][col]=player;
      Game.turn = (player==='X' ? 'O' : 'X');
      // TODO: Check win/tie here
      id.set(Game, function(Error){console.log(Error);});
    }
  }
}

function clearGames(){
  fbRef.set(null,  function(Error){console.log(Error);});
}

function checkWin(){
  var winner = -1;
  //Check horizontals
  for(var row=0;row<3;row++){
    if(Game.tiles[row][0] !== ' ' && Game.tiles[row][0]===Game.tiles[row][1] && Game.tiles[row][0]===Game.tiles[row][2]){
       return (Game.tiles[row][0] === 'X'? 1 : 2);
    }
  }
  // Check Verticals
  for(var col=0;col<3; col++){
    if(Game.tiles[0][col] !== ' ' && Game.tiles[0][col] === Game.tiles[1][col] && Game.tiles[0][col] === Game.tiles[2][col]){
      return (Game.tiles[0][col] === 'X'? 1 : 2);
    }
  }
  // Check Diagnols
  if(Game.tiles[0][0] !== ' ' && Game.tiles[0][0] === Game.tiles[1][1] && Game.tiles[0][0] === Game.tiles[2][2])
    return (Game.tiles[1][1] == 'X'? 1 : 2);
  if(Game.tiles[0][2] !== ' ' && Game.tiles[0][2] === Game.tiles[1][1] && Game.tiles[0][2] === Game.tiles[2][0])
    return (Game.tiles[1][1] === 'X'? 1 : 2);

  // Check Tie
  var emptyTiles = 0;
  for(var row=0; row<3; row++){
    for(var col=0; col<3; col++){
      if(Game.tiles[row][col] === ' ')
        emptyTiles++;
    }
  }
  if(emptyTiles===0)
    winner = 0;

  return winner;
}
function displayGame(snapshot){
  if(snapshot===null)return;
  console.log("Displaying Board...");
  console.log(snapshot.val());
  Game = snapshot.val();
  // TODO: Check for Win her
  var winner = checkWin();
  console.log("Win Check "+ winner);
  var spacer = "______";
  var board = $("#board");
  var cached = [];
  board.empty();
  switch(winner){
  case -1:
    if(Game.players===2){
      cached.push("<p>" + Game.turn + "'s Turn</p>");
    }
    else {
        cached.push("<p> Waiting for player 2 to join...</p>");
    }
    break;
  case 0: // Tie
    cached.push("<p> Tie Game...</p>");
    cached.push("<button id=\"btnRematch\" onclick=\"rematch()\" type=\"button\" class=\"btn btn-success\">Rematch</button><br>");
    Game.isOver = true;
    break;
  case 1: // X
    cached.push("<p> X Wins!!! </p>");
    cached.push("<button id=\"btnRematch\" onclick=\"rematch()\" type=\"button\" class=\"btn btn-success\">Rematch</button><br>");
    Game.isOver = true;
    break;
  case 2: // O
    cached.push("<p> O Wins!!! </p>");
    cached.push("<button id=\"btnRematch\" onclick=\"rematch()\" type=\"button\" class=\"btn btn-success\">Rematch</button><br>");
    Game.isOver = true;
    break;
  }

  for(var row = 0; row<3; row++){
    for(var col=0; col<3; col++){
      cached.push("<button onclick=\"selectToe("+row+" , " + col+")\" id=\"tile\" type=\"button\" class=\"btn btn-secondary\"> "+ Game.tiles[row][col] + " </button>");
      if(col<2)cached.push(" | ");
    }
    if(row<2){
      cached.push("<br>");
      cached.push("<span class=\"rowSpacer\">"+spacer+"</span><span class=\"rowSpacer\">"+spacer+"</span><span class=\"rowSpacer\">"+spacer+"</span>");
      cached.push("<br>");
    }
    cached.push("<br>");
  }
  board.append(cached.join(""));
}

var gamesCount = 0;
function listGames(snapshot){
  if(snapshot===null)return;
  if(snapshot.val().players === 1){
    gamesCount++;
    console.log(snapshot.val());
    var board = $("#board");
    var gameId = String(snapshot.key()).slice(1);
    var cached = [];
    cached.push("<br>  <button id=\"btnJoinGame\" onclick=\"joinGameByID(\'"+ gameId + "\')\" type=\"button\" class=\"btn btn-success\">Join Game</button><br>");
    board.append(cached.join(""));
  }
}

var Game = {
  isOver: false,
  players: 1,
  turn: 'X',
  tiles: [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
};
