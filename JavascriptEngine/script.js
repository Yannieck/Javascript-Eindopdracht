const PLAYER = new Player();
const MAP = new Map(0, 0, Utilities.MAP_SCALE);

const FPV = new FirstPersonView(PLAYER, ENEMYS);
let enemyImg;

function preload() {
    enemyImg = loadImage("https://i.imgur.com/jtyrAXY.png");
}

function setup() {
    //Instantiate a canvas the size of the properties defined in Utilities
    createCanvas(Utilities.SCREEN_W, Utilities.SCREEN_H);
    PLAYER.updatePlayerNormals();
}

function draw() {
    background(0);
    // requestPointerLock();
    Utilities.FOV = document.getElementById("slider").value;

    //Get every ray every frame
    const RAYS = FPV.getAllClosestRays();

    //Update the main FP view
    FPV.renderScene(RAYS);

    //Update and display the map when the map is enabled
    if (Utilities.DISPLAY_MINIMAP) {
        MAP.updateRays(RAYS);
        MAP.renderMinimap(RAYS, PLAYER, ENEMYS);
    }

    // ENEMYS.forEach((enemy) => {
    //     enemy.updateEnemy();
    // });
    // ENEMYS[0].updateEnemy();

    //Update the player position and rotation
    PLAYER.updatePlayer();
}
