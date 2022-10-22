class Map {
    static enemys = [];

    constructor(player) {
        this.player = player;
    }

    renderEnemys(h_offset) {
        //Loop through each enemy
        Map.enemys.forEach((enemy, i) => {
            //Create a vector from the player to the enemy
            let playerEnemyVector = createVector(
                enemy.x - this.player.x,
                enemy.y - this.player.y
            );

            //Calculate the angle between the player and enemy
            let playerEnemyAngle = atan2(
                playerEnemyVector.y,
                playerEnemyVector.x
            );

            //Calculate the angle difference between the player and the enemy
            let angleDiff =
                (cos(this.player.angle) * (enemy.x - this.player.x) +
                    sin(this.player.angle) * (enemy.y - this.player.y)) /
                playerEnemyVector.mag();

            //Check if that angle difference is within the FOV
            if (angleDiff >= cos(radians(Utilities.FOV / 2))) {
                //Map the difference between the playerangle and enemy angle to the distance to the screen
                let enemyScreenX = map(
                    acos(angleDiff),
                    0,
                    radians(Utilities.FOV / 2),
                    0,
                    Utilities.SCREEN_W / 2
                );
                //This gives a value going from 1 to 0 to 1. This needs to be changed to -1 to 0 to 1

                //Crossproduct will be negative when vector B is to the left of vector A
                //and prositive when vector B is to the right of vector A
                let crossProduct = p5.Vector.cross(
                    playerEnemyVector,
                    this.player.forward
                );

                //When the cross product is less then 0 (towards the left)
                //Multiply with -1
                if (crossProduct.z > 0) {
                    enemyScreenX *= -1;
                }

                //Add half the screen width to center
                enemyScreenX += Utilities.SCREEN_W / 2;

                //Scale the enemy according to the distance
                const distance = dist(
                    this.player.x,
                    this.player.y,
                    enemy.x,
                    enemy.y
                );

                const size =
                    ((enemy.size * 8) / distance) * Utilities.DIST_TO_CAMERA;

                //Check if there are any walls between the player and enemy
                //If there are, dont draw the enemy
                const wall = RayCaster.getClosestRayHit(
                    this.player,
                    playerEnemyAngle
                );

                if (distance < wall.distance) {
                    //Draw the enemy
                    image(
                        enemyImg,
                        enemyScreenX - size / 2,
                        Utilities.SCREEN_H / 2 - size / 2 + h_offset,
                        size,
                        size
                    );
                }
            }
        });
    }

    //Render the rays in the main view
    renderScene(rays) {
        const wave = sin(millis() / 80) * 7 + 5;
        const h_offset = this.player.speed != 0 ? wave : 0;

        rays.forEach((ray, i) => {
            //Calculate the distance with the fixed fish eye
            const distance = Utilities.removeFisheyeFromDistance(
                ray.distance,
                ray.angle,
                PLAYER.angle
            );

            // Calculate the wall height
            const wallHeight =
                ((Utilities.CELL_SIZE * 4) / distance) *
                Utilities.DIST_TO_CAMERA;

            //Draw the walls
            noStroke();

            fill(
                ray.vertical ? Utilities.COLORS.wallDark : Utilities.COLORS.wall
            );
            rect(
                i * Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 - wallHeight / 2 + h_offset,
                Utilities.SLICE_W,
                wallHeight
            );

            //Draw the floors
            fill(Utilities.COLORS.floor);
            rect(
                i * Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 + wallHeight / 2 + h_offset,
                Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 - wallHeight / 2 - h_offset
            );

            // Draw the ceiling
            fill(Utilities.COLORS.ceiling);
            rect(
                i * Utilities.SLICE_W,
                0,
                Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 - wallHeight / 2 + h_offset
            );
        });

        this.renderEnemys(h_offset);
    }

    spawnEnemies() {
        if (
            Map.enemys.length < 10 &&
            Utilities.spawnedEnemys < Utilities.enemyGoal &&
            Utilities.currentScore == 0
        ) {
            let rand = floor(random(Utilities.spawnableSpaces.length));
            let pos = Utilities.spawnableSpaces[rand];

            Map.enemys.push(
                new Enemy(
                    Utilities.CELL_SIZE * pos.x + Utilities.CELL_SIZE / 2,
                    Utilities.CELL_SIZE * pos.y + Utilities.CELL_SIZE / 2
                )
            );
            Utilities.spawnedEnemys++;
        }
    }
}
