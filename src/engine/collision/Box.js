import Vector from './Vector';
import Polygon from './Polygon';

// ## Box
//
// Represents an axis-aligned box, with a width and height.
// Create a new box, with the specified position, width, and height. If no position
// is given, the position will be `(0,0)`. If no width or height are given, they will
// be set to `0`.
/**
 * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
 * @param {?number=} w The width of the box.
 * @param {?number=} h The height of the box.
 * @constructor
 */
class Box {
    constructor (position = new Vector(), width = 0, height = 0) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    /**
     * Returns a polygon whose edges are the same as this box.
     * @return {Polygon} A new Polygon that represents this box.
     */
    toPolygon () {
        const pos = this.position;
        const w = this.width;
        const h = this.height;

        return new Polygon(new Vector(pos.x, pos.y), [
            new Vector(), new Vector(w, 0),
            new Vector(w, h), new Vector(0, h)
        ]);
    }
}

export default Box;
