// -----------------------------------
// SOUND & IMAGE VARIABLES
// -----------------------------------
let callSound;
let goDownSound;
let engineStartSound;
let isCalling = false;
let callStartTime = 0;
let callDuration = 10000;
let callPlayed = false;
let playerImg;

// -----------------------------------
// SCENE CONTROL
// -----------------------------------
let scene = 0;
let fade = 255;

// -----------------------------------
// DREAM PHONE CALL
// -----------------------------------
let playerText = "You: Bro, I’m coming to pick you up. Let’s roam around the city!";
let playerTyped = "";
let playerCharIndex = 0;
let playerTypingDone = false;

let friendText = "Friend: Ok bro, come!";
let friendTyped = "";
let friendCharIndex = 0;
let friendTypingStarted = false;
let friendTypingDone = false;

let typingSpeed = 60;
let lastCharTime = 0;

// -----------------------------------
// TRANSITION (Scene 2.5)
let transitionStart = 0;
let transitionDuration = 4000;

// -----------------------------------
// SCOOTER IGNITION (Scene 3)
let keyTurned = false;
let keyRotation = 0;

// -----------------------------------
// RIDES
let scooterX = 100;
let screen = 1;
let moveSpeed = 5;
let reachedFriend = false;

let scooter2X = 100;
let screen2 = 1;
let reachedFriend2 = false;

let scooter3X = 100;
let screen3 = 1;
let reachedFriend3 = false;

let scooter4X = 100;
let bikeX = 150;
let screen4 = 1;
let reachedCity = false;

// -----------------------------------
// REALITY SCENE
let playerCircleX, playerCircleY;
let phoneRectW = 420, phoneRectH = 140;
let phoneRectX, phoneRectY;
let callButtonX, callButtonY, callButtonR = 26;
let callButtonInitX;
let draggingCall = false;
let callAnswered = false;
let isRinging = false;
let ringStart = 0;

// -----------------------------------
// REALITY CONVERSATION
let realFriendText = "Friend: Bro, come downstairs! We're here to pick you up, let’s roam around the city!";
let realPlayerText = "You: ...I didn't come home this Diwali.";
let realFriendTyped = "";
let realFriendIndex = 0;
let realFriendDone = false;
let realPlayerTyped = "";
let realPlayerIndex = 0;
let realPlayerDone = false;
let realTypingSpeed = 40;
let realLastCharTime = 0;
let showNotification = false;
let notificationTimer = 0;
let finalFade = 0;
let finalShown = false;

// -----------------------------------
// PRELOAD
// -----------------------------------
function preload() {
  soundFormats('mp3', 'wav');
  callSound = loadSound('Sound/OutGoingCall.mp3');
  goDownSound = loadSound('Sound/WalkingDownstairs.mp3');
    engineStartSound = loadSound('Sound/ActivaStartingSound.mp3');
  playerImg = loadImage('Images/CallingFriend.jpg');
}

// -----------------------------------
// SETUP
// -----------------------------------
function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textSize(20);

  playerCircleX = width / 2;
  playerCircleY = height / 2 - 40;
  phoneRectX = width / 2 - phoneRectW / 2;
  phoneRectY = height - phoneRectH - 40;
  callButtonInitX = phoneRectX + 60;
  callButtonX = callButtonInitX;
  callButtonY = phoneRectY + phoneRectH / 2;
}

