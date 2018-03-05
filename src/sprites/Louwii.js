export default class Louwii extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key)

        // Add Object as a physical entity
        this.scene = config.scene
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        // Physical properties
        // this.acceleration = 600
        // this.body.maxVelocity.x = 200
        // this.body.maxVelocity.y = 500

        this.setBounce(0)
        this.setCollideWorldBounds(true)

        this.velocityX = 180

        // State
        this.jumping = false
        this.jumped = false
        this.lastDirection = 'right'
        this.canMove = true
        this.lookingUp = false
        this.go = false
    }

    update(controls, time, delta) {

        // This line doesn't even seem to be needed
        // this.scene.physics.collide(this, this.groundLayer)

        // console.log(this.body.velocity.y) 

        // TODO: use that once we've setup touch controls
        // const input = {
        //     left: controls.left.isDown || this.scene.touchControls.left,
        //     right: controls.right.isDown || this.scene.touchControls.right,
        //     down: controls.down.isDown || this.scene.touchControls.down,
        //     jump: controls.jump.isDown || controls.jump2.isDown || this.scene.touchControls.jump,
        // }

        const input = {
            left: controls.left.isDown,
            right: controls.right.isDown,
            down: controls.down.isDown,
            up: controls.up.isDown,
        }

        if (this.body.blocked.down) {
            this.jumping = false
        }

        // Animation and movements
        let animDirection = false
        if (this.canMove && input.left){
            this.lastDirection = 'left'
            animDirection = true
            this.setVelocityX(-(this.velocityX))

            if (this.jumping) {
                this.anims.play('player-jumping-left')
            } else {
                this.anims.play('player-left', true)
            }
        } else if (this.canMove && input.right) {
            this.lastDirection = 'right'
            animDirection = true
            this.setVelocityX(this.velocityX)

            if (this.jumping) {
                this.anims.play('player-jumping-right')
            } else {
                this.anims.play('player-right', true)
            }
        } else {
            this.setVelocityX(0)

            if (!this.jumping) {
                if (this.lastDirection === 'left') {
                    this.anims.play('player-stand-left')
                } else {
                    this.anims.play('player-stand-right')
                }
            }
        }

        if (this.canMove && input.up && this.body.blocked.down && !this.jumped) {
            this.setVelocityY(-330)
            this.jumping = true
            this.jumped = true

            if (!animDirection) {
                if (this.lastDirection === 'left') {
                    this.anims.play('player-jumping-left')
                } else {
                    this.anims.play('player-jumping-right')
                }
            }
        }

        if (this.lookingUp) {
            this.anims.play('player-looking-up')
        }

        if (this.go) {
            this.anims.play('player-go')
        }

        if (this.jumped && !input.up && !this.jumping) {
            this.jumped = false
        }
    }
}