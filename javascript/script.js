const PLAYER = new Player();
const MAP = new Map(0, 0, Utilities.MAP_SCALE);

const FPV = new Renderer(PLAYER, ENEMYS);

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

    image(
        weaponImg,
        Utilities.SCREEN_W / 2 - 187,
        Utilities.SCREEN_H - 200,
        300,
        300
    );
}

function mouseClicked() {
    PLAYER.shoot();
}
var canvas = document.getElementById("defaultCanvas0");

document.addEventListener("mousemove", (e) => {
    PLAYER.angle += radians(e.movementX) * Utilities.ROTATION_SPEED;
});
document.body.onclick = function () {
    canvas.requestPointerLock();
};
