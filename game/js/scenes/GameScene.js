class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.worldWidth = 4000;
        this.worldHeight = 4000;

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'background').setOrigin(0).setDepth(-10);

        this.createDecorations();
        this.createBackground();

        this.food = this.physics.add.group();
        this.creatures = this.physics.add.group();

        this.player = new Player(this, this.worldWidth / 2, this.worldHeight / 2);

        this.spawnInitialFood();
        this.spawnInitialCreatures();

        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(1);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Overlap: игрок + существа
        this.physics.add.overlap(
            this.player, this.creatures,
            (player, creature) => {
                if (!creature.isDead) this.handleCreatureCollision(player, creature);
            },
            null, this
        );

        // Overlap: игрок + еда
        this.physics.add.overlap(
            this.player, this.food,
            (player, food) => {
                if (food.active) this.eatFood(food);
            },
            null, this
        );

        this.score = 0;
        this.gameTime = 0;

        this.events.on('playerDeath', this.handlePlayerDeath, this);

        this.scene.launch('UIScene');
    }

    createDecorations() {
        // Камни и водоросли
        for (let i = 0; i < 300; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = Phaser.Math.Between(0, this.worldHeight);
            const size = Phaser.Math.Between(4, 14);
            const g = this.add.graphics();
            const type = Phaser.Math.Between(0, 2);

            if (type === 0) {
                // Зелёный водоросль
                g.fillStyle(0x1a4d1a, 0.6);
                g.fillCircle(0, 0, size);
                g.fillStyle(0x2d6b2d, 0.4);
                g.fillCircle(size * 0.3, -size * 0.3, size * 0.5);
            } else if (type === 1) {
                // Камень
                g.fillStyle(0x3d3d5a, 0.5);
                g.fillCircle(0, 0, size * 0.8);
                g.fillStyle(0x4d4d6a, 0.3);
                g.fillCircle(-size * 0.2, -size * 0.2, size * 0.35);
            } else {
                // Пузырь фоновый
                g.fillStyle(0x2a4a6a, 0.25);
                g.fillCircle(0, 0, size);
            }

            g.x = x;
            g.y = y;
            g.setDepth(-2);
        }

        // Растения
        for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = Phaser.Math.Between(0, this.worldHeight);
            const g = this.add.graphics();
            const h = Phaser.Math.Between(12, 30);

            // Стебель
            g.lineStyle(2, 0x1a4a1a, 0.6);
            g.beginPath();
            g.moveTo(0, 0);
            g.lineTo(Phaser.Math.Between(-6, 6), -h);
            g.strokePath();

            // Листья
            const leafColor = Phaser.Math.RND.pick([0x2d7a27, 0x3a8a30, 0x1a5a20]);
            g.fillStyle(leafColor, 0.55);
            g.fillEllipse(-5, -h * 0.6, 10, 5);
            g.fillEllipse(5, -h * 0.8, 10, 5);

            // Верхушка
            g.fillStyle(0x4ab04c, 0.6);
            g.fillCircle(0, -h, 4);

            g.x = x;
            g.y = y;
            g.setDepth(-1);
        }
    }

    createBackground() {
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = Phaser.Math.Between(0, this.worldHeight);
            const size = Phaser.Math.Between(2, 8);
            const alpha = Phaser.Math.FloatBetween(0.08, 0.25);

            const bubble = this.add.image(x, y, 'bubble');
            bubble.setScale(size / 16);
            bubble.setAlpha(alpha);
            bubble.setDepth(-5);

            this.tweens.add({
                targets: bubble,
                y: y - Phaser.Math.Between(30, 80),
                alpha: 0,
                duration: Phaser.Math.Between(5000, 15000),
                repeat: -1,
                onRepeat: () => {
                    bubble.x = Phaser.Math.Between(0, this.worldWidth);
                    bubble.y = Phaser.Math.Between(0, this.worldHeight);
                    bubble.alpha = Phaser.Math.FloatBetween(0.08, 0.25);
                }
            });
        }
    }

    spawnInitialFood() {
        for (let i = 0; i < 200; i++) {
            this.spawnFood();
        }
    }

    spawnFood() {
        const x = Phaser.Math.Between(50, this.worldWidth - 50);
        const y = Phaser.Math.Between(50, this.worldHeight - 50);
        const tier = Phaser.Math.Between(1, 3); // еда всегда маленькая
        const food = new Food(this, x, y, tier);
        this.food.add(food);
    }

    spawnInitialCreatures() {
        // Спавним смесь разных tier вокруг карты
        const total = 100;
        for (let i = 0; i < total; i++) {
            const tier = Phaser.Math.Between(1, 5);
            this.spawnCreature(tier);
        }
    }

    spawnCreature(tier) {
        // Спавним в случайном месте, не рядом с игроком
        let x, y;
        let attempts = 0;
        do {
            x = Phaser.Math.Between(50, this.worldWidth - 50);
            y = Phaser.Math.Between(50, this.worldHeight - 50);
            attempts++;
        } while (
            attempts < 10 &&
            Phaser.Math.Distance.Between(x, y, this.worldWidth / 2, this.worldHeight / 2) < 300
        );

        if (!tier) {
            const rand = Math.random();
            if (rand < 0.35) tier = 1;
            else if (rand < 0.6) tier = 2;
            else if (rand < 0.8) tier = 3;
            else if (rand < 0.93) tier = 4;
            else tier = 5;
        }

        const type = Math.random() < 0.4 ? 'green' : 'red';
        const creature = new Creature(this, x, y, tier, type);
        this.creatures.add(creature);
        return creature;
    }

    handleCreatureCollision(player, creature) {
        if (creature.isDead) return;

        if (creature.tier < player.tier) {
            // Игрок наносит урон существу
            if (!player._attackCooldown || player._attackCooldown <= 0) {
                const dead = creature.takeDamage(player.tier * 15);
                player._attackCooldown = 400;
                if (dead) {
                    this.eatCreature(creature);
                }
            }
        } else if (creature.tier > player.tier) {
            // Существо наносит урон игроку
            if (!this._damageCooldown || this._damageCooldown <= 0) {
                this.takeDamageFromCreature(creature);
                this._damageCooldown = 700;
            }
        } else {
            // Одинаковый tier — слабый урон обоим
            if (!this._damageCooldown || this._damageCooldown <= 0) {
                this.player.takeDamage(5);
                creature.takeDamage(5);
                this._damageCooldown = 600;
            }
        }
    }

    eatCreature(creature) {
        if (creature.isDead) return;
        creature.die();

        this.score++;
        this.player.grow();

        this.events.emit('scoreUpdated', this.score);
        this.events.emit('growthUpdated', this.player.growth, this.player.growthNeeded, this.player.tier);

        this.checkWinCondition();

        this.cameras.main.flash(60, 80, 220, 80, false);

        // Респавн через 5 секунд
        this.time.delayedCall(5000, () => {
            if (creature && creature.respawn) {
                creature.respawn(this.worldWidth, this.worldHeight);
            }
        });
    }

    eatFood(food) {
        if (!food || !food.active) return;
        food.setActive(false);
        food.setVisible(false);
        food.destroy();

        this.player.grow();
        this.events.emit('growthUpdated', this.player.growth, this.player.growthNeeded, this.player.tier);
        this.checkWinCondition();
    }

    takeDamageFromCreature(creature) {
        const damage = creature.tier * 8;
        this.player.takeDamage(damage);

        const angle = Phaser.Math.Angle.Between(creature.x, creature.y, this.player.x, this.player.y);
        this.player.body.velocity.x += Math.cos(angle) * 120;
        this.player.body.velocity.y += Math.sin(angle) * 120;

        this.cameras.main.shake(150, 0.008);
    }

    checkWinCondition() {
        if (this.player.tier >= 5) {
            this.events.emit('gameWin');
        }
    }

    handlePlayerDeath() {
        this.scene.pause();
        this.scene.stop('UIScene');
        this.scene.launch('UIScene', { gameOver: true, score: this.score, tier: this.player.tier });
    }

    update(time, delta) {
        this.gameTime += delta;

        if (this._damageCooldown > 0) this._damageCooldown -= delta;

        const allCreatures = this.creatures.getChildren().filter(c => !c.isDead);

        for (const creature of allCreatures) {
            creature.update(this.player, delta, allCreatures, this.food);
            creature.checkBounds({ width: this.worldWidth, height: this.worldHeight });
        }

        // Управление игроком
        const cursors = {
            up: this.cursors.up.isDown || this.wasd.up.isDown,
            down: this.cursors.down.isDown || this.wasd.down.isDown,
            left: this.cursors.left.isDown || this.wasd.left.isDown,
            right: this.cursors.right.isDown || this.wasd.right.isDown,
        };
        this.player.update(cursors);

        // Поддерживаем популяцию существ
        const activeCreatures = this.creatures.countActive();
        if (activeCreatures < 80 && Math.random() < 0.03) {
            this.spawnCreature();
        }

        // Поддерживаем количество еды
        const activeFood = this.food.getChildren().filter(f => f.active).length;
        if (activeFood < 180 && Math.random() < 0.08) {
            this.spawnFood();
        }
    }
}
