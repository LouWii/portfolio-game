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
        this.groundLayer = this.map.createStaticLayer('Tile Layer', this.tileset)
        this.groundLayer.setCollisionByProperty({ collide: true });

        // Probably not the correct way of doing this:
        this.physics.world.bounds.width = this.groundLayer.width

        // Player setup
        this.player = this.physics.add.sprite(100, 50, 'louwii')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        // Not sure what that does, but it doesn't work
        this.physics.add.collider(this.player, this.groundLayer)

        // Not sure what that does, but it doesn't work
        this.physics.world.enable(this.player)

        // Input/controls setup
        this.cursors = this.input.keyboard.createCursorKeys()

        var controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            acceleration: 0.06,
            // drag: 0.0005,
            drag: 0.0015,
            maxSpeed: 0.7
        }

        // Make camera follow player
        this.cameras.main.startFollow(this.player)

        // Force camera to not go above the map
        // We need that otherwise the camera follow the player and go out of the map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        // Make controls control the camera
        // this.controls = new Phaser.Cameras.Controls.Smoothed(controlConfig)
    }

    update (time, delta)
    {
        // For the camera
        // this.controls.update(delta)

        // For the player
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            // this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            // this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            // this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}
