class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'creature_t1');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.tier = 1;
        this.size = 1;
        this.maxSize = 5;
        this.growth = 0;
        this.growthNeeded = 3;
        this.hp = 100;
        this.maxHp = 100;
        
        this.speed = 160;
        this.attackRange = 60;
        this._attackCooldown = 0;
        
        this.setCollideWorldBounds(true);
        this.setDepth(10);
    }

    update(cursors) {
        if (this._attackCooldown > 0) this._attackCooldown -= 16;

        const pointerPos = this.scene.input.activePointer;

        if (pointerPos.isDown) {
            const angle = Phaser.Math.Angle.Between(
                this.x, this.y,
                pointerPos.worldX, pointerPos.worldY
            );
            this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
        } else if (cursors) {
            this.body.setVelocity(0);

            if (cursors.left)  this.setVelocityX(-this.speed);
            else if (cursors.right) this.setVelocityX(this.speed);

            if (cursors.up)   this.setVelocityY(-this.speed);
            else if (cursors.down) this.setVelocityY(this.speed);
        }

        if (this.body.velocity.length() > 5) {
            const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y);
            this.rotation = angle;
        }
    }

    grow() {
        this.growth++;
        if (this.growth >= this.growthNeeded && this.tier < this.maxSize) {
            this.tier++;
            this.growth = 0;
            this.growthNeeded = this.tier * 3;
            this.updateTexture();
            this.heal(20);
        }
    }

    updateTexture() {
        if (this.tier >= 1 && this.tier <= 5) {
            this.setTexture(`creature_t${this.tier}`);
            this.size = this.tier;
            this.attackRange = 40 + this.tier * 15;
            this.speed = 140 + this.tier * 10;
            
            const scales = [1, 1.2, 1.4, 1.6, 1.8];
            this.setScale(scales[this.tier - 1]);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        
        this.scene.events.emit('playerDamaged', this.hp, this.maxHp);
        
        if (this.hp <= 0) {
            this.scene.events.emit('playerDeath');
        }
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
        this.scene.events.emit('playerDamaged', this.hp, this.maxHp);
    }
}
