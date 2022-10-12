class Utilities {
    //When true, displays a debug minimap at the top left of the screen
    static DISPLAY_MINIMAP = true;
    static MAP_SCALE = 0.5;

    //Game screen dimentions
    static SCREEN_W = 1200;
    static SCREEN_H = 675;

    static SCREEN_RES = this.SCREEN_W / 8;
    static SLICE_W = this.SCREEN_W / this.SCREEN_RES;

    //Movement
    static PLAYER_SPEED = 3;
    static ROTATION_SPEED = 1;

    //Size of each block
    static CELL_SIZE = 64;

    //Field of view
    static FOV = 60;

    //Colors object
    static COLORS = {
        floor: "#d52b1e",
        ceiling: "#ff00ff",
        wall: "#012aa6",
        wallDark: "#0a2a8c",
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
