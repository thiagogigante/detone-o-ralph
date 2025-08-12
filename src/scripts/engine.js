const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        // enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0, 
        result: 0,
        currentTime: 30,
        lives: 5,
        gameOver:false,
        
    },
    actions: {
       timerId: null,
       countDownTimerId: null,
    }
}

let swingAudio; // música de fundo

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
  
    if(state.values.currentTime <= 0) {
        endGame(); 
        
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.5;
    audio.play();
}

function randomSquare() {
    if (state.values.gameOver) return;

    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
     randomSquare.classList.add("enemy");
     state.values.hitPosition = randomSquare.id
    
     playSound("spawn");
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.gameOver) return;

            if (square.id === state.values.hitPosition) {
               // Acertou o inimigo
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;

                // Troca imagem do inimigo sendo atingido
                square.classList.add("hit"); 
                setTimeout(() => {
                
                // Imagem do inimigo volta ao normal
                square.classList.remove("hit"); 
                }, 300);
                
                // Toca som de pancada
                playSound("hit");
                playSound("ohw");

            } else {
                // Errou o clique, perde vida
                state.values.lives--;
                document.getElementById("lives").textContent = state.values.lives;
                playSound("glass-crack");
                playSound("haha");

                if (state.values.lives <= 0) {
                 endGame();

                }    

            }
        });
    });
}

function initialize() {
    addListenerHitBox();

    swingAudio = new Audio(`./src/audios/swing.m4a`);
    swingAudio.loop = true;
    swingAudio.volume = 0.2;
    swingAudio.play();
}

// Listener do botão start:
    document.querySelector("#start-button").addEventListener("click", () => {
    document.querySelector("#start-button").style.display = "none"; // Esconde o botão


    state.actions.timerId = setInterval(randomSquare, 1400);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    playSound("imback");

    initialize(); // Inicia o jogo
});

document.body.addEventListener("mousedown", () => {
    document.body.style.cursor = "url('./src/images/hammer2.png'), auto";
});

document.body.addEventListener("mouseup", () => {
    document.body.style.cursor = "url('./src/images/hammer1.png'), auto";
});

// nova função: controle do fim de jogo:

function endGame() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.values.gameOver = true;

    if (swingAudio) {
        swingAudio.pause();
        swingAudio.currentTime = 0;
    }

    // Muda a imagem pra Ralph_fury
    if (state.values.hitPosition) {
        let enemySquare = document.getElementById(state.values.hitPosition);
        enemySquare.classList.remove("enemy");
        enemySquare.classList.add("ralph_fury");
    }
    playSound("gameover");

    document.getElementById("final-score").textContent = state.values.result;
    document.getElementById("game-over-message").classList.remove("hidden");
}

document.querySelector("#restart-button").addEventListener("click", () => {
    playSound("gooo");
    setTimeout(() => {
        location.reload();
    }, 500); // Espera o som tocar
});