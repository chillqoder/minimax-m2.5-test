class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.createBackground();
        this.createParticles();
        this.createLogo();
        this.createStartButton();
        this.createFooter();
        
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    }

    createBackground() {
        const graphics = this.add.graphics();
        
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const radius = Phaser.Math.Between(100, 300);
            
            const r = Phaser.Math.Between(10, 30);
            const g = Phaser.Math.Between(20, 50);
            const b = Phaser.Math.Between(40, 80);
            
            graphics.fillStyle((r << 16) | (g << 8) | b, 0.3);
            graphics.fillCircle(x, y, radius);
        }
        
        graphics.setDepth(-10);
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(4, 20);
            
            const colors = [0x6ab04c, 0x27ae60, 0x2ecc71, 0x1abc9c, 0x3498db];
            const color = Phaser.Math.RND.pick(colors);
            
            const particle = this.add.graphics();
            particle.fillStyle(color, Phaser.Math.FloatBetween(0.1, 0.4));
            particle.fillCircle(0, 0, size);
            particle.x = x;
            particle.y = y;
            particle.setDepth(-5);
            
            particle.targetX = x + Phaser.Math.Between(-200, 200);
            particle.targetY = y + Phaser.Math.Between(-200, 200);
            particle.speed = Phaser.Math.FloatBetween(0.2, 0.8);
            particle.baseSize = size;
            
            this.particles.push(particle);
            
            this.tweens.add({
                targets: particle,
                x: particle.targetX,
                y: particle.targetY,
                scale: Phaser.Math.FloatBetween(0.5, 1.5),
                duration: Phaser.Math.Between(3000, 8000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.particles.forEach(p => {
                    p.alpha = Phaser.Math.FloatBetween(0.1, 0.4);
                });
            },
            loop: true
        });
    }

    createLogo() {
        const centerX = 400;
        
        const titleContainer = this.add.container(centerX, 180);
        
        const titleGlow = this.add.text(0, 0, 'CELL STAGE', {
            fontSize: '72px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#6ab04c'
        }).setOrigin(0.5);
        titleGlow.setAlpha(0.3);
        titleGlow.setBlur = 20;
        
        const title = this.add.text(0, 0, 'CELL STAGE', {
            fontSize: '72px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#6ab04c',
            stroke: '#1a3c13',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(0, 55, 'SURVIVAL', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: '#3498db'
        }).setOrigin(0.5);
        
        titleContainer.add([titleGlow, title, subtitle]);
        
        this.tweens.add({
            targets: titleContainer,
            y: 175,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
            targets: [title, subtitle],
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createStartButton() {
        const centerX = 400;
        const buttonY = 380;
        
        const buttonContainer = this.add.container(centerX, buttonY);
        
        const buttonBg = this.add.graphics();
        buttonContainer.add(buttonBg);
        
        const drawButton = (scale = 1, alpha = 1) => {
            buttonBg.clear();
            
            const width = 280;
            const height = 70;
            const radius = 35;
            
            buttonBg.fillStyle(0x27ae60, 0.8 * alpha);
            buttonBg.fillRoundedRect(-width/2 * scale, -height/2 * scale, width * scale, height * scale, radius * scale);
            
            buttonBg.lineStyle(3 * scale, 0x2ecc71, alpha);
            buttonBg.strokeRoundedRect(-width/2 * scale, -height/2 * scale, width * scale, height * scale, radius * scale);
        };
        
        drawButton();
        
        const buttonText = this.add.text(0, 0, 'START GAME', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        buttonContainer.add(buttonText);
        
        const glowText = this.add.text(0, 0, 'START GAME', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: '#2ecc71'
        }).setOrigin(0.5).setAlpha(0.5);
        buttonContainer.add(glowText);
        glowText.setDepth(-1);
        
        this.tweens.add({
            targets: glowText,
            scale: 1.1,
            alpha: 0.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        buttonContainer.setSize(280, 70);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            drawButton(1.1, 1);
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            drawButton(1, 1);
        });
        
        buttonContainer.on('pointerdown', () => {
            drawButton(0.95, 1);
            this.tweens.add({
                targets: buttonContainer,
                scale: 0.95,
                duration: 50,
                yoyo: true
            });
        });
        
        buttonContainer.on('pointerup', () => {
            this.startGame();
        });
        
        this.startButton = buttonContainer;
    }

    createFooter() {
        const controlsText = this.add.text(400, 480, 'WASD / Arrow Keys to move | Click to eat smaller cells', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#666666'
        }).setOrigin(0.5);
        
        const versionText = this.add.text(400, 580, 'v1.0', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            color: '#444444'
        }).setOrigin(0.5);
    }

    startGame() {
        this.cameras.main.fade(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('BootScene');
        });
    }

    update(time) {
        this.particles.forEach((p, i) => {
            const wave = Math.sin(time * 0.001 + i * 0.1) * 2;
            p.y += wave * 0.1;
        });
    }
}
