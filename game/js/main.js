const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0a0a12',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        MenuScene,
        BootScene,
        GameScene,
        UIScene
    ]
};

const game = new Phaser.Game(config);
