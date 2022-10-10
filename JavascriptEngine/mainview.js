class FirstPersonView {
    constructor(player, enemys) {
        this.player = player;
        this.enemys = enemys;
    }

    //Get the vertical ray collisions with the walls
    getVerticalRayhits(angle) {
        //Bool if the player is looking right
        const isLookingRight = abs(floor((angle - HALF_PI) / PI) % 2);

        //Snap the player's X position to the nearest cell
        //If player is looking right, add another cellSize to the player's snap position since the snap rounds down
        const snappedX =
            floor(this.player.x / Utilities.CELL_SIZE) * Utilities.CELL_SIZE +
            (isLookingRight ? Utilities.CELL_SIZE : 0);

        //Calculate the corresponding Y position from the snappedX value
        const snappedY =
            this.player.y + (snappedX - this.player.x) * tan(angle);

        //Calculate the incrementation steps
        const xStep = isLookingRight
            ? Utilities.CELL_SIZE
            : -Utilities.CELL_SIZE;
        const yStep = xStep * tan(angle);

        let wall;
        let nextX = snappedX;
        let nextY = snappedY;

        //While not hitting wall
        while (!wall) {
            //Get the next position and make it relative to the bitmap and compensate for the rounding down
            const cellX = floor(nextX / Utilities.CELL_SIZE) - !isLookingRight;
            const cellY = floor(nextY / Utilities.CELL_SIZE);

            //Check if this positon is within the map, if not, stop running and move on to the next point
            if (Utilities.isOutOfMapBounds(cellX, cellY)) {
                break;
            }

            //Get the cell from the bitmap and get the result
            wall = Utilities.MAP_BITS[cellY][cellX];
            if (!wall) {
                //If not a wall then add the incrementation steps to move on to the next tile
                nextX += xStep;
                nextY += yStep;
            }
        }
        //When found a ray, return it
        return new Ray(
            angle,
            createVector(this.player.x, this.player.y),
            createVector(nextX, nextY),
            "Wall",
            true
        );
    }

    //Get the horizontal ray collisions with the walls
    getHorizontalRayhits(angle) {
        //Bool if the player is looking up
        const isLookingUp = abs(floor(angle / PI) % 2);

        //Snap the player's Y position to the nearest cell
        //If player is looking up, add another cellSize to the player's snap position since the snap rounds down
        const snappedY =
            floor(this.player.y / Utilities.CELL_SIZE) * Utilities.CELL_SIZE +
            (!isLookingUp ? Utilities.CELL_SIZE : 0);

        //Calculate the corresponding X position from the snappedY value
        const snappedX =
            this.player.x + (snappedY - this.player.y) / tan(angle);

        //Calculate the incrementation steps
        const yStep = isLookingUp ? -Utilities.CELL_SIZE : Utilities.CELL_SIZE;
        const xStep = yStep / tan(angle);

        let wall;
        let nextX = snappedX;
        let nextY = snappedY;

        //While not hitting wall
        while (!wall) {
            //Get the next position and make it relative to the bitmap and compensate for the rounding down
            const cellX = floor(nextX / Utilities.CELL_SIZE);
            const cellY = floor(nextY / Utilities.CELL_SIZE) - isLookingUp;

            //Check if this positon is within the map, if not, stop running and move on to the next point
            if (Utilities.isOutOfMapBounds(cellX, cellY)) {
                break;
            }

            //Get the cell from the bitmap and get the result
            wall = Utilities.MAP_BITS[cellY][cellX];
            if (!wall) {
                //If not a wall then add the incrementation steps to move on to the next tile
                nextX += xStep;
                nextY += yStep;
            }
        }
        //When found a ray, return it
        return new Ray(
            angle,
            createVector(this.player.x, this.player.y),
            createVector(nextX, nextY),
            "Wall",
            false
        );
    }

    getAnglesFromEnemys() {
        //Loop through each enemy
        this.enemys.forEach((enemy) => {
            //Calculate the offset between the enemy and player
            let dx = enemy.x - this.player.x;
            let dy = enemy.y - this.player.y;

            //Calculate the angle
            let angle = atan2(dy, dx);

            //Compensate for angle wrapping. (for examle: 360° - 90° is not equal to 0° - 90°)
            if (this.player.angle - radians(Utilities.FOV / 2) > PI) {
                this.player.angle -= TWO_PI;
            }
            if (this.player.angle - radians(Utilities.FOV / 2) < -PI) {
                this.player.angle += TWO_PI;
            }

            //Calculate the angle bounds with the FOV
            const minAngle = this.player.angle - radians(Utilities.FOV / 2);
            const maxAngle = this.player.angle + radians(Utilities.FOV / 2);

            if (angle > minAngle && angle < maxAngle) {
                //Subtract the left angle bound from the angle to get the angle offset
                let deltaAngle = angle - minAngle;

                //Map this bound from the angle to the screen
                let mappedAngle = map(
                    degrees(deltaAngle),
                    0,
                    Utilities.FOV,
                    0,
                    Utilities.SCREEN_W
                );
                
                //Scale the enemy according to the distance
                const distance = sqrt(dx * dx + dy * dy);
                const size = ((enemy.size * 8) / distance) * 277;

                //Display the enemy
                image(
                    enemyImg,
                    mappedAngle - size / 2,
                    Utilities.SCREEN_H / 2 - size / 2,
                    size,
                    size
                );
            }
        });
    }

    //Cast the rays: vertical and horizontal, and get closest
    getClosestRayHit(angle) {
        const vCollision = this.getVerticalRayhits(angle);
        const hCollision = this.getHorizontalRayhits(angle);

        return hCollision.distance >= vCollision.distance
            ? vCollision
            : hCollision;
    }

    //Get the closest hit point for each ray
    getAllClosestRays() {
        //Get a starting angle by subtracting half the FOV of the player angle
        //This makes the FOV centered on the player instead of beginning on the player's angle
        const initialAngle = this.player.angle - radians(Utilities.FOV) / 2;

        //Number of rays is equal to the canvas width
        const numberOfRays = Utilities.SCREEN_RES;

        //step to increment each ray
        const angleStep = radians(Utilities.FOV) / numberOfRays;

        //Put each closest ray into an array;
        return Array.from({ length: numberOfRays }, (_, i) => {
            const angle = initialAngle + i * angleStep;
            const closestRay = this.getClosestRayHit(angle);
            return closestRay;
        });
    }

    //Render the rays in the main view
    renderScene(rays) {
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
                Utilities.SCREEN_H / 2 - wallHeight / 2,
                Utilities.SLICE_W,
                wallHeight
            );

            //Draw the floors
            fill(Utilities.COLORS.floor);
            rect(
                i * Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 + wallHeight / 2,
                Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 - wallHeight / 2
            );

            //Draw the ceiling
            fill(Utilities.COLORS.ceiling);
            rect(
                i * Utilities.SLICE_W,
                0,
                Utilities.SLICE_W,
                Utilities.SCREEN_H / 2 - wallHeight / 2
            );
        });

        this.getAnglesFromEnemys();
    }
}
