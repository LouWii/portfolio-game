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

        this.setBounce(0.2)
        this.setCollideWorldBounds(true)

        // State
        this.jumping = false
        this.jumped = false
        this.lastDirection = 'right'
    }

    update(controls, time, delta) {

        this.scene.physics.collide(this, this.groundLayer)

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
        if (input.left){
            this.lastDirection = 'left'
            animDirection = true
            this.setVelocityX(-160)

            if (this.jumping) {
                this.anims.play('jumping-left')
            } else {
                this.anims.play('left', true)
            }
        } else if (input.right) {
            this.lastDirection = 'right'
            animDirection = true
            this.setVelocityX(160)

            if (this.jumping) {
                this.anims.play('jumping-right')
            } else {
                this.anims.play('right', true)
            }
        } else {
            this.setVelocityX(0)

            if (!this.jumping) {
                if (this.lastDirection === 'left') {
                    this.anims.play('stand-left')
                } else {
                    this.anims.play('stand-right')
                }
            }
        }

        if (input.up && this.body.blocked.down && !this.jumped) {
            this.setVelocityY(-330)
            this.jumping = true
            this.jumped = true

            if (!animDirection) {
                if (this.lastDirection === 'left') {
                    this.anims.play('jumping-left')
                } else {
                    this.anims.play('jumping-right')
                }
            }
        }

        if (this.jumped && !input.up) {
            this.jumped = false
        }
    }
}