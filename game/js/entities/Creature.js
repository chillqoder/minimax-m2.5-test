class Creature extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tier, type) {
        const textureKey = `creature_t${Phaser.Math.Between(1, 5)}`;
        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tier = tier || Phaser.Math.Between(1, 5);
        this.type = type || (Math.random() < 0.4 ? 'green' : 'red');

        if (this.type === 'red') {
            this.setTint(0xff4444);
        } else {
            this.setTint(0x44cc44);
        }

        const baseScale = 0.6 + this.tier * 0.22;
        const randomScale = baseScale * Phaser.Math.FloatBetween(0.75, 1.25);
        this.setScale(randomScale);

        // HP зависит от tier
        this.maxHp = this.tier * 20 + 10;
        this.hp = this.maxHp;

        this.baseSpeed = 55 + (5 - this.tier) * 12 + Phaser.Math.Between(-10, 10);
        this.speed = this.baseSpeed;

        this.state = 'wander';
        this.target = null;
        this.wanderTimer = 0;
        this.wanderDirection = Phaser.Math.FloatBetween(0, Math.PI * 2);

        this.setCollideWorldBounds(true);
        this.setBounce(0.3);
        this.setDepth(5);

        this.isDead = false;
        this._eatCooldown = 0;
        this._damageCooldown = 0;

        // HP бар над существом
        this._hpBar = scene.add.graphics();
        this._hpBar.setDepth(20);
        this._updateHpBar();
    }

    _updateHpBar() {
        const bar = this._hpBar;
        bar.clear();

        const barW = 30;
        const barH = 4;
        const offsetY = -(this.displayHeight / 2 + 8);

        // Фон
        bar.fillStyle(0x333333, 0.8);
        bar.fillRect(this.x - barW / 2, this.y + offsetY, barW, barH);

        // Заполнение
        const ratio = Math.max(0, this.hp / this.maxHp);
        const color = ratio > 0.5 ? 0x44cc44 : ratio > 0.25 ? 0xffaa00 : 0xff3333;
        bar.fillStyle(color, 1);
        bar.fillRect(this.x - barW / 2, this.y + offsetY, barW * ratio, barH);
    }

    takeDamage(amount) {
        if (this._damageCooldown > 0) return false;
        this.hp -= amount;
        this._damageCooldown = 300;

        // Мигаем белым
        this.setTint(0xffffff);
        this.scene.time.delayedCall(120, () => {
            if (!this.isDead) {
                this.setTint(this.type === 'red' ? 0xff4444 : 0x44cc44);
            }
        });

        this._updateHpBar();

        if (this.hp <= 0) {
            return true; // сигнал смерти
        }
        return false;
    }

    update(player, delta, allCreatures, foodGroup) {
        if (this.isDead) return;
        if (!player) return;

        this._eatCooldown -= delta;
        this._damageCooldown -= delta;

        if (this.type === 'green') {
            this._updateGreen(player, delta, allCreatures, foodGroup);
        } else {
            this._updateRed(player, delta, allCreatures);
        }

        if (this.body.velocity.length() > 5) {
            const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y);
            this.rotation = angle;
        }

        this._updateHpBar();
    }

    _updateGreen(player, delta, allCreatures, foodGroup) {
        const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        let threat = null;
        let threatDist = 999999;

        if (player.tier >= this.tier && distToPlayer < 220) {
            threat = player;
            threatDist = distToPlayer;
        }

        for (const c of allCreatures) {
            if (c === this || c.isDead) continue;
            if (c.type === 'red' && c.tier >= this.tier) {
                const d = Phaser.Math.Distance.Between(this.x, this.y, c.x, c.y);
                if (d < 250 && d < threatDist) {
                    threat = c;
                    threatDist = d;
                }
            }
        }

        if (threat) {
            this.state = 'flee';
            this.target = threat;
            this._flee(this.target);
            return;
        }

        // Ищем ближайшую еду
        let closestFood = null;
        let closestFoodDist = 300;

        if (foodGroup) {
            for (const food of foodGroup.getChildren()) {
                if (!food.active) continue;
                const d = Phaser.Math.Distance.Between(this.x, this.y, food.x, food.y);
                if (d < closestFoodDist) {
                    closestFoodDist = d;
                    closestFood = food;
                }
            }
        }

        if (closestFood) {
            this.state = 'eat_food';
            this.target = closestFood;
            this._chaseTarget(closestFood, this.speed * 0.7);

            if (closestFoodDist < 20 && this._eatCooldown <= 0) {
                closestFood.destroy();
                this._eatCooldown = 500;
            }
        } else {
            this.state = 'wander';
            this._wander(delta);
        }
    }

    _updateRed(player, delta, allCreatures) {
        const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (player.tier > this.tier && distToPlayer < 220) {
            this.state = 'flee';
            this.target = player;
            this._flee(player);
            return;
        }

        let bestTarget = null;
        let bestDist = 350;

        if (player.tier <= this.tier && distToPlayer < bestDist) {
            bestTarget = player;
            bestDist = distToPlayer;
        }

        for (const c of allCreatures) {
            if (c === this || c.isDead) continue;
            if (c.tier < this.tier) {
                const d = Phaser.Math.Distance.Between(this.x, this.y, c.x, c.y);
                if (d < bestDist) {
                    bestDist = d;
                    bestTarget = c;
                }
            }
        }

        if (bestTarget) {
            this.state = 'chase';
            this.target = bestTarget;
            this._chaseTarget(bestTarget, this.speed);
        } else {
            this.state = 'wander';
            this._wander(delta);
        }
    }

    _flee(threat) {
        const angle = Phaser.Math.Angle.Between(threat.x, threat.y, this.x, this.y);
        this.scene.physics.velocityFromRotation(angle, this.speed * 1.3, this.body.velocity);
    }

    _chaseTarget(target, speed) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
    }

    _wander(delta) {
        this.wanderTimer -= delta;
        if (this.wanderTimer <= 0) {
            this.wanderDirection = Phaser.Math.FloatBetween(0, Math.PI * 2);
            this.wanderTimer = Phaser.Math.Between(1500, 4000);
        }
        this.scene.physics.velocityFromRotation(this.wanderDirection, this.speed * 0.5, this.body.velocity);
    }

    respawn(worldWidth, worldHeight) {
        this.isDead = false;
        this.setActive(true);
        this.setVisible(true);
        this.body.setEnable(true);

        this.hp = this.maxHp;
        this._hpBar.setVisible(true);

        this.x = Phaser.Math.Between(100, worldWidth - 100);
        this.y = Phaser.Math.Between(100, worldHeight - 100);

        this.state = 'wander';
        this.target = null;
        this.setTint(this.type === 'red' ? 0xff4444 : 0x44cc44);
        this._updateHpBar();
    }

    checkBounds(worldBounds) {
        const margin = 80;
        if (this.x < margin) {
            this.body.velocity.x = Math.abs(this.body.velocity.x);
            this.wanderDirection = Phaser.Math.FloatBetween(-Math.PI / 2, Math.PI / 2);
        }
        if (this.x > worldBounds.width - margin) {
            this.body.velocity.x = -Math.abs(this.body.velocity.x);
            this.wanderDirection = Phaser.Math.FloatBetween(Math.PI / 2, Math.PI * 1.5);
        }
        if (this.y < margin) {
            this.body.velocity.y = Math.abs(this.body.velocity.y);
            this.wanderDirection = Phaser.Math.FloatBetween(0, Math.PI);
        }
        if (this.y > worldBounds.height - margin) {
            this.body.velocity.y = -Math.abs(this.body.velocity.y);
            this.wanderDirection = Phaser.Math.FloatBetween(Math.PI, Math.PI * 2);
        }
    }

    die() {
        this.isDead = true;
        this.setActive(false);
        this.setVisible(false);
        this.body.setEnable(false);
        this._hpBar.setVisible(false);
        this.target = null;
    }

    destroy(fromScene) {
        if (this._hpBar) this._hpBar.destroy();
        super.destroy(fromScene);
    }
}