// -----------------------------------
// DRAW LOOP
// -----------------------------------
function draw() {
  background(0);

  // Scene 0: Start
  if (scene === 0) {
    fill(255);
    textSize(24);
    text("Press ENTER to call your friend", width / 2, height / 2);
    return;
  }

  // Scene 1: Fade-in to call
  if (scene === 1) {
    scene = 2;
    isCalling = true;
    callStartTime = millis();
    callPlayed = false;
    return;
  }

  // Scene 2: Dream phone call
  if (scene === 2) {
    image(playerImg, 0, 0, width, height);
    background(0, fade);
    fade -= 5;
    fill(0, 150);
    rect(100, height - 160, width - 200, 120, 20);
    fill(255);

    // Calling sound
    if (isCalling) {
      if (!callPlayed) {
        callSound.play();
        callPlayed = true;
      }

      textSize(22);
      text("Calling...", width / 2, height / 2 + 100);

      if (millis() - callStartTime > callDuration) {
        isCalling = false;
        if (callSound.isPlaying()) callSound.stop();
        lastCharTime = millis();
      }
      return;
    }

    // Typing text
    if (!playerTypingDone && millis() - lastCharTime > typingSpeed) {
      playerTyped += playerText.charAt(playerCharIndex);
      playerCharIndex++;
      lastCharTime = millis();
      if (playerCharIndex >= playerText.length) {
        playerTypingDone = true;
        setTimeout(() => {
          friendTypingStarted = true;
          lastCharTime = millis();
        }, 800);
      }
    }
    text(playerTyped, width / 2, height - 110);

    if (friendTypingStarted && !friendTypingDone && millis() - lastCharTime > typingSpeed) {
      friendTyped += friendText.charAt(friendCharIndex);
      friendCharIndex++;
      lastCharTime = millis();
      if (friendCharIndex >= friendText.length) {
        friendTypingDone = true;
        setTimeout(() => {
          scene = 2.5;
          transitionStart = millis();
          goDownSound.play();
        }, 1500);
      }
    }
    if (friendTypingStarted) text(friendTyped, width / 2, height - 70);
    return;
  }

  // Scene 2.5: Going downstairs
  if (scene === 2.5) {
    let elapsed = millis() - transitionStart;
    let fadeAmt = constrain(map(elapsed, 0, 800, 0, 255), 0, 255);
    background(0, fadeAmt);
    fill(255);
    textSize(22);
    text("...", width / 2, height / 2);

    if (!goDownSound.isPlaying() || elapsed > transitionDuration) {
      scene = 3;
    }
    return;
  }

  // --- Scene 3: Scooter ignition ---
if (scene === 3) {
  // Stop any leftover sounds
  if (goDownSound.isPlaying()) goDownSound.stop();
  if (callSound.isPlaying()) callSound.stop();

  background(30);
  fill(255);
  textSize(22);
  text("You walk downstairs...", width / 2, 100);
  text("Press SHIFT + R to start your scooter", width / 2, height - 80);

  // Draw the key and ignition
  push();
  translate(width / 2, height / 2);
  rotate(radians(keyRotation));
  fill(200);
  rect(-10, -40, 20, 80, 10);
  fill(255, 255, 0);
  ellipse(0, -40, 30, 30);
  pop();

  // If key is turned
  if (keyTurned) {
    // Play engine sound once when turning the key
    if (!engineStartSound.isPlaying() && keyRotation === 0) {
      engineStartSound.play();
    }

    if (keyRotation < 45) {
      keyRotation += 2;
    } else {
      // move to next scene after ignition finishes
      setTimeout(() => {
        scene = 4;
      }, 1000);
    }
  }
  return;
}


  // Scene 4–13 same logic
  if (scene === 4) { 
    if (engineStartSound.isPlaying()) engineStartSound.stop();

    drawFirstRide(); return; }
  if (scene === 5) { drawFriendHouse("You reached your friend's house!", "Press SPACE to pick him up", 6); return; }
  if (scene === 6) { drawSecondRide(); return; }
  if (scene === 7) { drawFriendHouse("You reached your second friend's house!", "Press SPACE to pick him up", 8); return; }
  if (scene === 8) { transitionToThirdRide(); return; }
  if (scene === 9) { drawThirdRide(); return; }
  if (scene === 10) { drawFriendHouse("You reached your third friend's house!", "Press SPACE to start riding together", 11, true); return; }
  if (scene === 11) { drawTwoVehicleRide(); return; }
  if (scene === 12) { drawRealityScene(); return; }
  if (scene === 13) { drawEndScreen(); return; }
}

// -----------------------------------
// INPUT CONTROL
// -----------------------------------
function keyPressed() {
  if (keyCode === ENTER && scene === 0) scene = 1;
  if (scene === 3 && keyCode === 82 && keyIsDown(SHIFT)) keyTurned = true;
  if ((scene === 5 || scene === 7 || scene === 10) && key === ' ') scene++;
  if (scene === 13 && keyCode === ENTER) resetGame();
}

// -----------------------------------
// RESET FUNCTION
// -----------------------------------
function resetGame() {
  scene = 0;
  fade = 255;
  keyTurned = false;
  keyRotation = 0;
  scooterX = scooter2X = scooter3X = scooter4X = 100;
  bikeX = 150;
  screen = screen2 = screen3 = screen4 = 1;
  reachedFriend = reachedFriend2 = reachedFriend3 = reachedCity = false;
  playerTyped = friendTyped = "";
  playerCharIndex = friendCharIndex = 0;
  playerTypingDone = friendTypingDone = friendTypingStarted = false;
  callButtonX = callButtonInitX;
  draggingCall = callAnswered = isRinging = false;
  ringStart = 0;
  realFriendTyped = realPlayerTyped = "";
  realFriendIndex = realPlayerIndex = 0;
  realFriendDone = realPlayerDone = false;
  showNotification = false;
  notificationTimer = 0;
  finalFade = 0;
  finalShown = false;
}

