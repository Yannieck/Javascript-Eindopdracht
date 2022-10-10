class Player {
    static SIZE = 10;

    constructor() {
        this.x = Utilities.CELL_SIZE * 1.5;
        this.y = Utilities.CELL_SIZE * 2;
        this.angle = 0;
        this.speed = 0;
    }

    updatePlayerNormals() {
        this.forward = createVector(
            cos(this.angle) * Player.SIZE * 2,
            sin(this.angle) * Player.SIZE * 2
        );
        this.back = createVector(
            cos(this.angle + PI) * Player.SIZE,
            sin(this.angle + PI) * Player.SIZE
        );
    }

    updatePlayer() {
        //Rotate camera
        if (keyIsDown(65)) {
            this.angle -= (TWO_PI / 180);
        } else if (keyIsDown(68)) {
            this.angle += (TWO_PI / 180);
        }

        this.angle %= TWO_PI

        //Update the player looking direction
        this.updatePlayerNormals();

        //Get the points at the end of a ray casted from the player, forwards and backwards
        //If these points are in a wall, stop them from moving in that direction
        let roundedForwardPos = createVector(
            floor((this.x + this.forward.x) / Utilities.CELL_SIZE),
            floor((this.y + this.forward.y) / Utilities.CELL_SIZE)
        );

        let roundedBackPos = createVector(
            floor((this.x + this.back.x) / Utilities.CELL_SIZE),
            floor((this.y + this.back.y) / Utilities.CELL_SIZE)
        );

        let forwardIsInWall =
            Utilities.MAP_BITS[roundedForwardPos.y][roundedForwardPos.x];
        let backwardIsInWall =
            Utilities.MAP_BITS[roundedBackPos.y][roundedBackPos.x];

        //Get keyboard inputs
        if (keyIsDown(87) && !forwardIsInWall) {
            this.speed = 2;
        } else if (keyIsDown(83) && !backwardIsInWall) {
            this.speed = -2;
        } else {
            this.speed = 0;
        }

        //Apply movement
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    }
}
