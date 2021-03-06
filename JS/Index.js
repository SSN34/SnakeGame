const square = 25;
const width = 20;
const height = 20;
const gameWidth = square * width;
const gameHeight = square * height;

const dead = new Audio();
dead.src = "./Audio/dead.wav";

const eat = new Audio();
eat.src = "./Audio/eat.wav";

const canvas = document.getElementById("game-canvas");

const score = document.getElementById("score");
const level = document.getElementById("level");
canvas.setAttribute("width", gameWidth);
canvas.setAttribute("height", gameHeight);

const ctx = canvas.getContext('2d');

var alphaForGrid = "0.0";
var timeInterval = 200;

function drawGrid(){
    ctx.strokeStyle = "#cdcdcd";

    for(var i = 0; i < width; i++){
        for(var j = 0; j < height; j++){
            ctx.strokeRect(i * square, j* square, square, square);
        }
    }

    ctx.fillStyle = "#fff";
    ctx.globalAlpha = alphaForGrid;
    ctx.fillRect(0,0,gameWidth,gameHeight);
    ctx.globalAlpha = "1.0";
}

var direction = "U";
var intervalID = "";
var scoreValue = 0;

function GetFirstSnake(){
    var arr = [];
    var position = { x : Math.floor(width/2) * square, y : Math.floor(height/2) * square };
    arr.push(position);

    var nextPosition = { x: arr[0].x, y: arr[0].y + square };
    arr.push(nextPosition);

    return arr;
}

var arrSnake = GetFirstSnake();
var foodImage = new Image();
foodImage.src = "./Images/ball.png";

function messageBox(fillText, fillStyle, secondaryText = "", secondaryTextFillStyle = "#000"){
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = "0.5";
    ctx.fillRect(0, gameHeight/3, gameWidth, gameHeight/3);
    ctx.globalAlpha = "1.0";

    // new line to check GIT
    
    ctx.font = "30px Courier New";
    ctx.fillStyle = fillStyle;
    ctx.textAlign = "center";
    ctx.fillText(fillText, gameWidth/2, gameHeight/2);
    ctx.fillStyle = secondaryTextFillStyle;
    ctx.fillText(secondaryText, gameWidth/2, gameHeight/2 + 30);
}

var food = {
    image : foodImage,
    x : Math.floor((Math.random() * gameWidth/2)/square) * square,
    y : Math.floor((Math.random() * gameHeight)/square) * square
}

function initateGame(){
    drawGrid();
    drawSnake();
    messageBox("Press \'SPACEBAR\' to START", "#000", "Use Arrow Keys to PLAY!");
}

initateGame();

function drawSnake(){
    ctx.fillStyle = "#FFC432";
    ctx.strokeStyle = "#2ab";
    ctx.fillRect(arrSnake[0].x , arrSnake[0].y, square, square);
    ctx.strokeRect(arrSnake[0].x , arrSnake[0].y, square, square);

    ctx.fillStyle = "#f55";
    ctx.strokeStyle = "#2ab";
    for(var i = 1; i < arrSnake.length; i++){
        ctx.fillRect(arrSnake[i].x , arrSnake[i].y, square, square);
        ctx.strokeRect(arrSnake[i].x , arrSnake[i].y, square, square);
    }
}

var levelCount = 0;

function draw(){
    ctx.clearRect(0,0,gameWidth, gameHeight);

    var levelCheck = Math.floor(scoreValue/5);
    if(levelCheck > levelCount){
        alphaForGrid = (parseFloat(alphaForGrid) + 0.1).toString();
        levelCount = levelCount + 1;
        level.innerText = levelCount;
        if(levelCount > 7){
            if(timeInterval > 50){
                clearInterval(intervalID);
                timeInterval = timeInterval - 10;
                intervalID = setInterval(draw, timeInterval);
            }
        }
    }

    drawGrid();
    drawSnake();

    ctx.drawImage(food.image, food.x + 2.5 , food.y + 2.5 , square - 5, square - 5);

    checkFoodInteraction();
    checkSelfCollision();
    checkWallCollision();
    updateSnakePosition();
}

function updateSnakePosition(){
    var head = arrSnake.pop();

    movementDirection = { x : 0, y : 0 };

    if(direction==='U')movementDirection.y = -square;
    if(direction==='D')movementDirection.y = square;
    if(direction==='L')movementDirection.x = -square;
    if(direction==='R')movementDirection.x = square;

    var newposition = { x: arrSnake[0].x + movementDirection.x, y: arrSnake[0].y + movementDirection.y }
    
    arrSnake.unshift(newposition);
}

function gameOver(){
    clearInterval(intervalID);
    dead.play();

    var scoreText= score.innerText;  
    messageBox(scoreText + " GAME OVER", "#f00", "Press \'ENTER\' to RESTART");
}

function checkWallCollision(){
    if(arrSnake[0].x < 0 || arrSnake[0].x > (gameWidth - square) || arrSnake[0].y < 0 || arrSnake[0].y > (gameHeight - square)){
        gameOver();
    }
}

function checkFoodInteraction(){
    if(arrSnake[0].x == food.x && arrSnake[0].y == food.y){
        var tailPosition = {
            x: arrSnake[arrSnake.length - 1].x,
            y: arrSnake[arrSnake.length - 1].y
        }

        arrSnake.push(tailPosition);

        positionFood = {x: 0, y: 0}
        while(1){
            positionFood = {
                x: Math.floor((Math.random() * gameWidth)/square) * square,
                y: Math.floor((Math.random() * gameHeight)/square) * square
            }
            var foodOverSnake = false;
            for(i=0; i<arrSnake.length; i++){
                if(arrSnake[i].x == positionFood.x && arrSnake[i].y == positionFood.y){
                    var foodOverSnake = true;
                    break;
                }
            }
            if(!foodOverSnake){
                break;
            }
        }
        food.x = positionFood.x;
        food.y = positionFood.y;

        var scoreNumber = parseInt(score.innerText.split(':')[1]);
        scoreNumber = scoreNumber + 1;

        scoreValue = scoreNumber;

        eat.play();

        score.innerText = "Score:" + scoreNumber;
    }
}

function checkSelfCollision(){
    for(var i = 1; i < arrSnake.length; i++){
        if(arrSnake[0].x == arrSnake[i].x && arrSnake[0].y == arrSnake[i].y){
            gameOver();
            break;
        }
    }
}

document.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case 37:
            if(direction == "D" || direction == "U") direction = "L";
            break;
        case 38:
            if(direction == "L" || direction == "R") direction = "U";
            break;
        case 39:
            if(direction == "D" || direction == "U") direction = "R";
            break;
        case 40:
            if(direction == "L" || direction == "R") direction = "D";
            break;
        case 32:
            if(intervalID === ""){
                intervalID = setInterval(draw, timeInterval);
            }
            break;
        case 13:
            location.reload();
        default:
    }
});