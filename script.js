document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const livesDisplay = document.getElementById('lives');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameWinModal = document.getElementById('game-win-modal');
    const restartButton = document.getElementById('restart-button');
    const winRestartButton = document.getElementById('win-restart-button');
    const playerNameLost = document.getElementById('player-name-lost');  // Para el modal de derrota
    const playerNameWon = document.getElementById('player-name-won');    // Para el modal de victoria
    const startGameButton = document.getElementById('start-game-button');
    const playerNameInput = document.getElementById('player-name'); // Input de nombre
    let playerName = ''; // Nombre del jugador
    let lives = 10;  // Vidas iniciales
    const totalBoxes = 20;
    const imageCount = 5;
    let foundLuxGym = 0;  // Contador de cuadros LuxGym encontrados
    const luxgymImage = 'LUXGYM.png'; // Cambia esto a la ruta correcta de la imagen
    let selectedBoxes = [];
    let gameOver = false;

    // Función para capitalizar la primera letra
    function capitalizeFirstLetter(string) {
        if (!string) return ''; // Verificar si la cadena está vacía
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Iniciar el juego
    function initGame() {
        gameBoard.innerHTML = ''; // Limpiar el tablero
        selectedBoxes = [];
        foundLuxGym = 0;
        lives = 10;
        livesDisplay.textContent = lives;
        gameOver = false;

        // Generar las posiciones de los cuadros ganadores de manera aleatoria
        while (selectedBoxes.length < imageCount) {
            let randomNum = Math.floor(Math.random() * totalBoxes);
            if (!selectedBoxes.includes(randomNum)) {
                selectedBoxes.push(randomNum);
            }
        }

        // Crear los 20 cuadros
        for (let i = 0; i < totalBoxes; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-id', i);
            box.addEventListener('click', handleClick);
            gameBoard.appendChild(box);
        }
    }

    // Manejar los clics en los cuadros
    function handleClick(event) {
        if (gameOver) return;

        const box = event.target;
        const boxId = parseInt(box.getAttribute('data-id'));

        if (selectedBoxes.includes(boxId)) {
            // Si es una imagen de LuxGym, mostrarla y seguir jugando
            box.innerHTML = `<img src="${luxgymImage}" alt="LuxGym" class="luxgym-image">`;
            box.style.backgroundColor = 'white';
            foundLuxGym++;  // Aumentar el contador de cuadros LuxGym encontrados
            checkWin();  // Verificar si el jugador ha ganado
        } else {
            // Si es una X, perder una vida
            box.innerHTML = 'X';
            box.style.backgroundColor = 'transparent';
            loseLife();
        }
        box.removeEventListener('click', handleClick); // Evitar que se pueda volver a hacer clic en el mismo cuadro
    }
    function loseLife() {
        lives--;  // Restar una vida
        livesDisplay.textContent = lives;  // Actualizar el contador de vidas
    
        // Agregar el efecto al corazón
        const corazonImg = document.querySelector('.corazon');
        corazonImg.classList.add('pulsar'); // Agregar la clase de animación
    
        // Quitar la clase después de la animación para que se pueda volver a aplicar
        setTimeout(() => {
            corazonImg.classList.remove('pulsar');
        }, 500); // Tiempo que dura la animación (debe coincidir con la duración de la animación en CSS)
    
        if (lives === 0) {
            endGame();  // Terminar el juego si las vidas llegan a 0
        }
    }
    
    function checkWin() {
        if (foundLuxGym === imageCount) {
            winGame();  // Si se han encontrado los 5 cuadros LuxGym, el jugador gana
        }
    }
    function endGame() {
        gameOver = true;
    
        // Mostrar todas las imágenes y las "X" en los cuadros
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box, index) => {
            if (selectedBoxes.includes(index)) {
                box.innerHTML = `<img src="${luxgymImage}" alt="LuxGym" class="luxgym-image">`;
                box.style.backgroundColor = 'white'; // Asegúrate de que el fondo sea transparente
            } else {
                box.innerHTML = 'X';
                box.style.backgroundColor = 'white'; // Asegúrate de que el fondo sea transparente
            }
        });
    
        playerNameLost.textContent = playerName;  // Mostrar el nombre del jugador en el modal de derrota
        gameOverModal.style.display = 'flex';  // Mostrar el modal de derrota
    }
    
    function winGame() {
        gameOver = true;
        playerNameWon.textContent = playerName;  // Mostrar el nombre del jugador en el modal de victoria
        gameWinModal.style.display = 'flex';  // Mostrar el modal de victoria
    }

    // Reiniciar el juego cuando el usuario haga clic en "Volver a jugar" (derrota)
    restartButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';  // Ocultar el modal
        initGame();  // Reiniciar el juego
    });

    // Reiniciar el juego cuando el usuario haga clic en "Volver a jugar" (victoria)
    winRestartButton.addEventListener('click', () => {
        gameWinModal.style.display = 'none';  // Ocultar el modal de victoria
        initGame();  // Reiniciar el juego
    });

    // Habilitar o deshabilitar el botón de jugar según el input
    playerNameInput.addEventListener('input', function() {
        playerName = playerNameInput.value.trim();
        startGameButton.disabled = playerName === '';
    });

    // Manejar el evento de clic en el botón "Jugar"
    startGameButton.addEventListener('click', function() {
        const welcomeModal = document.getElementById('welcome-modal');
        if (playerName !== '') {
            playerName = capitalizeFirstLetter(playerName); // Capitalizar la primera letra
            welcomeModal.style.display = 'none'; // Ocultar el modal de bienvenida
            initGame(); // Iniciar el juego
        }
    });

    // Inicializar el juego por primera vez (después del nombre)
    window.onload = function() {
        const welcomeModal = document.getElementById('welcome-modal');
        welcomeModal.style.display = 'flex'; // Mostrar el modal de bienvenida
    };
});
