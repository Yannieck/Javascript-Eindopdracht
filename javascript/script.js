const PLAYER = new Player();

const MAP = new Map(0, 0, Utilities.MAP_SCALE);

const FPV = new Renderer(PLAYER, ENEMYS);

let scores = [];

let restartBtn = null;
let firstRun = false;

function setup() {
    //Instantiate a canvas the size of the properties defined in Utilities
    createCanvas(Utilities.SCREEN_W, Utilities.SCREEN_H);
    PLAYER.updatePlayerNormals();

    setInterval(MAP.spawnEnemies, 1000);

    Utilities.generateSpawnableSpaces();
}

function draw() {
    if (PLAYER.kills >= Utilities.enemyGoal) {
        if (Utilities.currentScore == 0) Utilities.currentScore = millis();
    }

    background(0);

    //Set the volume to the volume slider
    outputVolume(document.getElementById("slider").value / 100);

    if (Utilities.currentScore == 0) {
        //Get every ray every frame
        const RAYS = RayCaster.getAllClosestRays(PLAYER);

        //Update the main FP view
        FPV.renderScene(RAYS);

        //Update and display the map when the map is enabled
        if (Utilities.DISPLAY_MINIMAP) {
            MAP.updateRays(RAYS);
            MAP.renderMinimap(RAYS, PLAYER, ENEMYS);
        }

        //Update the player position and rotation
        PLAYER.updatePlayer();

        //Crosshair
        stroke(255);
        line(
            Utilities.SCREEN_W / 2,
            Utilities.SCREEN_H / 2 + 10,
            Utilities.SCREEN_W / 2,
            Utilities.SCREEN_H / 2 - 10
        );
        line(
            Utilities.SCREEN_W / 2 + 10,
            Utilities.SCREEN_H / 2,
            Utilities.SCREEN_W / 2 - 10,
            Utilities.SCREEN_H / 2
        );

        //Weapon
        image(
            weaponImg,
            Utilities.SCREEN_W / 2 - 187,
            Utilities.SCREEN_H - 200,
            300,
            300
        );
    } else {
        //End or start of game screen
        if (firstRun) {
            //Start screen
            fill(150);
            textAlign(CENTER);
            textSize(32);
            text(
                "WELCOME TO:",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H / 2 - 80
            );
            textSize(48);
            fill(255);
            text(
                "SUPER RETRO SHOOTER 3D:",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H / 2
            );
            fill(150);
            const wave = sin(millis() / 200) + 1;
            textSize(24 + wave);
            text(
                "Press [SPACE] to start",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H - 100
            );
        } else {
            //If not the first run, then display the score
            //Get out of the pointer lock
            document.exitPointerLock();

            fill(255);
            textAlign(CENTER);
            noStroke();
            textSize(48);
            text(
                "YOU WON",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H / 2 - 20
            );
            fill(150);
            textSize(24);
            text(
                "You eliminated all the enemies",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H / 2 + 30
            );

            fill(255);
            textSize(32);
            text(
                `Score: ` + Utilities.millisToString(Utilities.currentScore),
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H / 2 + 100
            );

            fill(150);
            textSize(24);
            text(
                "Press [SPACE] to restart",
                Utilities.SCREEN_W / 2,
                Utilities.SCREEN_H - 100
            );
        }
    }
}

function mouseClicked() {
    if (Utilities.currentScore == 0) {
        PLAYER.shoot();
        testSound.play();
        document.getElementById("defaultCanvas0").requestPointerLock();
    }
}

document.addEventListener("mousemove", (e) => {
    if (Utilities.currentScore == 0) {
        PLAYER.angle += radians(e.movementX) * Utilities.ROTATION_SPEED;
    }
});

function keyPressed() {
    if (keyCode === 32 && Utilities.currentScore > 0) {
        restartGame();
    }
}

function restartGame() {
    scores.push(Utilities.currentScore);
    firstRun = false;
    document.getElementById("defaultCanvas0").requestPointerLock();
    PLAYER.kills = 0;
    Utilities.currentScore = 0;
    Utilities.spawnedEnemys = 0;
}
