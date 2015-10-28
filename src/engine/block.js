let polygon = require('./sat/polygon');

class Block {
    constructor (id = null, position, width, height, depth) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.west = 'animation_water_0003';
        // this.east = 'roof1_edge';
        this.south = 'grass_center';
        // this.north = 'roof1_edge';
        // this.top = 'roof1_edge';
        this.position = position;

        // TODO
        this.collidable = true;
        this.view = null;
    }

    get wallPolygons () {
        let polygons = [];

        if (this.west) {
            polygons.push(
                polygon.create(this.position, [
                    { x: 0, y: 0 },
                    { x: this.width, y: 0 }
                ])
            );
        }

        if (this.east) {
            polygons.push(
                polygon.create(this.position, [
                    { x: 0, y: this.height },
                    { x: this.width, y: this.height }
                ])
            );
        }

        if (this.south) {
            polygons.push(
                polygon.create(this.position, [
                    { x: this.width, y: 0 },
                    { x: this.width, y: this.height }
                ])
            );
        }

        if (this.north) {
            polygons.push(
                polygon.create(this.position, [
                    { x: 0, y: 0 },
                    { x: 0, y: this.height }
                ])
            );
        }

        return polygons;
    }

    get x () {
        return this.position.x;
    }

    get y () {
        return this.position.y;
    }
}

module.exports = Block;
