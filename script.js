document.addEventListener('DOMContentLoaded', function() {
    // Estrutura para o Jogo da Velha 2.0 (macro/micro)
    // Cada célula do macro é um micro tabuleiro 3x3
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');
    const modeSelect = document.getElementById('mode-select');

    const macroBoard = Array.from({ length: 9 }, () => ({
        board: Array(9).fill(null), // micro tabuleiro
        winner: null, // 'X', 'O' ou 'E' (empate)
        finished: false
    }));
    let macroStatus = Array(9).fill(null); // 'X', 'O', 'E' (empate) ou null
    let currentPlayer = 'X';
    let gameActive = true;
    let mode = modeSelect ? modeSelect.value : 'human';

    function renderMacroBoard() {
        boardElement.innerHTML = '';
        macroBoard.forEach((micro, macroIdx) => {
            const microDiv = document.createElement('div');
            microDiv.className = 'micro-board';
            if (micro.finished) microDiv.classList.add('finished');
            // Indicação visual do vencedor do micro
            if (micro.finished && micro.winner && micro.winner !== 'E') {
                const winnerSpan = document.createElement('span');
                winnerSpan.className = 'macro-winner';
                winnerSpan.textContent = micro.winner;
                microDiv.appendChild(winnerSpan);
            }
            micro.board.forEach((cell, microIdx) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.textContent = cell || '';
                if (!micro.finished && !cell && gameActive) {
                    cellDiv.addEventListener('click', () => handleMicroCellClick(macroIdx, microIdx));
                }
                microDiv.appendChild(cellDiv);
            });
            boardElement.appendChild(microDiv);
        });
    }

    function handleMicroCellClick(macroIdx, microIdx) {
        const micro = macroBoard[macroIdx];
        if (micro.finished || micro.board[microIdx]) return;
        micro.board[microIdx] = currentPlayer;
        // Verifica vitória/empate no micro
        if (checkWinner(micro.board)) {
            micro.winner = currentPlayer;
            micro.finished = true;
            macroStatus[macroIdx] = currentPlayer;
        } else if (micro.board.every(cell => cell)) {
            micro.winner = 'E';
            micro.finished = true;
            macroStatus[macroIdx] = 'E';
        }
        // Verifica vitória/empate no macro
        if (checkWinner(macroStatus)) {
            statusElement.textContent = `Jogador ${currentPlayer} venceu o tabuleiro macro!`;
            gameActive = false;
        } else if (macroStatus.every(cell => cell)) {
            statusElement.textContent = 'Empate no tabuleiro macro!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusElement.textContent = `Vez do jogador ${currentPlayer}`;
            renderMacroBoard();
            if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
                setTimeout(aiMoveMacro, 400);
            }
            return;
        }
        renderMacroBoard();
    }

    function aiMoveMacro() {
        // IA heurística: avalia jogadas considerando vitória/bloqueio no micro e no macro
        const options = [];
        macroBoard.forEach((micro, macroIdx) => {
            if (!micro.finished) {
                micro.board.forEach((cell, microIdx) => {
                    if (!cell) {
                        let score = 0;
                        // 1. Priorizar vencer o micro
                        const tempMicro = micro.board.slice();
                        tempMicro[microIdx] = 'O';
                        let willWinMicro = false;
                        if (checkWinner(tempMicro)) {
                            score += 100;
                            willWinMicro = true;
                        }
                        // 2. Bloquear o adversário no micro
                        tempMicro[microIdx] = 'X';
                        if (checkWinner(tempMicro)) score += 80;
                        // 3. Evitar micros quase perdidos
                        const xCount = micro.board.filter(v => v === 'X').length;
                        const oCount = micro.board.filter(v => v === 'O').length;
                        if (xCount - oCount >= 2) score -= 10;
                        // 4. Priorizar vitória no macro
                        // Simula o macro após vencer o micro
                        let tempMacro = macroStatus.slice();
                        if (willWinMicro) tempMacro[macroIdx] = 'O';
                        if (checkWinner(tempMacro)) score += 1000;
                        // 5. Priorizar formar linha/coluna/diagonal no macro
                        // Conta quantos micros já vencidos pela IA em cada linha/coluna/diagonal
                        const macroWinPatterns = [
                            [0,1,2],[3,4,5],[6,7,8],
                            [0,3,6],[1,4,7],[2,5,8],
                            [0,4,8],[2,4,6]
                        ];
                        macroWinPatterns.forEach(pattern => {
                            if (pattern.includes(macroIdx)) {
                                const countO = pattern.filter(idx => (idx === macroIdx ? willWinMicro ? 'O' : macroStatus[idx] : macroStatus[idx]) === 'O').length;
                                if (countO === 2) score += 50; // formar 2 em linha
                            }
                        });
                        options.push({ macroIdx, microIdx, score });
                    }
                });
            }
        });
        if (options.length === 0) return;
        // Se houver jogada de vitória macro, faz; senão, escolhe melhor pontuada
        const maxScore = Math.max(...options.map(o => o.score));
        const bestMoves = options.filter(o => o.score === maxScore);
        let move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        handleMicroCellClick(move.macroIdx, move.microIdx);
    }

    function checkWinner(board) {
        const winPatterns = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return winPatterns.some(pattern => {
            const [a,b,c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    function restartGame() {
        for (let i = 0; i < 9; i++) {
            macroBoard[i].board = Array(9).fill(null);
            macroBoard[i].winner = null;
            macroBoard[i].finished = false;
            macroStatus[i] = null;
        }
        if (typeof restartGame.lastStarter === 'undefined') {
            restartGame.lastStarter = 'O';
        }
        currentPlayer = restartGame.lastStarter === 'X' ? 'O' : 'X';
        restartGame.lastStarter = currentPlayer;
        gameActive = true;
        statusElement.textContent = `Vez do jogador ${currentPlayer}`;
        renderMacroBoard();
        if (mode === 'ai' && currentPlayer === 'O') {
            setTimeout(aiMoveMacro, 400);
        }
    }

    modeSelect && modeSelect.addEventListener('change', (e) => {
        mode = e.target.value;
        restartGame();
    });

    restartBtn.addEventListener('click', restartGame);

    // Inicialização
    restartGame();
});
