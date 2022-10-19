class Player {
    static SIZE = 10;
    kills = 0;

    constructor() {
        this.x = Utilities.CELL_SIZE * 1.5;
        this.y = Utilities.CELL_SIZE * 2;
        this.angle = 0;
        this.speed = 0;
    }

    updatePlayerNormals() {
        this.forward = createVector(
            cos(this.angle) * Player.SIZE,
            sin(this.angle) * Player.SIZE
        );
        this.back = createVector(
            cos(this.angle + PI) * Player.SIZE,
            sin(this.angle + PI) * Player.SIZE
        );
    }

    updatePlayer() {
        //Update the player looking direction
        this.updatePlayerNormals();

        //Get the points at the end of a ray casted from the player, forwards and backwards
        //If these points are in a wall, stop them from moving in that direction
        let forwardMapPos = createVector(
            floor((this.x + this.forward.x * 2) / Utilities.CELL_SIZE),
            floor((this.y + this.forward.y * 2) / Utilities.CELL_SIZE)
        );

        let backMapPos = createVector(
            floor((this.x + this.back.x) / Utilities.CELL_SIZE),
            floor((this.y + this.back.y) / Utilities.CELL_SIZE)
        );

        let forwardIsInWall =
            Utilities.MAP_BITS[forwardMapPos.y][forwardMapPos.x];
        let backwardIsInWall = Utilities.MAP_BITS[backMapPos.y][backMapPos.x];

        //Get keyboard inputs
        if (keyIsDown(87) && !forwardIsInWall) {
            this.speed = Utilities.PLAYER_SPEED;
        } else if (keyIsDown(83) && !backwardIsInWall) {
            this.speed = -Utilities.PLAYER_SPEED;
        } else {
            this.speed = 0;
        }

        //Apply movement
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    }

    shoot() {
        let closestEnemy = -1;
        let closestDist = Infinity;

        ENEMYS.forEach((enemy, i) => {
            //Create a vector from the player to the enemy
            let playerEnemyVector = createVector(
                enemy.x - this.x,
                enemy.y - this.y
            );

            //Calculate the angle difference between the player and the enemy
            let angleDiff =
                (cos(this.angle) * (enemy.x - this.x) +
                    sin(this.angle) * (enemy.y - this.y)) /
                playerEnemyVector.mag();

            //Check if enemy is within horizontal shooting range
            if (angleDiff >= cos(radians(Utilities.SHOOT_W / 2))) {
                let wallDist = RayCaster.getClosestRayHit(this, this.angle);
                let d = dist(this.x, this.y, enemy.x, enemy.y);

                //Check if there is no wall blocking the line of sight
                if (d < wallDist.distance) {
                    if (d < closestDist) {
                        closestDist = d;
                        closestEnemy = i;
                    }
                }
            }
        });

        if (closestEnemy >= 0) {
            ENEMYS.splice(closestEnemy, 1);
            kills++;
            enemyDeath.play();
        }
    }
}
