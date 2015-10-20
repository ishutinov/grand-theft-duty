let debug = require('debug')('game:states/play');

let State = require('../engine/state');

/**
 * State of playing the game.
 *
 * @class
 * @extends State
 */
class PlayState extends State {

    /**
     * @constructor
     */
    constructor () {
        super('play');

        this.world = null;
        this.player = null;
    }

    init () {
        super.init();
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        this._updateInputs();

        if (this.world) {
            this.world.update(delta);
        }

        this._updateView();
    }

    _updateInputs () {
        for (let input of this.inputs.values()) {
            input.update();
        }
    }

    _updateView () {
        if (this.view) {
            this.view.update();
        }
    }
}

module.exports = PlayState;
