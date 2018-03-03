import Louwii from './sprites/Louwii'

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

        // Add temporary sky background
        this.add.image(400, 300, 'sky')
        this.add.image(1100, 300, 'sky')
        this.add.image(1700, 300, 'sky')

        // this.add.image(400, 300, 'background-clouds');
        // this.map = this.make.tilemap({ key: 'map2' });
        this.map = this.add.tilemap('map2')

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        // If the names are the same, 2nd param is not needed
        this.groundTileset = this.map.addTilesetImage('leafy_ground_sprite-32')
        // this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32', 'groundTiles')

        // Create a layer, first name is layer name in the map (as in Tiled), second is our tileset created before
        this.groundLayer = this.map.createStaticLayer('Tile Layer', this.groundTileset)
        this.groundLayer.setCollisionByProperty({ collides: true });

        // This only works for impact physics
        // this.physics.world.setCollisionMapFromTilemapLayer(this.groundLayer, { defaultCollidingSlope: 1 })

        // Probably not the correct way of doing this:
        this.physics.world.bounds.width = this.map.widthInPixels

        // Player setup
        this.player = new Louwii({
            scene: this,
            key: 'louwii',
            x: 100, 
            y: 50
        })

        // Objects setup
        this.objectGroup = this.add.group()
        // TODO: issues for using tileset and Object layer, can't seem to load proper graphic part when creating sprite
        // We can do it that way with Traits Layer Tile as a Tile Layer
        this.objectsTileset = this.map.addTilesetImage('objects-sprites')
        this.traitsLayer = this.map.createStaticLayer('Traits Layer Tile', this.objectsTileset)
        this.physics.add.overlap(this.player, this.traitsLayer)
        // this.physics.add.overlap(this.player, this.traitsLayer, this.collectObject, null, this)
        this.traitsLayer.setTileIndexCallback(9, this.collectObject, this)
        this.traitsLayer.setTileIndexCallback(11, this.collectObject, this)
        this.traitsLayer.setTileIndexCallback(12, this.collectObject, this)
        // But Traits Layer is an Object Layer (which makes more sense)

        // This works but not works (issue with the sprite)
        // this.map.createFromObjects('Traits Layer', 9, {key: 'objects-sprites'})
        // this.map.createFromObjects('Traits Layer', 11, {key: 'objects-sprites'})
        // this.map.createFromObjects('Traits Layer', 12, {key: 'objects-sprites'})

        this.map.getObjectLayer("Traits Layer").objects.forEach((modifier) => {
            console.log(modifier)
            let properties, type

            properties = modifier.properties
            // if (typeof modifier.gid !== "undefined") {
                
            // }
            // else {
            //     type = modifier.properties.type;
            // }
            // let objectObject = this.physics.add.sprite(modifier.x, modifier.y, 'objects-sprites')
            // let objectObject = this.add.sprite(modifier.x, modifier.y, 'objects-sprites')
            // console.log(objectObject)

            // Add Object to group
            // this.objectGroup.add(objectObject)

            // this.physics.add.overlap(this.player, objectObject, this.collectObject, null, this)
        })

        // this.physics.add.overlap(this.player, this.objectGroup, this.collectObject, null, this)

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('louwii', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'stand-left',
            frames: [ { key: 'louwii', frame: 4 } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'stand-right',
            frames: [ { key: 'louwii', frame: 5 } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'jumping-left',
            frames: [ { key: 'louwii', frame: 10 } ],
            frameRate: 10
        })

        this.anims.create({
            key: 'jumping-right',
            frames: [ { key: 'louwii', frame: 11 } ],
            frameRate: 10
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('louwii', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        })

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

        this.debugGraphics = this.add.graphics()
        this.showDebug = false
        const _this = this
        this.input.keyboard.on('keydown_C', function (event) {
            _this.showDebug = !_this.showDebug
            _this.drawDebug()
        });

        // Make camera follow player
        this.cameras.main.startFollow(this.player)

        // Force camera to not go above the map
        // We need that otherwise the camera follow the player and go out of the map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        // Make controls control the camera
        // this.controls = new Phaser.Cameras.Controls.Smoothed(controlConfig)

        // Create hidden elements to be displayed in the game
        // School
        this.background = this.add.graphics()
        this.background.fillStyle(0xffffff, 1)
        this.background.fillRect(0, -600, 256, 256)
        this.text = this.make.text({
            x: 0,
            y: -600,
            text: 'I have a Master degree in computer sciences and years of web exp. But I\'m still eager to learn more about web technologies to improve myself.',
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: 'bold 25px Arial',
                fill: 'black',
                wordWrap: { width: 300 }
            }
        });
        this.schoolGroup = this.add.group()
        this.schoolGroup.add(this.background)
        this.schoolGroup.add(this.text)

        this.text = this.make.text({
            x: 0,
            y: 0,
            text: 'Performance, Security, Compliance, Evolvability, Maintainability... Producing good code isn\'t easy, I do my best to respect these important principles.',
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: 'bold 25px Arial',
                fill: 'black',
                wordWrap: { width: 300 }
            }
        });
        this.codeGroup = this.add.group()
        this.codeGroup.add(this.background)
        this.codeGroup.add(this.text)

        this.text = this.make.text({
            x: 0,
            y: 0,
            text: 'I write lines and lines of code for all sorts of web things, in all sort of languages. And I love it ! ',
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: 'bold 25px Arial',
                fill: 'black',
                wordWrap: { width: 300 }
            }
        });
        this.passionGroup = this.add.group()
        this.passionGroup.add(this.background)
        this.passionGroup.add(this.text)

        console.log(this.player)
    }

    update (time, delta)
    {
        // For the camera
        // this.controls.update(delta)

        this.player.update(this.cursors, time, delta)
    }

    drawDebug()
    {
        this.debugGraphics.clear()

        if (this.showDebug)
        {
            if (__DEV__){
                console.log('drawing debug')
            }
            // Pass in null for any of the style options to disable drawing that component
            this.map.renderDebug(this.debugGraphics, {
                tileColor: null, // Non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
            });
        }
    }

    collectObject(player, object)
    {
        setTimeout(function() {
            object.setVisible(true)
        }, 5000)

        if (object.visible){
            console.log(object)
            let _this = this
            this.schoolGroup.getChildren().forEach(function(child){
                console.log(child)
                console.log(_this.cameras.main)
                if (child.type === 'Graphics') {

                } else if (child.type === 'Text') {
                    child.setPosition(object.pixelX, 0)
                }
            })
        }

        // not sure what that does ?
        // object.disableBody(true, true)
        object.setCollision(false) // doesn't do anything
        object.setVisible(false)
    }

}
