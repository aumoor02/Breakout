"use strict";

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;     // horizontal velocity
let dy = -2;    // vertical velocity
let ballRadius = 10;

// paddle variables
const paddleHeight = 15;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;     // sets paddles x position

let rightPressed = false;
let leftPressed = false;

// brick variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;

// will loop through the rows and columns and create the new bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// event controls
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Mouse Controls caused the game to be buggy
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;            // e.clientX provides the horizontal coordinate within the application's viewport
    if (relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}




// collision detection for ball impacting bricks


function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];                     // stores brick object
            if (b.status === 1) {
            // if the x position of ball > x position of brick, etc.
                if (x > b.x && 
                    x < b.x + brickWidth && 
                    y > b.y && 
                    y < b.y + brickHeight) { 
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();                     // acts as a refresh button after the alert button is clicked
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}




function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}





function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}





function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
            
        }
    }
}





function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);     // sets the actual text to be drawn on the canvas and where
}




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // To clear you need the top left corner of the square and the bottom right - need to clear so the previous image disappears
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    
    // bouncing off right and left edges
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        // reverses horizontal direction
        dx = -dx;
    }
    // bouncing off top edge
    if (y + dy < ballRadius ) {
        // reverses vertical direction
        dy = -dy;
    } else if (y + dy + paddleHeight > canvas.height - ballRadius ) {           // ends game if ball hits bottom edge (added paddleHeight so ball can bounce off paddle instead of going through)
        if (x > paddleX && x < paddleX + paddleWidth) {                         // if ball lands between paddlex and width, ball reverses direction
            dy = -dy;
        } else {
            alert('GAME OVER!');
            document.location.reload();
            clearInterval(interval);
        }

    }


    // moves paddle but paddle can move off canvas
    // if (rightPressed) {
    //     paddleX += 7;
    // } else if (leftPressed) {
    //     paddleX -= 7;
    // }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {             // paddle stays fully in canvas
        paddleX = Math.min(paddleX + 4, canvas.width - paddleWidth);        // returns the smallest number given as input parameters - either allows the paddle to move or stops at edge
    } else if (leftPressed && paddleX > 0) {
        paddleX = Math.max(paddleX - 4, 0);                                 // returns the largest number given as input parameters - either allows the paddle to move or stops at edge
    }

    // sets velocity of ball by assigning the value of horizontal movement to 2 and vertical movement to 2
    x += dx;
    y += dy;
    
}



//draw();



const interval = setInterval(draw, 10);                                // This will redraw the ball every 10 ms





















// Rectangle, Circle, and Rectangle Outline Examples

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = '#FF0000';
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
// ctx.stroke();
// ctx.closePath();

