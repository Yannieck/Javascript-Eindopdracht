class Ray {
    constructor(angle = 0, origin, hit, vertical) {
        this.angle = angle;
        this.origin = origin;
        this.hit = hit;

        //Displays if the ray hit a vertical or horizontal wall
        this.vertical = vertical;

        //Calculate the distance between the origin and hitpoint
        this.distance = p5.Vector.dist(this.origin, this.hit);
    }
}
