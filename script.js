// Lógica do Jogo da Velha
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const modeSelect = document.getElementById('mode-select');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let mode = modeSelect ? modeSelect.value : 'human';

modeSelect && modeSelect.addEventListener('change', (e) => {
    mode = e.target.value;
    restartGame();
});

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
    renderBoard();
    if (checkWinner()) {
        statusElement.textContent = `Jogador ${currentPlayer} venceu!`;
        gameActive = false;
    } else if (board.every(cell => cell)) {
        statusElement.textContent = 'Empate!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Vez do jogador ${currentPlayer}`;
        if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
            setTimeout(aiMove, 400); // pequena pausa para UX
        }
    }
}

function aiMove() {
    // 1. Tentar vencer
    let move = findBestMove('O');
    // 2. Bloquear o adversário
    if (move === null) move = findBestMove('X');
    // 3. Jogada aleatória
    if (move === null) {
        const emptyCells = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
        if (emptyCells.length === 0) return;
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    board[move] = 'O';
    renderBoard();
    if (checkWinner()) {
        statusElement.textContent = `Jogador O venceu!`;
        gameActive = false;
    } else if (board.every(cell => cell)) {
        statusElement.textContent = 'Empate!';
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusElement.textContent = `Vez do jogador X`;
    }
}

function findBestMove(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const values = [board[a], board[b], board[c]];
        const countPlayer = values.filter(v => v === player).length;
        const countEmpty = values.filter(v => !v).length;
        if (countPlayer === 2 && countEmpty === 1) {
            const emptyIdx = pattern[values.indexOf(null)];
            return emptyIdx;
        }
    }
    return null;
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
    if (mode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 400);
    }
}

restartBtn.addEventListener('click', restartGame);

// Inicialização
restartGame();
