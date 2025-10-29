//---------------------------------------------------------Variable For Storing Paddles (Object In Setup)-------------------------------------------------------------//
let leftPaddle, rightPaddle; //Left & Right vertical Paddles.
let topPaddle, bottomPaddle; //Top & Bottom Horizontal Paddles.
//---------------------------------------------------Main Ball Object (Called In Draw() to update every frame)--------------------------------------------------------//
let ball; // Variable to Store Ball Object.
//-----------------------------------------------------|  Array funtion to store as many paddles we want  |-----------------------------------------------------------//
let paddles = []; //To store all the Paddles and to call their (class funtions) only once. 
//---------------------------------------------------------|  Storing Scores of Both Players  |-----------------------------------------------------------------------//
let scoreLeft = 0; //Left Player Score.
let scoreRight = 0; //Right Player Score.
//----------------------------------------------------|  Controlling Text Size of Each Text In HUD  |-----------------------------------------------------------------//
let fontSize = 220; //General Text Size.

let ballHitSound; 

let gameState = "start"; // "start", "play", "gameOver"

let gameOver = false;
let winningScore = 11;
let fontStyle;
function preload(){
  fontStyle= loadFont("Font/Decaydence.otf");
  soundFormats('mp3','wav');
  ballHitSound =loadSound("Sounds/BallHit.wav");

}

function setup() {
  // create canvas inside #game-container to keep it centered
  const container = document.getElementById('game-container');
  const cnv = createCanvas(900, 540);
  cnv.parent(container);

  // paddles
  let padLen = 140;
  let padTh = 14;

  // Player 1 color (blueish)
  let player1Color = [30, 144, 255, 180];
  // Player 2 color (orange/redish)
  let player2Color = [255, 99, 71, 180];

  // Player 1 paddles
  leftPaddle = new Paddle(30, height / 2, 'vertical', 'left', padLen, padTh, player1Color,10);
  topPaddle = new Paddle(width / 2, 30, 'horizontal', 'top', padLen, padTh, player1Color,13);

  // Player 2 paddles
  rightPaddle = new Paddle(width - 30, height / 2, 'vertical', 'right', padLen, padTh, player2Color,10);
  bottomPaddle = new Paddle(width / 2, height - 30, 'horizontal', 'bottom', padLen, padTh, player2Color,13);


  // Set movement bounds so paddles stay inside canvas
  leftPaddle.setBounds(0, width, 0, height);
  rightPaddle.setBounds(0, width, 0, height);
  topPaddle.setBounds(0, width, 0, height);
  bottomPaddle.setBounds(0, width, 0, height);

  paddles = [leftPaddle, rightPaddle, topPaddle, bottomPaddle];

  ball = new Ball(width / 2, height / 2, 10);

  textFont('Arial');
  textAlign(CENTER, CENTER);
}

function draw() {
  
  background(18, 100);
  if (gameState === "start") {
    // --- START SCREEN ---
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(60);
    textFont(fontStyle);
    text("BITHEISM PONG", width / 2, height / 2 - 40);

    textSize(18);
    fill(200,130);
    text("Press any key to start the game", width / 2, height / 2 + 20);

    noLoop(); // pause draw loop until key pressed
    return; // stop rest of code from running
  }

  // ================== GAMEPLAY ================== //

// Diagonal divider
stroke(255, 10);
strokeWeight(2);
line(0, height, width, 0);

// Border around play area
noFill();
stroke(255, 180);
strokeWeight(1);
rectMode(CORNER);
rect(0, 0, width, height);
  // controls
  handleInput();

  // update ball
  ball.update();
  ball.checkPaddles(paddles);
  ball.keepInside();

  // scoring logic
  if (ball.x - ball.r < 0 || ball.y - ball.r < 0) {
    scoreRight++;
    if (scoreRight >= winningScore) {
      gameState = "gameOver";
    }
    ball.reset(1);
  } else if (ball.x + ball.r > width || ball.y + ball.r > height) {
    scoreLeft++;
    if (scoreLeft >= winningScore) {
      gameState = "gameOver";
    }
    ball.reset(-1);
  }

   // HUD
  noStroke();
  fill(0,0,220,50);
  textSize(fontSize);
  text(`${scoreLeft}`, width * 0.25, 150);
   fill(220,0,90,50);
  text(`${scoreRight}`, width * 0.75, height-150);

  // show paddles and ball
  for (let p of paddles) p.show();
  ball.show();

 

  // ================== GAME OVER SCREEN ================== //
  if (gameState === "gameOver") {
    fill(0, 200);
    rectMode(CENTER);
    rect(width / 2, height / 2, 520, 180, 8);
    fill(255);
    textSize(28);
    let winner = scoreLeft > scoreRight ? 'Player 1' : 'Player 2';
    text(`${winner} Wins!`, width / 2, height / 2 - 18);
    textSize(14);
    text('Press  "R"  to restart', width / 2, height / 2 + 28);
    noLoop();
  }
}


function handleInput() {
  // Player 1 controls
  if (keyIsDown(87)) { // W
    leftPaddle.move(0, -1);
  } else if (keyIsDown(83)) { // S
    leftPaddle.move(0, 1);
  }
  if (keyIsDown(65)) { // A
    topPaddle.move(-1, 0);
  } else if (keyIsDown(68)) { // D
    topPaddle.move(1, 0);
  }

  // Player 2 controls
  if (keyIsDown(UP_ARROW)) {
    rightPaddle.move(0, -1);
  } else if (keyIsDown(DOWN_ARROW)) {
    rightPaddle.move(0, 1);
  }
  if (keyIsDown(LEFT_ARROW)) {
    bottomPaddle.move(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    bottomPaddle.move(1, 0);
  }
}

function keyPressed() {
  // --- START SCREEN ---
  if (gameState === "start") {
    gameState = "play";
    loop();
    return;
  }

  // --- GAME OVER ---
  if (key === 'r' || key === 'R') {
    resetGame();
  }

  if ((key === ' ' || keyCode === 32) && gameState === "gameOver") {
    gameState = "play";
    loop();
    ball.reset(random() < 0.5 ? -1 : 1);
  }
}

function resetGame() {
  scoreLeft = 0;
  scoreRight = 0;
  ball.reset(random() < 0.5 ? -1 : 1);
  leftPaddle.y = height / 2;
  rightPaddle.y = height / 2;
  topPaddle.x = width / 2;
  bottomPaddle.x = width / 2;
  gameState = "play";
  loop();
}
