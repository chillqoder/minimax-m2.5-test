class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.createTextures();
        this.createBackgroundTexture();
        this.createBubbleTexture();
        this.createFoodTextures();
        
        this.time.delayedCall(100, () => {
            this.scene.start('GameScene');
        });
    }

    createTextures() {
        const palette = TextureGen.getPalette();
        const pixelSize = 3;
        
        TextureGen.generateCreatureTexture(
            this, 'creature_t1',
            TextureGen.getTier1Template(),
            pixelSize,
            [null, palette.membrane, palette.bodyLight, palette.eyeWhite, palette.eyePupil, palette.bodyDark, palette.organelle1, palette.organelle2]
        );
        
        TextureGen.generateCreatureTexture(
            this, 'creature_t2',
            TextureGen.getTier2Template(),
            pixelSize,
            [null, palette.membrane, palette.bodyLight, palette.eyeWhite, palette.eyePupil, palette.bodyDark, palette.organelle1, palette.organelle2]
        );
        
        TextureGen.generateCreatureTexture(
            this, 'creature_t3',
            TextureGen.getTier3Template(),
            pixelSize,
            [null, palette.membrane, palette.bodyLight, palette.eyeWhite, palette.eyePupil, palette.bodyDark, palette.organelle1, palette.organelle2]
        );
        
        TextureGen.generateCreatureTexture(
            this, 'creature_t4',
            TextureGen.getTier4Template(),
            pixelSize,
            [null, palette.membrane, palette.bodyLight, palette.eyeWhite, palette.eyePupil, palette.bodyDark, palette.organelle1, palette.organelle2]
        );
        
        TextureGen.generateCreatureTexture(
            this, 'creature_t5',
            TextureGen.getTier5Template(),
            pixelSize,
            [null, palette.membrane, palette.bodyLight, palette.eyeWhite, palette.eyePupil, palette.bodyDark, palette.organelle1, palette.organelle2]
        );
    }

    createBackgroundTexture() {
        TextureGen.getBackgroundTexture(this, 'background', 800, 600);
    }

    createBubbleTexture() {
        TextureGen.generateBubbleTexture(this, 'bubble', 16);
    }
    
    createFoodTextures() {
        const foodTemplates = TextureGen.getFoodTemplates();
        const pixelSize = 2;
        
        for (let tier = 1; tier <= 5; tier++) {
            const key = `food_t${tier}`;
            TextureGen.generateFoodTexture(this, key, foodTemplates[key], pixelSize);
        }
    }
}
