class Food extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, tier) {
        const textureKey = `food_t${tier}`;
        super(scene, x, y, textureKey);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.tier = tier || 1;
        this.size = this.tier;
        
        const scales = [0.4, 0.5, 0.6, 0.7, 0.8];
        this.setScale(scales[this.tier - 1]);
        
        this.setDepth(2);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        
        const baseScaleX = this.scaleX;
        const baseScaleY = this.scaleY;
        
        scene.tweens.add({
            targets: this,
            scaleX: baseScaleX * 1.15,
            scaleY: baseScaleY * 1.15,
            alpha: 0.7,
            duration: Phaser.Math.Between(1000, 2000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
