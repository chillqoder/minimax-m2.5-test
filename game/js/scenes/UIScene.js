class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    init(data) {
        this.gameOver = data.gameOver || false;
        this.finalScore = data.score || 0;
        this.finalTier = data.tier || 1;
    }

    create() {
        this.score = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.growth = 0;
        this.growthNeeded = 3;
        this.tier = 1;
        
        this.createHUD();

        // Слушаем события из GameScene напрямую
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('scoreUpdated', this.updateScore, this);
        gameScene.events.on('growthUpdated', this.updateGrowth, this);
        gameScene.events.on('playerDamaged', this.updateHp, this);
        gameScene.events.on('playerDeath', this.showGameOver, this);
        gameScene.events.on('gameWin', this.showWin, this);
    }

    createHUD() {
        this.hpBarBg = this.add.graphics();
        this.hpBarBg.fillStyle(0x333333, 1);
        this.hpBarBg.fillRect(20, 20, 200, 20);
        this.hpBarBg.setScrollFactor(0);
        
        this.hpBar = this.add.graphics();
        this.hpBar.fillStyle(0xe74c3c, 1);
        this.hpBar.fillRect(22, 22, 196, 16);
        this.hpBar.setScrollFactor(0);
        
        this.hpLabel = this.add.text(25, 22, 'HP', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setScrollFactor(0);
        
        this.growthBarBg = this.add.graphics();
        this.growthBarBg.fillStyle(0x333333, 1);
        this.growthBarBg.fillRect(20, 50, 200, 20);
        this.growthBarBg.setScrollFactor(0);
        
        this.growthBar = this.add.graphics();
        this.growthBar.fillStyle(0x27ae60, 1);
        this.growthBar.fillRect(22, 52, 0, 16);
        this.growthBar.setScrollFactor(0);
        
        this.growthLabel = this.add.text(25, 52, 'GROWTH', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setScrollFactor(0);
        
        this.tierText = this.add.text(20, 80, 'TIER: 1', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#f1c40f'
        }).setScrollFactor(0);
        
        this.scoreText = this.add.text(20, 105, 'EATEN: 0', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#3498db'
        }).setScrollFactor(0);
        
        this.instructionText = this.add.text(400, 550, 'WASD/Arrows to move | Click creatures to eat', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5).setScrollFactor(0);
    }

    updateScore(score) {
        this.score = score;
        this.scoreText.setText('EATEN: ' + this.score);
    }

    updateGrowth(growth, needed, tier) {
        this.growth = growth;
        this.growthNeeded = needed;
        this.tier = tier;
        
        this.tierText.setText('TIER: ' + this.tier);
        
        const barWidth = (growth / needed) * 196;
        this.growthBar.clear();
        this.growthBar.fillStyle(0x27ae60, 1);
        this.growthBar.fillRect(22, 52, barWidth, 16);
    }

    updateHp(hp, maxHp) {
        this.hp = hp;
        this.maxHp = maxHp;
        
        const barWidth = (hp / maxHp) * 196;
        this.hpBar.clear();
        
        let color = 0xe74c3c;
        if (hp > maxHp * 0.6) color = 0x27ae60;
        else if (hp > maxHp * 0.3) color = 0xf39c12;
        
        this.hpBar.fillStyle(color, 1);
        this.hpBar.fillRect(22, 22, barWidth, 16);
    }

    showGameOver() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setScrollFactor(0).setDepth(100);
        
        this.add.text(400, 220, 'GAME OVER', {
            fontSize: '48px',
            fontFamily: 'monospace',
            color: '#e74c3c'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.add.text(400, 300, 'Creatures Eaten: ' + this.score, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.add.text(400, 340, 'Max Tier Reached: ' + this.tier, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        const restartBtn = this.add.text(400, 420, '[ RESTART ]', {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#3498db'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        restartBtn.setInteractive({ useHandCursor: true });
        restartBtn.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
            this.scene.stop('UIScene');
        });
    }

    showWin() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setScrollFactor(0).setDepth(100);
        
        this.add.text(400, 220, 'EVOLUTION COMPLETE!', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#f1c40f'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.add.text(400, 280, 'You have reached the apex predator!', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.add.text(400, 320, 'Creatures Eaten: ' + this.score, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#3498db'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        const playAgainBtn = this.add.text(400, 400, '[ PLAY AGAIN ]', {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#27ae60'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        playAgainBtn.setInteractive({ useHandCursor: true });
        playAgainBtn.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
            this.scene.stop('UIScene');
        });
    }
}
