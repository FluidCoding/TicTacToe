var fbRef, id, player;
$(function(){
  fbRef = new Firebase("https://fluidcode-tictactoe.firebaseio.com/games/");
  fbRef.on("child_added", listGames);
});

function joinGame(){
  console.log("Joined Game!");
  $("#btnCreateGame").hide();
  $("#welcome").hide();
}

function joinGameByID(gameId){
  fbRef.off("child_added", listGames);
  id = new Firebase("https://fluidcode-tictactoe.firebaseio.com/games/-" + gameId);
  player = 'O';
  id.child("players").set(2);
  id.on('value', displayGame);
}

function createGame(){
  fbRef.off("child_added", listGames);
  if(fbRef!==undefined){
    id = fbRef.push(Game, joinGame);
    player = 'X';
    id.on('value', displayGame);
  }
}

function rematch(){
    if(!Game.isOver){
      Game.isOver = false;
      Game.turn = 'X';
      Game.players = 2;
      Game.tiles = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
      id.set(Game, function(Error){console.log(Error);});
    }
}

// TODO: Enforce Turns
function selectToe(row, col){
  console.log(Game.turn == player);
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
    for(var )
  }
  // Check Verticals

  // Check Diagnols

  // Check Tie

}
function displayGame(snapshot){
  if(snapshot===null)return;
  console.log("Displaying Board...");
  console.log(snapshot.val());
  Game = snapshot.val();
  // TODO: Check for Win her
  var winner = checkWin();
  var spacer = "______";
  var board = $("#board");
  var cached = [];
  board.empty();
  if(Game.players===2){
    cached.push("<p>" + Game.turn + "'s Turn</p>");
  }
  else {
    cached.push("<p> Waiting for player 2 to join...</p>");
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
var count = 0;
function listGames(snapshot){
  if(snapshot===null)return;
  count++;
  console.log(snapshot.val());
  var board = $("#board");
  var gameId = String(snapshot.key()).slice(1);
  var cached = [];
  cached.push("<br>  <button id=\"btnJoinGame\" onclick=\"joinGameByID(\'"+ gameId + "\')\" type=\"button\" class=\"btn btn-success\">Join Game</button><br>");
  board.append(cached.join(""));
}

var Game = {
  isOver: false,
  players: 1,
  turn: 'X',
  tiles: [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
};
