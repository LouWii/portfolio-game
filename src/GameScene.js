export default class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene',
        });
    }

    preload() {
        // preloading should happen in our BootScene
        // this.load.image('mushroom', './assets/images/mushroom2.png')
        if (__DEV__){
            console.log('GameScene preload OK')
        }
    }

    create() {

        // this.add.image(400, 300, 'background-clouds');
        // this.map = this.make.tilemap({ key: 'map2' });
        this.map = this.add.tilemap('map2')

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        // If the names are the same, 2nd param is not needed
        this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32')
        // this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32', 'groundTiles')

        // Create a layer, first name is layer name in the map (as in Tiled), second is our tileset created before
        this.groundLayer = this.map.createStaticLayer('Tile Layer', this.tileset);
        // this.groundLayer.setCollisionByProperty({ collide: true });

        // Probably not the correct way of doing this:
        // this.physics.world.bounds.width = this.groundLayer.width;

        // this.map = this.add.tilemap('map-coins');
        // var tiles = this.map.addTilesetImage('ground_1x1');
        // var layer = this.map.createStaticLayer('Tile Layer', tiles);
    }

    update (time, delta)
    {
        // this.controls.update(delta);
    }
}
