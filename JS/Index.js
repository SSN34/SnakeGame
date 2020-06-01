const square = 25;
const width = 20;
const height = 20;
const gameWidth = square * width;
const gameHeight = square * height;

const centrePosition ={
    x : Math.floor(width/2) * square,
    y : Math.floor(height/2) * square
};
const canvas = document.getElementById("game-canvas");

const score = document.getElementById("score");
canvas.setAttribute("width", gameWidth);
canvas.setAttribute("height", gameHeight);

const ctx = canvas.getContext('2d');

function drawGrid(){
    ctx.strokeStyle = "#cdcdcd";

    for(var i = 0; i < width; i++){
        for(var j = 0; j < height; j++){
            ctx.strokeRect(i * square, j* square, square, square);
        }
    }
}

var direction = "U";
var intervalID = "";

function GetFirstSnake(){
    var arr = [];
    var position = centrePosition;
    arr.push(position);

    var nextPosition = {
        x: centrePosition.x,
        y: centrePosition.y + square
    };
    arr.push(nextPosition);

    return arr;
}

var arrSnake = GetFirstSnake();
var foodImage = new Image();
foodImage.src = "./Images/ball.png";

var food = {
    image : foodImage,
    x : Math.floor((Math.random() * gameWidth)/square) * square,
    y : Math.floor((Math.random() * gameHeight)/square) * square
}

function initateGame(){
    drawGrid();

    ctx.fillStyle = "#f55";
    ctx.strokeStyle = "#2ab"
    for(var i = 0; i < arrSnake.length; i++){
        ctx.fillRect(arrSnake[i].x , arrSnake[i].y, square, square);
        ctx.strokeRect(arrSnake[i].x , arrSnake[i].y, square, square);
    }
    
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = "0.5";
    ctx.fillRect(0, gameHeight/3, gameWidth, gameHeight/3);
    ctx.globalAlpha = "1.0";
    
    ctx.font = "30px Courier New";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("Press \'SpaceBar\' to START", gameWidth/2, gameHeight/2);
}

initateGame();

function draw(){
    ctx.clearRect(0,0,gameWidth, gameHeight);

    drawGrid();

    ctx.fillStyle = "#f55";
    ctx.strokeStyle = "#2ab"
    for(var count = 0; count < arrSnake.length; count++){
        ctx.fillRect(arrSnake[count].x , arrSnake[count].y, square, square);
        ctx.strokeRect(arrSnake[count].x , arrSnake[count].y, square, square);
    }

    ctx.drawImage(food.image, food.x + 2.5 , food.y + 2.5 , square - 5, square - 5);

    checkFoodInteraction();

    checkSelfCollision();

    checkWallCollision();
    
    updateSnakePosition();
}

function updateSnakePosition(){
    var head = arrSnake.pop();

    movementDirection = {
        x : 0,
        y : 0
    };

    switch(direction){
        case 'U':
            movementDirection.y = -square;
            break;
        case 'D':
            movementDirection.y = square;
            break;
        case 'L':
            movementDirection.x = -square;
            break;
        case 'R':
            movementDirection.x = square;
            break;
        default:
    }

    var newposition = {
        x: arrSnake[0].x + movementDirection.x,
        y: arrSnake[0].y + movementDirection.y,
    }
    
    arrSnake.unshift(newposition);
}

function gameOver(){
    clearInterval(intervalID);

    ctx.globalAlpha = "0.5";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,gameWidth,gameHeight);
    ctx.globalAlpha = "1.0";

    ctx.font = "30px Courier New";
    ctx.fillStyle = "#f00";
    ctx.textAlign = "center";
    var scoreText= score.innerText;  
    ctx.fillText(scoreText + "\n GAME OVER", gameWidth/2, gameHeight/2);
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

        food.x = Math.floor((Math.random() * gameWidth)/square) * square;
        food.y = Math.floor((Math.random() * gameHeight)/square) * square;

        var scoreNumber = parseInt(score.innerText.split(':')[1]);
        scoreNumber = scoreNumber + 1;

        score.innerText = "Score:" + scoreNumber;
    }
}

function checkSelfCollision(){
    for(var i = 1; i < arrSnake.length; i++){
        if(arrSnake[0].x == arrSnake[i].x && arrSnake[0].y == arrSnake[i].y){
            gameOver();
        }
    }
}

document.addEventListener("keyup", function(event){
    switch(event.keyCode){
        case 37:
            if(direction == "D" || direction == "U"){
                direction = "L";
            }
            break;
        case 38:
            if(direction == "L" || direction == "R"){
                direction = "U";
            }
            break;
        case 39:
            if(direction == "D" || direction == "U"){
                direction = "R";
            }
            break;
        case 40:
            if(direction == "L" || direction == "R"){
                direction = "D";
            }
            break;
        case 32:
            score.style.display = "block";
            intervalID = setInterval(draw, 200);
            break;
        default:
    }
});