/**
 * Boot the game, load assets
 */
class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }

    /**
     * Load entire game assets
     * @return {void}
     */
    preload()
    {

        // Beginning of an atlas to replace spritesheets
        this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
        // Music to play. Need to cut it for it to loop properly
        this.load.audio('overworld', [
            'assets/music/overworld.ogg',
            'assets/music/overworld.mp3'
        ]);
    
        this.load.audioSprite('sfx',
            ['assets/audio/sfx.ogg', 'assets/audio/sfx.mp3'],
            'assets/audio/sfx.json',
            { instances: 4 }
        );

        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

        this.load.tilemapTiledJSON('map', 'assets/tilemaps/portfolio-map.json')
        // 2 Ways of loading the image/sprite used in our Map
        // 1. Load as spritesheet, give it a name, give details about sprite sizes
        // this.load.spritesheet('leafy_ground_sprite-32', 'assets/images/leafy_ground_sprite-32.png', { frameWidth: 32, frameHeight: 32 })
        // Or 2. Load it as an image with a name
        this.load.image('leafy_ground_sprite-32', 'assets/images/leafy_ground_sprite-32.png')
        this.load.image('objects-sprites', 'assets/images/objects-sprites.png')
        this.load.image('sprite-code', 'assets/images/sprite-code.png')
        this.load.image('sprite-cogs', 'assets/images/sprite-cogs.png')
        this.load.image('sprite-hat', 'assets/images/sprite-hat.png')
        this.load.image('sprite-heart', 'assets/images/sprite-heart.png')
        this.load.image('sprite-panel', 'assets/images/sprite-panel.png')

        this.load.image('sky', 'assets/images/sky.png')

        // Load sprite for main player
        this.load.spritesheet('louwii', 'assets/images/sprite-megaman.png', { frameWidth: 52, frameHeight: 60 });

        // Load plugin for animated tiles. This is just a first build of an upcoming plugin.
        // It's not optimized and lack features. The source code will be released when an
        // official first version is released.
        if (__DEV__) {
            console.log("before")
        }
        this.load.plugin('AnimatedTiles', 'assets/plugins/AnimatedTiles.min.js');

        if (__DEV__) {
            console.log("af")
        }
        this.load.json('attractMode', 'assets/json/attractMode.json');
    }

    /**
     * Create/Run the scene
     */
    create()
    {
        if (__DEV__) {
            console.log("BOOTED");
        }
        // this.scene.start('MarioBrosScene');
        // this.scene.start('TitleScene');
        this.scene.start('GameScene');
    }
}

export default BootScene;
