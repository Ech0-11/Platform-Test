const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const numPlatforms = 5;

let playerX = 50;
let playerY = 50;
let playerSpeed = 5;
let gravity = 0.5;
let jumpStrength = 10;
let isJumping = false;
let yVelocity = 0;
let xVelocity = 0;
let isLeftPressed = false;
let isRightPressed = false;
let jumpCount = 0;
let maxJumps = 3;
let fallingPlatforms = new Set();
let platformTimers = new Map();
let platforms = []; // FIX: declare platforms array

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        isRightPressed = true;
    } else if (event.key === "ArrowLeft") {
        isLeftPressed = true;
    } else if (event.key === "ArrowUp" && jumpCount < maxJumps) {
        isJumping = true;
        yVelocity = -jumpStrength;
        jumpCount++;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
        isRightPressed = false;
    } else if (event.key === "ArrowLeft") {
        isLeftPressed = false;
    }
});

function generatePlatforms() {
    // FIX: collect hardcoded HTML platforms first
    document.querySelectorAll(".platform").forEach(p => platforms.push(p));

    for (let i = 0; i < numPlatforms; i++) {
        const platform = document.createElement("div");
        platform.className = "platform";
        platform.style.width = "100px";
        platform.style.height = "20px";
        platform.style.backgroundColor = "#0f0";
        platform.style.position = "absolute";
        platform.style.top = `${Math.random() * (gameArea.clientHeight - 20)}px`;
        platform.style.left = `${Math.random() * (gameArea.clientWidth - 100)}px`;
        if (Math.random() < 0.5) {
            platform.classList.add("falling");
        }
        gameArea.appendChild(platform);
        platforms.push(platform); // FIX: add to array
    }
    updateFallingPlatforms();
}

function updateFallingPlatforms() {
    document.querySelectorAll(".falling").forEach(platform => {
        fallingPlatforms.add(platform);
    });
}

function update() {
    if (isRightPressed) {
        xVelocity = playerSpeed;
    } else if (isLeftPressed) {
        xVelocity = -playerSpeed;
    } else {
        xVelocity = 0;
    }

    playerX += xVelocity;

    yVelocity += gravity;
    playerY += yVelocity;

    let onPlatform = false;
    platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.right > platformRect.left &&
            playerRect.left < platformRect.right &&
            playerRect.bottom > platformRect.top &&
            playerRect.bottom < platformRect.bottom + yVelocity
        ) {
            playerY = platformRect.top - playerRect.height;
            yVelocity = 0;
            isJumping = false;
            jumpCount = 0;
            onPlatform = true;

            if (fallingPlatforms.has(platform)) {
                const timer = platformTimers.get(platform);
                if (!timer) {
                    const timeoutId = setTimeout(() => {
                        platform.style.transition = "top 1s";
                        platform.style.top = `${platformRect.top + 200}px`;
                        setTimeout(() => platform.style.display = "none", 1000);
                    }, 3000);
                    platformTimers.set(platform, timeoutId);
                }
            }
        }
    });

    if (!onPlatform && playerY > gameArea.clientHeight - player.clientHeight) {
        playerY = gameArea.clientHeight - player.clientHeight;
        yVelocity = 0;
        isJumping = false;
        jumpCount = 0;
    }

    if (playerX < 0) playerX = 0;
    if (playerX > gameArea.clientWidth - player.clientWidth) playerX = gameArea.clientWidth - player.clientWidth;

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    requestAnimationFrame(update);
}

generatePlatforms();
update();
