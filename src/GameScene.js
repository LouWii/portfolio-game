import Louwii from './sprites/Louwii'
import makeAnimations from './helpers/animations'

export default class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene',
        })
    }

    preload() {
        // preloading should happen in our BootScene
        // this.load.image('mushroom', './assets/images/mushroom2.png')
        if (__DEV__){
            console.log('GameScene preload OK')
        }
    }

    create() {
        // Because we'll need that a few times later
        const _this = this

        // Add temporary sky background
        this.add.image(400, 300, 'sky')
        this.add.image(1100, 300, 'sky')
        this.add.image(1700, 300, 'sky')

        // Init. all animations
        makeAnimations(this)

        // this.add.image(400, 300, 'background-clouds')
        // this.map = this.make.tilemap({ key: 'map2' })
        this.map = this.add.tilemap('map')

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        // If the names are the same, 2nd param is not needed
        this.groundTileset = this.map.addTilesetImage('leafy_ground_sprite-32')
        // this.tileset = this.map.addTilesetImage('leafy_ground_sprite-32', 'groundTiles')

        // Create a layer, first name is layer name in the map (as in Tiled), second is our tileset created before
        this.groundLayer = this.map.createStaticLayer('Tile Layer', this.groundTileset)
        this.groundLayer.setCollisionByProperty({ collides: true })

        // This only works for impact physics
        // this.physics.world.setCollisionMapFromTilemapLayer(this.groundLayer, { defaultCollidingSlope: 1 })

        // Probably not the correct way of doing this:
        this.physics.world.bounds.width = this.map.widthInPixels

        // Player setup
        this.player = new Louwii({
            scene: this,
            key: 'louwii',
            x: 50, 
            y: this.map.heightInPixels-(32*2)
        })
        this.player.lookingUp = true
        this.player.canMove = false

        // This makes sure our ground layer and the player are colliding properly
        this.physics.add.collider(this.player, this.groundLayer)

        // Not sure what that does, it doesn't change anything to add or remove
        //  maybe because the player is already a physical object ?
        // this.physics.world.enable(this.player)

        // Add intro setup
        this.freeze = true

        let textIntroBackground = this.add.graphics()
        textIntroBackground.fillStyle(0x000000, 1)

        let textIntro = this.make.text({
            x: 32*2, // margin + padding
            y: ((this.cameras.main.height- 4*32)/2), // middle of current screen
            // scaleX: 0.5,
            // scaleY: 0.5,
            // alpha: 0,
            text: 'Hi! Welcome to the gam-ish version of my portfolio.\n\nUse the arrow keys to move around, you might find some interesting items',
            // origin: { x: 0.5, y: 0.5 },
            style: {
                font: '16px Arial',
                fill: 'white',
                align: 'left',
                wordWrap: { width: ( this.cameras.main.width - 4*32) } // screen width + 32 margin + 32 padding
            }
        })

        textIntroBackground.fillRect(32, (this.cameras.main.height- 4*32)/2 - 32, textIntro.width+(2*32), textIntro.height+2*32)

        let timeBarBackground = this.add.graphics()
        timeBarBackground.fillStyle(0xffffff, 1)
        timeBarBackground.fillRect(0, ((this.cameras.main.height- 4*32)/2 - 32)+(textIntro.height+2*32 + 4), textIntro.width+(2*32), 2)

        this.tweens.add({
            targets: timeBarBackground,
            // width: 0,
            scaleX: 0, // Trick, animating the width doesn't work ?
            ease: 'linear',
            duration: 5000,
            repeat: 0,
            onComplete: function () {
                _this.player.lookingUp = false
                timeBarBackground.setVisible(false)
                textIntroBackground.setVisible(false)
                textIntro.setVisible(false)
                setTimeout(
                    function(){
                        _this.player.go = true
                    },
                    300
                )
            }
        })

        setTimeout(
            function(){
                _this.freeze = false
                _this.player.canMove = true
                _this.player.go = false
            },
            6300
        )

        // Objects setup
        this.objectGroup = this.add.group()

        this.map.getObjectLayer("Traits Layer").objects.forEach((modifier) => {
            let properties, type

            if (modifier.properties && modifier.properties.spriteName) {
                console.log(modifier)

                if (modifier.properties.spriteName) {
                    let objectObject = this.physics.add.sprite( (modifier.x+modifier.width/2), modifier.y, modifier.properties.spriteName)
                    // Attach data to the sprite so we know what's up when in overlap event method call
                    objectObject.setName(modifier.name)
                    // This disables the overlap, we don't want that
                    // objectObject.body.immovable = true
                    // This takes care of making that sprite to not move
                    objectObject.body.moves = false

                    this.tweens.add({
                        targets: objectObject,
                        y: (modifier.y-5),
                        ease: 'Sine.easeInOut',
                        duration: 700,
                        yoyo: true,
                        repeat: -1
                    })

                    // console.log(objectObject)

                    // Add Object to group
                    this.objectGroup.add(objectObject)

                    this.physics.add.overlap(this.player, objectObject, this.collectObject, null, this)
                }
            }
        })

        // Making the overlap to the group doesn't work, we must setup overlap on each object (see above)
        // this.physics.add.overlap(this.player, this.objectGroup, this.collectObject, null, this)

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
        this.input.keyboard.on('keydown_C', function (event) {
            _this.showDebug = !_this.showDebug
            _this.drawDebug()
        })

        // Make camera follow player
        this.cameras.main.startFollow(this.player)

        // Force camera to not go above the map
        // We need that otherwise the camera follow the player and go out of the map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        // Make controls control the camera
        // this.controls = new Phaser.Cameras.Controls.Smoothed(controlConfig)

        // Create hidden elements to be displayed in the game
        // School
        this.hatGroup = this.buildTraitsTexts('I learned, but I want more', 'I have a Master degree in computer sciences and years of web exp. But I\'m still eager to learn more about web technologies to improve myself.')

        this.codeGroup = this.buildTraitsTexts('I take coding seriously', 'Performance, Security, Compliance, Evolvability, Maintainability... Producing good code isn\'t easy, I do my best to respect these important principles.')

        this.heartGroup = this.buildTraitsTexts('I\'m Passionate', 'I write lines and lines of code for all sorts of web things, in all sort of languages. And I love it !')
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
            })
        }
    }

    buildTraitsTexts(titleText, bodyText)
    {
        let image = this.add.image(0, 0, 'sprite-panel')
        image.alpha = 0
        let text = this.make.text({
            x: 0,
            y: -600,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 0,
            text: bodyText,
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: '16px Arial',
                fill: 'black',
                align: 'center',
                wordWrap: { width: 300 }
            }
        })
        // image.width = text.width + 32
        // image.height = text.height + 32
        // Calculate the scale of the image to be properly size for the text
        // The panel in the image has 24px padding all around in the PNG, we have to account for that
        let scaleWidth = (text.width + 2*24) / image.width
        image.setData('fullScaleX', scaleWidth)
        let scaleHeight = (text.height + 2*24) / image.height
        image.setData('fullScaleY', scaleHeight)
        image.scaleX = 0.3
        image.scaleY = 0.3
        text.scaleX = 0.5
        text.scaleY= 0.5
        let group = this.add.group()
        group.add(image)
        group.add(text)

        return group
    }


    collectObject(player, object)
    {
        // Disable body will disable overlap
        object.disableBody()
        object.alpha = 0
        console.log(object)
        let traitGroup
        switch (object.name) {
            case 'iconHat':
                traitGroup = this.hatGroup
                break
            case 'iconHeart':
                traitGroup = this.heartGroup
                break
            case 'iconCode':
                traitGroup = this.codeGroup
                break
            default:
                console.log('Unknown object '+object.name)
                console.log(object)
        }

        if (traitGroup) {
            let _this = this
            traitGroup.getChildren().forEach(function(child){
                if (child.type === 'Graphics') {

                } else if (child.type === 'Text') {
                    child.setPosition(object.x, (_this.cameras.main.height - 4*32)/2 )
                    _this.tweens.add({
                        targets: child,
                        alpha: 1,
                        scaleX: 1,
                        scaleY: 1,
                        ease: 'Sine.easeInOut',
                        duration: 300,
                        // delay: i * 50,
                        repeat: 0
                    })
                }
            })
        }
    }
}