// -----------------------------------
// RIDE HELPERS
// -----------------------------------
function drawFirstRide() {
  background(60, 80, 100);
  fill(255);
  text("Press D or → to move forward", width / 2, 50);
  fill(30);
  rect(0, height - 100, width, 100);
  if (!reachedFriend && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) scooterX += moveSpeed;
  if (scooterX > width + 50 && screen < 3) { screen++; scooterX = -50; }
  else if (screen === 3 && scooterX > width / 2 && !reachedFriend) {
    reachedFriend = true; setTimeout(() => { scene = 5; }, 1500);
  }
  drawScooter(scooterX, 1);
  if (screen === 3) drawHouse("Friend's House");
}

function drawSecondRide() {
  background(60, 80, 100);
  fill(255); text("Press D or → to move forward", width / 2, 50);
  fill(30); rect(0, height - 100, width, 100);
  if (!reachedFriend2 && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) scooter2X += moveSpeed;
  if (scooter2X > width + 50 && screen2 < 3) { screen2++; scooter2X = -50; }
  else if (screen2 === 3 && scooter2X > width / 2 && !reachedFriend2) {
    reachedFriend2 = true; setTimeout(() => { scene = 7; }, 1500);
  }
  drawScooter(scooter2X, 2);
  if (screen2 === 3) drawHouse("Second Friend's House");
}

function drawThirdRide() {
  background(60, 80, 100);
  fill(255); text("Press D or → to move forward", width / 2, 50);
  fill(30); rect(0, height - 100, width, 100);
  if (!reachedFriend3 && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) scooter3X += moveSpeed;
  if (scooter3X > width + 50 && screen3 < 3) { screen3++; scooter3X = -50; }
  else if (screen3 === 3 && scooter3X > width / 2 && !reachedFriend3) {
    reachedFriend3 = true; setTimeout(() => { scene = 10; }, 1500);
  }
  drawScooter(scooter3X, 3);
  if (screen3 === 3) drawHouse("Fourth Friend's House");
}

function drawTwoVehicleRide() {
  background(70, 100, 130);
  fill(255);
  text("Press D or → to move forward", width / 2, 50);
  fill(30); rect(0, height - 100, width, 100);
  if (!reachedCity && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) { scooter4X += moveSpeed; bikeX += moveSpeed; }
  if (scooter4X > width + 50 && screen4 < 3) { screen4++; scooter4X = -50; bikeX = 0; }
  else if (screen4 === 3 && scooter4X > width / 2 && !reachedCity) {
    reachedCity = true;
    setTimeout(() => {
      scene = 12;
      callButtonX = callButtonInitX;
      draggingCall = false;
      callAnswered = false;
      isRinging = true;
      ringStart = millis();
      realFriendTyped = "";
      realFriendIndex = 0;
      realFriendDone = false;
      realPlayerTyped = "";
      realPlayerIndex = 0;
      realPlayerDone = false;
      showNotification = false;
      notificationTimer = 0;
      finalFade = 0;
      finalShown = false;
    }, 300);
  }
  drawScooter(scooter4X, 4);
  drawBike(bikeX);
  if (screen4 === 3) drawHouse("City Center");
}

function drawScooter(x, riders = 1) {
  fill(255, 0, 0);
  rect(x, height - 150, 80, 40, 10);
  fill(255, 220, 180);
  ellipse(x + 25, height - 180, 30, 30);
  if (riders >= 2) { fill(0, 200, 255); ellipse(x - 5, height - 180, 30, 30); }
  if (riders >= 3) { fill(255, 255, 0); ellipse(x - 35, height - 180, 30, 30); }
  fill(80);
  ellipse(x + 15, height - 110, 25, 25);
  ellipse(x + 65, height - 110, 25, 25);
}

function drawBike(x) {
  const roadY = height - 150;
  fill(50, 200, 50);
  rect(x + 200, roadY, 90, 40, 10);
  fill(255, 255, 0);
  ellipse(x + 230, roadY - 30, 30, 30);
  fill(255, 150, 0);
  ellipse(x + 200, roadY - 30, 30, 30);
  fill(80);
  ellipse(x + 215, roadY + 40, 25, 25);
  ellipse(x + 265, roadY + 40, 25, 25);
}

function drawHouse(label) {
  fill(200, 150, 100);
  rect(width - 250, height - 300, 200, 200);
  fill(255);
  text(label, width - 150, height - 320);
}

function drawFriendHouse(title, subtitle, nextScene, allTogether = false) {
  background(0);
  fill(255);
  textSize(26);
  text(title, width / 2, height / 2 - 50);
  if (allTogether) text("All friends are together now!", width / 2, height / 2 + 10);
  textSize(20);
  text(subtitle, width / 2, height / 2 + 50);
}

function transitionToThirdRide() {
  background(60, 80, 100);
  fill(255);
  textSize(22);
  text("Your third friend sits on the scooter...", width / 2, height / 2);
  setTimeout(() => { scene = 9; }, 1500);
}

