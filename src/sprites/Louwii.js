export default class Louwii extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key)

        // TODO : Check what that does
        config.scene.physics.world.enable(this)
        config.scene.add.existing(this)

        // Physical properties
        this.acceleration = 600
        this.body.maxVelocity.x = 200
        this.body.maxVelocity.y = 500

        // State
        this.jumping = false
    }
}