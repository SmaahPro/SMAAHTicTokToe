const cells = document.querySelectorAll('.cell');
const status = document.getElementById('statusIndicator');
const resetBtn = document.getElementById('reset');
const playAI = document.getElementById('playAI');
const playHuman = document.getElementById('playHuman');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

let vsAI = sessionStorage.getItem('mode') === 'human' ? false : true;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function highlightWin(c){
  c.forEach(i => cells[i].classList.add('win-cell'));
}

function checkWin(){
  for(let w of wins){
    if(board[w[0]] && board[w[0]]===board[w[1]] && board[w[0]]===board[w[2]]){
      highlightWin(w);
      return true;
    }
  }
  return false;
}

function draw(){
  return board.every(x => x !== '');
}

function updateStatus(){
  if(gameOver) return;

  if(vsAI){
    status.textContent = currentPlayer === 'X'
      ? "Your Turn"
      : "AI is thinking...";
  } else {
    status.textContent = currentPlayer + "'s Turn";
  }
}

function aiMove(){
  if(gameOver) return;

  for(let w of wins){
    let v = w.map(i=>board[i]);
    if(v.filter(x=>x==='O').length===2 && v.includes('')){
      move(w[v.indexOf('')]); return;
    }
  }

  for(let w of wins){
    let v = w.map(i=>board[i]);
    if(v.filter(x=>x==='X').length===2 && v.includes('')){
      move(w[v.indexOf('')]); return;
    }
  }

  let empty = board.map((v,i)=>v===''?i:null).filter(x=>x!==null);
  move(empty[Math.floor(Math.random()*empty.length)]);
}

function move(i){
  if(board[i]!=='' || gameOver) return;

  board[i]=currentPlayer;
  cells[i].textContent=currentPlayer;

  if(checkWin()){
    gameOver=true;

    if(vsAI){
      status.textContent = currentPlayer==='O' ? "AI Wins!" : "You Win!";
    } else {
      status.textContent = currentPlayer==='X' ? "X Wins!" : "O Wins!";
    }

  } else if(draw()){
    status.textContent = "Draw!";
    gameOver=true;

  } else {
    currentPlayer = currentPlayer==='X'?'O':'X';
    updateStatus();

    if(vsAI && currentPlayer==='O'){
      setTimeout(aiMove, 500);
    }
  }
}

function reset(){
  board = Array(9).fill('');
  cells.forEach(c=>{
    c.textContent='';
    c.classList.remove('win-cell');
  });
  currentPlayer='X';
  gameOver=false;
  updateStatus();
}

cells.forEach((c,i)=>{
  c.onclick = ()=>{
    if(vsAI && currentPlayer==='O') return;
    move(i);
  }
});

resetBtn.onclick = reset;

playAI.onclick = ()=>{
  vsAI=true;
  sessionStorage.setItem('mode','ai');
  reset();
};

playHuman.onclick = ()=>{
  vsAI=false;
  sessionStorage.setItem('mode','human');
  reset();
};

// load
window.onload = updateStatus;