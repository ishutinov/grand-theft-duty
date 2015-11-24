let debug = require('debug')('game:builders/states/PlayStateBuilder');

import World from '../../game/logic/play/World';

import PlayState from '../../game/states/play/PlayState';
import PlayRenderView from '../../game/states/play/PlayRenderView';

import PhysicsSystem from '../../game/logic/play/PhysicsSystem';
import BulletSystem from '../../game/logic/play/BulletSystem';
import BulletSystemView from '../../game/views/bullet-system';

import PlayerInput from '../../game/input/play/PlayerInput';
import ComputerInput from '../../game/input/play/ComputerInput';
import PlayerView from '../../game/views/player';

import PlayAudio from '../../game/audio/PlayAudio';

import StaticBlocksView from '../../engine/views/StaticBlocksView';

import CharactersView from '../../game/views/characters';

import Stats from '../../game/logic/play/Stats';
import StatsRenderView from '../../game/ui/StatsRenderView';

import Entities from '../../game/logic/play/entities';

import MapParser from '../../engine/maps/MapParser';

let _createPlayView = function (state) {
    let world = state.world;

    let playView = new PlayRenderView(world);

    // Static views
    let blocksView = new StaticBlocksView(world.map.blocks, 'tiles');

    playView.addStaticView(blocksView);

    // Dynamic Views
    let playerView = new PlayerView(world.player);
    let charactersView = new CharactersView(world.characters);
    let bulletSystemView = new BulletSystemView(state.bulletSystem);

    playView.addDynamicView(playerView);
    playView.addDynamicView(charactersView);
    playView.addDynamicView(bulletSystemView);

    // Camera follow
    playView.cameraFollowView = playerView;

    return playView;
};

let _createEntities = function (state) {
    let entities = [];
    let player = new Entities.Player(475, 475, 900, 48, 48);

    // Player
    entities.push(player);

    let playerInput = new PlayerInput(player);

    state.inputs.add(playerInput);

    let enemy = new Entities.Character(300, 450, 300, 48, 48);

    entities.push(enemy);

    state.inputs.add(new ComputerInput(enemy));

    // Enemies
    return entities.concat([
        new Entities.Character(350, 450, 900, 48, 48),
        new Entities.Character(350, 350, 900, 48, 48),
        new Entities.Character(200, 550, 900, 48, 48)
    ]);
};

let PlayStateBuilder = {
    create (engine) {
        // World
        let map = MapParser.parse('level1');
        let world = new World(map);

        let state = new PlayState(engine, world);

        // Physics
        let physicsSystem = new PhysicsSystem(map);

        // Bullet system
        let bulletSystem = new BulletSystem();

        state.bulletSystem = bulletSystem;
        state.physicsSystem = physicsSystem;
        state.audio = new PlayAudio('guns', 'background');

        let entities = _createEntities(state);

        state.addEntities(entities);

        let worldView = _createPlayView(state);

        state.addView(worldView);

        let stats = new Stats(state);
        let statsView = new StatsRenderView(stats);

        state.addView(statsView);

        return state;
    }
};

export default PlayStateBuilder;