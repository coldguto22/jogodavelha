// Lógica do Jogo da Velha
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = cell || '';
        cellDiv.addEventListener('click', () => handleCellClick(idx));
        boardElement.appendChild(cellDiv);
    });
}

function handleCellClick(idx) {
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    if (checkWinner()) {
        statusElement.textContent = `Jogador ${currentPlayer} venceu!`;
        gameActive = false;
    } else if (board.every(cell => cell)) {
        statusElement.textContent = 'Empate!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Vez do jogador ${currentPlayer}`;
    }
    renderBoard();
}

function checkWinner() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8], // linhas
        [0,3,6],[1,4,7],[2,5,8], // colunas
        [0,4,8],[2,4,6]          // diagonais
    ];
    return winPatterns.some(pattern => {
        const [a,b,c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function restartGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = `Vez do jogador ${currentPlayer}`;
    renderBoard();
}

restartBtn.addEventListener('click', restartGame);

// Inicialização
restartGame();
