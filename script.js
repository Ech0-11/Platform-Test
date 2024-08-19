const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

let playerX = 50;
let playerY = 50;
let playerSpeed = 5;
let gravity = 2;
let jumpStrength = 15;
let isJumping = false;
let yVelocity = 0;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        playerX += playerSpeed;
    } else if (event.key === "ArrowLeft") {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowUp" && !isJumping) {
        isJumping = true;
        yVelocity = -jumpStrength;
    }

    player.style.left = `${playerX}px`;
});

function update() {
    yVelocity += gravity;
    playerY += yVelocity;

    if (playerY > gameArea.clientHeight - player.clientHeight) {
        playerY = gameArea.clientHeight - player.clientHeight;
        isJumping = false;
        yVelocity = 0;
    }

    player.style.top = `${playerY}px`;

    requestAnimationFrame(update);
}

update();
