const player = document.getElementById("player");
const platforms = document.querySelectorAll(".platform");

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
let maxJumps = 3; // Allow up to 3 jumps
let fallingPlatforms = new Set();

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

function update() {
    // Update horizontal movement
    if (isRightPressed) {
        xVelocity = playerSpeed;
    } else if (isLeftPressed) {
        xVelocity = -playerSpeed;
    } else {
        xVelocity = 0;
    }

    playerX += xVelocity;

    // Gravity
    yVelocity += gravity;
    playerY += yVelocity;

    // Collision detection with platforms
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

            // Trigger falling platform
            if (fallingPlatforms.has(platform)) {
                platform.style.transition = "top 1s";
                platform.style.top = `${platformRect.top + 200}px`; // Platform falls down by 200px
                setTimeout(() => platform.style.display = "none", 1000); // Platform disappears after falling
                fallingPlatforms.delete(platform); // Prevent multiple falls
            }
        }
    });

    // Check boundaries
    if (playerX < 0) playerX = 0;
    if (playerX > gameArea.clientWidth - player.clientWidth) playerX = gameArea.clientWidth - player.clientWidth;
    if (playerY > gameArea.clientHeight - player.clientHeight) {
        playerY = gameArea.clientHeight - player.clientHeight;
        yVelocity = 0;
        isJumping = false;
        jumpCount = 0;
    }

    // Update player position
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    requestAnimationFrame(update);
}

// Mark platforms as falling platforms
platforms.forEach(platform => {
    if (platform.classList.contains("falling")) {
        fallingPlatforms.add(platform);
    }
});

update();
