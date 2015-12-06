import State from '../../../engine/states/State';

class MenuState extends State {

    constructor () {
        super('menu');

        this.menus = new Map();
        this._currentMenu = null;
        this.currentMenuName = null;
        this.options = new Map([
            ['name', 'Unknown Soldier']
        ]);
        this.gamePlaying = false;
        this.currentOptionsEdit = null;
    }

    addMenu (name, menu) {
        this.menus.set(name, menu);
    }

    changeOption (optionName, value) {
        this.options.set(optionName, value);
    }

    set currentMenu (name) {
        this._currentMenu = this.menus.get(name);
        this.currentMenuName = name;
    }

    get currentMenu () {
        return this._currentMenu;
    }

    init () {
        super.init();
    }

    update (delta) {
        super.updateInputs(delta);

        super.updateAudio(delta);
    }
}

export default MenuState;
