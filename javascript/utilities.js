class Utilities {
    //When true, displays a debug minimap at the top left of the screen
    static DISPLAY_MINIMAP = true;
    static MAP_SCALE = 0.5;

    //Game screen dimentions
    static SCREEN_W = 1200;
    static SCREEN_H = 675;

    static SCREEN_RES = this.SCREEN_W / 8;
    static SLICE_W = this.SCREEN_W / this.SCREEN_RES;

    static DIST_TO_CAMERA = 200; //277

    //Movement
    static PLAYER_SPEED = 3;
    static ROTATION_SPEED = 0.35;

    //Size of each block
    static CELL_SIZE = 64;

    //Field of view
    static FOV = 60;

    //Horizontal shoot range (in degrees)
    static SHOOT_W = 8;

    //Colors object
    static COLORS = {
        floor: "#686868",
        ceiling: "#212121",
        wall: "#0000BC",
        wallDark: "#0000AB",
        rays: "#ffa600",
    };

    //Map in bits
    static MAP_BITS = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
    ];

    //Check if a coord is outside the map boundaries
    static isOutOfMapBounds(x, y) {
        return (
            x < 0 ||
            x >= Utilities.MAP_BITS[0].length ||
            y < 0 ||
            y >= Utilities.MAP_BITS.length
        );
    }

    //Correct for fish eye effect
    static removeFisheyeFromDistance(distance, angle, playerAngle) {
        const diff = angle - playerAngle;
        return distance * cos(diff);
    }
}

let enemyImg;
let weaponImg;
let testSound;
let enemyDeath;
let music

function preload() {
    testSound = loadSound("../assets/sounds/shoot.wav");
    enemyDeath = loadSound("../assets/sounds/enemyDeath.wav");

    music = loadSound("../assets/sounds/music.wav");

    enemyImg = loadImage("../assets/images/enemy.png");
    weaponImg = loadImage("../assets/images/weapon.png");
}

