document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const livesDisplay = document.getElementById('lives');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameWinModal = document.getElementById('game-win-modal');
    const restartButton = document.getElementById('restart-button');
    const winRestartButton = document.getElementById('win-restart-button');
    const playerNameLost = document.getElementById('player-name-lost');
    const playerNameWon = document.getElementById('player-name-won');
    const startGameButton = document.getElementById('start-game-button');
    const playerNameInput = document.getElementById('player-name');
    let playerName = '';
    let lives = 10;
    const totalBoxes = 20;
    const imageCount = 5;
    let foundLuxGym = 0;
    const luxgymImage = 'CL.png';
    let selectedBoxes = [];
    let gameOver = false;
    let startTime, endTime;

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function initGame() {
        gameBoard.innerHTML = '';
        selectedBoxes = [];
        foundLuxGym = 0;
        lives = 10;
        livesDisplay.textContent = lives;
        gameOver = false;
        startTime = new Date();

        while (selectedBoxes.length < imageCount) {
            let randomNum = Math.floor(Math.random() * totalBoxes);
            if (!selectedBoxes.includes(randomNum)) {
                selectedBoxes.push(randomNum);
            }
        }

        for (let i = 0; i < totalBoxes; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-id', i);
            box.addEventListener('click', handleClick);
            gameBoard.appendChild(box);
        }
    }

    function handleClick(event) {
        if (gameOver) return;

        const box = event.target;
        const boxId = parseInt(box.getAttribute('data-id'));

        if (selectedBoxes.includes(boxId)) {
            box.innerHTML = `<img src="${luxgymImage}" alt="LuxGym" class="luxgym-image">`;
            box.style.backgroundColor = 'white';
            foundLuxGym++;
            checkWin();
        } else {
            box.innerHTML = 'X';
            box.style.backgroundColor = 'transparent';
            loseLife();
        }

        box.removeEventListener('click', handleClick);
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = lives;

        const corazonImg = document.querySelector('.corazon');
        corazonImg.classList.add('pulsar');

        setTimeout(() => {
            corazonImg.classList.remove('pulsar');
        }, 500);

        if (lives === 0) {
            endGame();
        }
    }

    function checkWin() {
        if (foundLuxGym === imageCount) {
            winGame();
        }
    }

    function endGame() {
        gameOver = true;

        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box, index) => {
            if (selectedBoxes.includes(index)) {
                box.innerHTML = `<img src="${luxgymImage}" alt="LuxGym" class="luxgym-image">`;
                box.style.backgroundColor = 'white';
            } else {
                box.innerHTML = 'X';
                box.style.backgroundColor = 'transparent';
            }
        });

        const resultado = calcularPuntaje();
        enviarPuntaje(playerName, resultado.puntaje, resultado.corazones, resultado.tiempo);
        obtenerRanking();

        playerNameLost.textContent = playerName;
        gameOverModal.style.display = 'flex';
    }

    function winGame() {
        gameOver = true;

        const resultado = calcularPuntaje();
        enviarPuntaje(playerName, resultado.puntaje, resultado.corazones, resultado.tiempo);
        obtenerRanking();

        playerNameWon.textContent = playerName;
        gameWinModal.style.display = 'flex';
    }

    restartButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        initGame();
    });

    winRestartButton.addEventListener('click', () => {
        gameWinModal.style.display = 'none';
        initGame();
    });

    playerNameInput.addEventListener('input', function () {
        playerName = playerNameInput.value.trim();
        startGameButton.disabled = playerName === '';
    });

    startGameButton.addEventListener('click', function () {
        const welcomeModal = document.getElementById('welcome-modal');
        if (playerName !== '') {
            playerName = capitalizeFirstLetter(playerName);
            welcomeModal.style.display = 'none';
            initGame();
        }
    });

    window.onload = function () {
        const welcomeModal = document.getElementById('welcome-modal');
        welcomeModal.style.display = 'flex';
        obtenerRanking(); // Muestra ranking apenas inicia
    };

    // Calcular puntaje
    function calcularPuntaje() {
        endTime = new Date();
        const tiempoEnSegundos = Math.floor((endTime - startTime) / 1000);
        const puntaje = (lives * 100) + (1000 - tiempoEnSegundos * 10);
        return {
            puntaje: Math.max(puntaje, 0),
            tiempo: tiempoEnSegundos,
            corazones: lives
        };
    }

    // Enviar puntaje al backend
    function enviarPuntaje(nombre, puntaje, corazones, tiempo) {
        fetch('http://localhost:3000/api/ranking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                puntaje,
                corazones_restantes: corazones,
                tiempo
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Puntaje guardado correctamente:', data);
        })
        .catch(err => {
            console.error('Error al guardar puntaje:', err);
        });
    }

    // Obtener ranking del backend
    function obtenerRanking() {
        fetch('http://localhost:3000/api/ranking')
            .then(res => res.json())
            .then(data => {
                const tabla = document.getElementById('tabla-ranking');
                if (tabla) {
                    tabla.innerHTML = data.map((jugador, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${jugador.nombre}</td>
                            <td>${jugador.puntaje}</td>
                            <td>${jugador.corazones_restantes}</td>
                            <td>${jugador.tiempo}s</td>
                        </tr>
                    `).join('');
                }
            });
    }
});
