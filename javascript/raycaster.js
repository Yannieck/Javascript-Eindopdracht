class RayCaster {
    //Get the vertical ray collisions with the walls
    static getVerticalRayhits(player, angle) {
        //Bool if the player is looking right
        const isLookingRight = abs(floor((angle - HALF_PI) / PI) % 2);

        //Snap the player's X position to the nearest cell
        //If player is looking right, add another cellSize to the player's snap position since the snap rounds down
        const snappedX =
            floor(player.x / Utilities.CELL_SIZE) * Utilities.CELL_SIZE +
            (isLookingRight ? Utilities.CELL_SIZE : 0);

        //Calculate the corresponding Y position from the snappedX value
        const snappedY = player.y + (snappedX - player.x) * tan(angle);

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
            createVector(player.x, player.y),
            createVector(nextX, nextY),
            "Wall",
            true
        );
    }

    //Get the horizontal ray collisions with the walls
    static getHorizontalRayhits(player, angle) {
        //Bool if the player is looking up
        const isLookingUp = abs(floor(angle / PI) % 2);

        //Snap the player's Y position to the nearest cell
        //If player is looking up, add another cellSize to the player's snap position since the snap rounds down
        const snappedY =
            floor(player.y / Utilities.CELL_SIZE) * Utilities.CELL_SIZE +
            (!isLookingUp ? Utilities.CELL_SIZE : 0);

        //Calculate the corresponding X position from the snappedY value
        const snappedX = player.x + (snappedY - player.y) / tan(angle);

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
            createVector(player.x, player.y),
            createVector(nextX, nextY),
            "Wall",
            false
        );
    }

    //Cast the rays: vertical and horizontal, and get closest
    static getClosestRayHit(player, angle) {
        const vCollision = RayCaster.getVerticalRayhits(player, angle);
        const hCollision = RayCaster.getHorizontalRayhits(player, angle);

        return hCollision.distance >= vCollision.distance
            ? vCollision
            : hCollision;
    }

    //Get the closest hit point for each ray
    static getAllClosestRays(player) {
        //Get a starting angle by subtracting half the FOV of the player angle
        //This makes the FOV centered on the player instead of beginning on the player's angle
        const initialAngle = player.angle - radians(Utilities.FOV) / 2;

        //Number of rays is equal to the canvas width
        const numberOfRays = Utilities.SCREEN_RES;

        //step to increment each ray
        const angleStep = radians(Utilities.FOV) / numberOfRays;

        //Put each closest ray into an array;
        return Array.from({ length: numberOfRays }, (_, i) => {
            const angle = initialAngle + i * angleStep;
            const closestRay = RayCaster.getClosestRayHit(player, angle);
            return closestRay;
        });
    }
}
