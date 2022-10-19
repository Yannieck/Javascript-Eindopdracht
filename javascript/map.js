class Map {
    constructor(posX = 0, posY = 0, scale = 1) {
        this.posX = posX;
        this.posY = posY;
        this.scale = scale;
        this.cellSize = scale * Utilities.CELL_SIZE;
    }

    //Update the rays
    updateRays(rays) {
        this.rays = rays;
    }

    //Display the minimap
    renderMinimap(rays, player, enemys) {
        //Draw the walls (tiles)
        Utilities.MAP_BITS.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    fill(150);
                } else {
                    fill(50);
                }
                noStroke();
                rect(
                    this.posX + x * this.cellSize,
                    this.posY + y * this.cellSize,
                    this.cellSize
                );
            });
        });

        //Draw the rays
        stroke(Utilities.COLORS.rays);
        rays.forEach((ray) => {
            line(
                player.x * this.scale + this.posX,
                player.y * this.scale + this.posY,
                (player.x + cos(ray.angle) * ray.distance) * this.scale,
                (player.y + sin(ray.angle) * ray.distance) * this.scale
            );
        });
        noStroke();

        //Draw the player
        fill("#0000ff");
        rect(
            this.posX + player.x * this.scale - Player.SIZE / 2,
            this.posY + player.y * this.scale - Player.SIZE / 2,
            Player.SIZE,
            Player.SIZE
        );

        //Draw the enemys
        enemys.forEach((enemy) => {
            fill("#ff00ff");
            rect(
                this.posX + enemy.x * this.scale - enemy.size / 2,
                this.posY + enemy.y * this.scale - enemy.size / 2,
                enemy.size,
                enemy.size
            );
        });

        // Draw the facing direction of the player
        stroke("#0000ff");
        strokeWeight(2);
        line(
            player.x * this.scale + this.posX,
            player.y * this.scale + this.posY,
            (player.x + player.forward.x * 2) * this.scale,
            (player.y + player.forward.y * 2) * this.scale
        );
        strokeWeight(1);
    }
}
