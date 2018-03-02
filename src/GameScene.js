export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene',
            // Our physic is defined in the game config, but we can set it up here too
            // physics: {
            //     system: 'impact',
            //     gravity: 100,
            //     setBounds: {
            //         width: 800,
            //         height: 600,
            //     }
            // }
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
        this.map = this.make.tilemap({ key: 'map2' });
        // this.map = this.add.tilemap('map2')

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        // this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32')
        this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32', 'groundTiles');

        // console.log(this.tileset)

        // this.blockedLayer = this.map.createLayer('blockedLayer');
        this.groundLayer = this.map.createStaticLayer('GroundLayer', this.tileset);
        // this.groundLayer.setCollisionByProperty({ collide: true });

        // Probably not the correct way of doing this:
        // this.physics.world.bounds.width = this.groundLayer.width;

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.0005,
            maxSpeed: 0.7
        };

        this.controls = new Phaser.Cameras.Controls.Smoothed(controlConfig);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}
