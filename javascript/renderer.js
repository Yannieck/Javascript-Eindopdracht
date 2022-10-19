class Renderer {
    constructor(player, enemys) {
        this.player = player;
        this.enemys = enemys;
    }

    renderEnemys(h_offset) {
        //Loop through each enemy
        this.enemys.forEach((enemy, i) => {
            //Calculate the angle between the player and enemy
            let enemyPlayerAngle = atan2(
                enemy.y - this.player.y,
                enemy.x - this.player.x
            );

            //Calculate the distance between the player and enemy
            let enemyPlayerDist = dist(
                enemy.x,
                enemy.y,
                this.player.x,
                this.player.y
            );

            //Calculate the angle difference between the player and the enemy
            let angleDiff =
                (cos(this.player.angle) * (enemy.x - this.player.x) +
                    sin(this.player.angle) * (enemy.y - this.player.y)) /
                enemyPlayerDist;

            // if (keyIsDown(32)) {
            //     console.log(i);
            //     console.log(this.player.angle);
            //     console.log(enemyPlayerAngle);
            //     console.log(angleDiff);
            //     console.log(cos(radians(Utilities.FOV / 2)));
            //     console.log("--------------");
            // }

            //Check if that angle difference is less then 5 degrees
            if (angleDiff >= cos(radians(Utilities.FOV / 2))) {
                let a = acos(angleDiff);

                let b = enemyPlayerAngle- this.player.angle;

                // if (keyIsDown(32)) {
                // console.log(degrees(a));
                // }
                let enemyScreenX = map(
                    a,
                    0,
                    radians(Utilities.FOV / 2),
                    0,
                    -Utilities.SCREEN_W / 2
                );


                //Scale the enemy according to the distance
                const distance = dist(
                    this.player.x,
                    this.player.y,
                    enemy.x,
                    enemy.y
                );
                const size = ((enemy.size * 8) / distance) * 277;

                const wall = RayCaster.getClosestRayHit(
                    this.player,
                    enemyPlayerAngle
                );

                if (distance < wall.distance) {
                    //Display the enemy
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
            const wallHeight = ((Utilities.CELL_SIZE * 4) / distance) * 277;

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
}