// -----------------------------------
// REALITY SCENE
// -----------------------------------
function drawRealityScene() {
  background(18, 22, 30);
  fill(200);
  textSize(16);
  text("Bengaluru, Diwali night", width / 2, 40);

  fill(220);
  ellipse(playerCircleX, playerCircleY, 40, 40);
  fill(10, 10);
  rect(width / 2 - 120, playerCircleY + 30, 240, 20, 10);

  if (isRinging && millis() - ringStart > 800) {
    fill(30);
    stroke(90);
    strokeWeight(2);
    rect(phoneRectX, phoneRectY, phoneRectW, phoneRectH, 12);
    noStroke();
    fill(180);
    textSize(16);
    text("Incoming Call: Friend", phoneRectX + phoneRectW / 2, phoneRectY + 28);
    fill(60);
    rect(phoneRectX + 40, phoneRectY + phoneRectH - 60, phoneRectW - 80, 50, 10);
    if (!callAnswered) {
      fill(30, 200, 100);
      ellipse(callButtonX, callButtonY, callButtonR * 2, callButtonR * 2);
      fill(255);
      textSize(12);
      text("Swipe to answer →", phoneRectX + phoneRectW / 2, phoneRectY + phoneRectH - 35);
    }
  }

  if (draggingCall) {
    fill(255, 255, 255, 30);
    ellipse(callButtonX, callButtonY, callButtonR * 3, callButtonR * 3);
  }

  if (callAnswered) {
    fill(100);
    rect(phoneRectX, phoneRectY, phoneRectW, phoneRectH, 12);
    fill(255);
    textSize(16);
    text("Call connected", phoneRectX + phoneRectW / 2, phoneRectY + 28);

    if (!realFriendDone && millis() - realLastCharTime > realTypingSpeed) {
      realFriendTyped += realFriendText.charAt(realFriendIndex);
      realFriendIndex++;
      realLastCharTime = millis();
      if (realFriendIndex >= realFriendText.length) {
        realFriendDone = true;
        setTimeout(() => { realLastCharTime = millis(); }, 700);
      }
    }

    if (realFriendDone && !realPlayerDone && millis() - realLastCharTime > realTypingSpeed) {
      realPlayerTyped += realPlayerText.charAt(realPlayerIndex);
      realPlayerIndex++;
      realLastCharTime = millis();
      if (realPlayerIndex >= realPlayerText.length) {
        realPlayerDone = true;
        setTimeout(() => {
          showNotification = true;
          notificationTimer = millis();
        }, 900);
      }
    }

    fill(230);
    textSize(12);
    textAlign(LEFT, TOP);
    text(realFriendTyped, phoneRectX + 18, phoneRectY + 46, phoneRectW - 36, 100);
    text(realPlayerTyped, phoneRectX + 18, phoneRectY + 86, phoneRectW - 36, 100);
    textAlign(CENTER, CENTER);
  }

  if (showNotification) {
    fill(255);
    stroke(0);
    rect(phoneRectX + phoneRectW - 220, phoneRectY - 60, 200, 40, 8);
    noStroke();
    fill(0);
    textSize(13);
    text('My Family: "We miss you."', phoneRectX + phoneRectW - 120, phoneRectY - 40);

    if (millis() - notificationTimer > 1200) {
      finalFade += 3;
      fill(0, finalFade);
      rect(0, 0, width, height);
      if (finalFade > 200) {
        fill(255);
        textSize(20);
        text("Sometimes the loudest festivals are the quietest nights.", width / 2, height / 2);
        finalShown = true;
        scene = 13;
      }
    }
  }
}

// -----------------------------------
// END SCREEN
// -----------------------------------
function drawEndScreen() {
  if (finalShown) {
    fill(255);
    textSize(18);
    text("Press ENTER to restart", width / 2, height - 50);
  }
}

// -----------------------------------
// MOUSE INTERACTIONS
// -----------------------------------
function mousePressed() {
  if (scene === 12 && isRinging) {
    let d = dist(mouseX, mouseY, callButtonX, callButtonY);
    if (d <= callButtonR + 6) draggingCall = true;
  }
}

function mouseDragged() {
  if (scene === 12 && draggingCall) {
    let minX = phoneRectX + callButtonR + 20;
    let maxX = phoneRectX + phoneRectW - callButtonR - 20;
    callButtonX = constrain(mouseX, minX, maxX);
  }
}

function mouseReleased() {
  if (scene === 12 && draggingCall) {
    draggingCall = false;
    let threshold = phoneRectX + phoneRectW * 0.6;
    if (callButtonX >= threshold) {
      callAnswered = true;
      isRinging = false;
      realLastCharTime = millis();
      callButtonX = phoneRectX + phoneRectW + 100;
    } else {
      callButtonX = callButtonInitX;
    }
  }
}
