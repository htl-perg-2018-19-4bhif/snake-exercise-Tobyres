var ansi = require('ansi')
    , gui = ansi(process.stdout);

var keypress = require('keypress');
keypress(process.stdin);

const width = 40;
const height = 10;

var direction = "right";
var x = width / 2;
var y = height / 2;
var running = true;
var speed = 2;
var points = 0;
var appleX;
var appleY;

function paintLine(option) {
    // option == true: weiß zeichnen, sonst schwarz
    if(option){
        gui.bg.white();
    }else{
        gui.bg.grey();
    }

    for (var i = 0; i < width; i++) {
        gui
            .write(' ');
    }
    gui.bg.reset();
}

function paintGameField() {

    for (var i = 0; i < height + 2; i++) {
        gui
            .bg.grey()
            .write(' ');
        if(i === 0 || i === height + 1){
            paintLine(false);
        }else{
            paintLine(true);
        }
        gui
            .bg.grey()
            .write(' ')
            .write('\n')
            .bg.reset();
    }

    gui
        .goto(0, height + 5).write('Speed: ' + speed + '\n')
        .goto(0, height + 6).write('Points: ' + points + '\n')
        .bg.green()
        .goto(x, y).write(' ')
        .bg.reset();

}

function listen() {
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            running = false;
            process.stdin.pause();
            exitGame();
        }
        direction = key.name;
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
}

function repaintScore() {
    gui
        .goto(0, height + 3).write('Speed: ' + speed + '\n')
        .goto(0, height + 4).write('Points: ' + points + '\n');
}

function paintApple() {
    randomizeAppleCoords();
    gui.bg.red();
    gui.goto(appleX, appleY).write(' ');
    gui.reset();
}

function randomizeAppleCoords() {
    appleX = Math.floor(Math.random() * width) + 2;
    appleY = Math.floor(Math.random() * height) + 2;
}

function appleCheck() {
    if (appleX === x && appleY === y) {
        paintApple();
        speed++;
        points++;
        repaintScore();
    }
}

function checkBorder() {
    if (x <= 1 || x >= 42 || y <= 1 || y >= 12) {
        return false;
    }
    return true;
}

function exitGame() {
    gui
        .red()
        .bg.grey()
        .goto(15, 7).write(' GAME OVER ')
        .goto(0, 15).write('')
        .reset();
    process.exit();
}

function move() {
    setTimeout(function () {
        gui
            .bg.white()
            .goto(x, y).write(' ')
        switch (direction) {
            case "up":
                y--;
                break;
            case "down":
                y++;
                break;
            case "left":
                x--;
                break;
            case "right":
                x++;
                break;
        }
        gui
            .bg.green()
            .goto(x, y).write(' ')
        if (running && checkBorder()) {
            appleCheck();
            move();
        } else {
            exitGame();
        }
    }, 1000 / speed);
}

paintGameField();

paintApple();

listen();

move();