let debug = require('debug')('game:engine/views/WaterBlocksView');

import TextureManager from '../../engine/graphics/TextureManager';
import Animation from '../../engine/graphics/Animation';
import View from '../../engine/views/View';

const WATER_FRAMES = [
    'animation_water_0001',
    'animation_water_0002',
    'animation_water_0003',
    'animation_water_0004',
    'animation_water_0005',
    'animation_water_0006',
    'animation_water_0007',
    'animation_water_0008',
    'animation_water_0009'
];

let _waterGeometry = function (block, textureAtlas) {
    let geometries = [];

    if (block.walls.top) {
        let top = textureAtlas.getBounds(block.walls.top);

        let topGeometry = new THREE.PlaneGeometry(block.width, block.height);

        topGeometry.faceVertexUvs[0][0] = [top[0], top[1], top[3]];
        topGeometry.faceVertexUvs[0][1] = [top[1], top[2], top[3]];
        topGeometry.translate(0, 0, (block.height / 2));

        geometries.push(topGeometry);
    }

    let blockGeometry = new THREE.Geometry();

    for (let geometry of geometries) {
        blockGeometry.merge(geometry);
    };

    return blockGeometry;
};

let _createMergedBlockGeometry = function (blocks, textureAtlas) {
    let mergedGeometry = new THREE.Geometry();

    for (let block of blocks) {
        let geometry = _waterGeometry(block, textureAtlas);

        geometry.translate(block.position.x, block.position.y, block.position.z);

        mergedGeometry.merge(geometry);
    }

    mergedGeometry.mergeVertices();

    return mergedGeometry;
};

class WaterBlocksView extends View {
    constructor (map, textureAtlasName, waterFrames = WATER_FRAMES) {
        super();

        this.map = map;
        this._textureAtlasName = textureAtlasName;
        this._waterFrames = waterFrames;
        this.blocks = map.blocks(['water']);

        this.blockWidth = map.tileWidth;
        this.blockHeight = map.tileHeight;
        this.blockDepth = map.tileDepth;
    }

    init () {
        // Do not clone, since all water animates in sync
        this.textureAtlas = TextureManager.getAtlas(this._textureAtlasName, true);

        this.geometry = _createMergedBlockGeometry(this.blocks, this.textureAtlas);

        this.animation = new Animation(this.textureAtlas, this.geometry, 9, true, this._waterFrames, '', true);
        this.animation.textureFrame.width = 100;
        this.animation.textureFrame.height = 100;

        this.material = new THREE.MeshLambertMaterial({
            map: this.textureAtlas.texture,
            transparent: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Set the center of the blocks to bottom left (instead of center)
        this.mesh.translateX(this.blockWidth / 2);
        this.mesh.translateY(this.blockHeight / 2);
        this.mesh.translateZ(this.blockDepth / 2);

        this._initialized = true;
    }

    update (interpolationPercentage) {
        this.animation.update();
    }
}

export default WaterBlocksView;