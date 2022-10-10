class Enemy {
    constructor(x, y, size, target) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
        this.speed = 0;
    }

    updateEnemy() {}
}

const ENEMYS = [
    new Enemy(Utilities.CELL_SIZE * 1.5, Utilities.CELL_SIZE * 2.5, 10),
    new Enemy(Utilities.CELL_SIZE * 2.5, Utilities.CELL_SIZE * 1.5, 10),
    new Enemy(Utilities.CELL_SIZE * 3.5, Utilities.CELL_SIZE * 1.5, 10),
];
