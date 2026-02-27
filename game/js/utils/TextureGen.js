class TextureGen {
    static generateCreatureTexture(scene, key, pixelMap, pixelSize, palette) {
        const rows = pixelMap.length;
        const cols = pixelMap[0].length;
        const width = cols * pixelSize;
        const height = rows * pixelSize;

        const graphics = scene.add.graphics();

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const colorIndex = pixelMap[y][x];
                if (colorIndex !== null && palette[colorIndex]) {
                    graphics.fillStyle(palette[colorIndex], 1);
                    graphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    static getPalette() {
        return {
            transparent: null,
            bodyDark: 0x2d5a27,
            bodyLight: 0x6ab04c,
            eyeWhite: 0xffffff,
            eyePupil: 0x1a1a2e,
            membrane: 0x1a3c13,
            organelle1: 0xe17055,
            organelle2: 0xfdcb6e
        };
    }

    static getTier1Template() {
        return [
            [null, null, 2, 2, 2, 2, null, null],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 3, 3, 2, 2, 2],
            [2, 2, 2, 3, 3, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [null, null, 2, 2, 2, 2, null, null]
        ];
    }

    static getFoodTemplates() {
        return {
            food_t1: {
                map: [
                    [null, 1, 1, null],
                    [1, 1, 1, 1],
                    [1, 1, 1, 1],
                    [null, 1, 1, null]
                ],
                color: 0x2ecc71
            },
            food_t2: {
                map: [
                    [null, 1, 1, 1, null],
                    [1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1],
                    [null, 1, 1, 1, null]
                ],
                color: 0x27ae60
            },
            food_t3: {
                map: [
                    [null, null, 1, 1, 1, null, null],
                    [null, 1, 1, 1, 1, 1, null],
                    [1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1],
                    [null, 1, 1, 1, 1, 1, null],
                    [null, null, 1, 1, 1, null, null]
                ],
                color: 0x1abc9c
            },
            food_t4: {
                map: [
                    [null, null, 1, 1, 1, 1, null, null],
                    [null, 1, 1, 1, 1, 1, 1, null],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [null, 1, 1, 1, 1, 1, 1, null],
                    [null, null, 1, 1, 1, 1, null, null]
                ],
                color: 0x3498db
            },
            food_t5: {
                map: [
                    [null, null, null, 1, 1, 1, null, null, null],
                    [null, null, 1, 1, 1, 1, 1, null, null],
                    [null, 1, 1, 1, 1, 1, 1, 1, null],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [null, 1, 1, 1, 1, 1, 1, 1, null],
                    [null, null, 1, 1, 1, 1, 1, null, null],
                    [null, null, null, 1, 1, 1, null, null, null]
                ],
                color: 0x9b59b6
            }
        };
    }

    static generateFoodTexture(scene, key, template, pixelSize) {
        const map = template.map;
        const rows = map.length;
        const cols = map[0].length;
        const width = cols * pixelSize;
        const height = rows * pixelSize;

        const graphics = scene.add.graphics();

        graphics.fillStyle(template.color, 1);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (map[y][x] === 1) {
                    graphics.fillCircle(x * pixelSize + pixelSize/2, y * pixelSize + pixelSize/2, pixelSize/2);
                }
            }
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    static getTier2Template() {
        return [
            [null, 2, 2, 2, 2, 2, 2, null],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 3, 3, 2, 2, 2],
            [2, 2, 2, 3, 6, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [null, 2, 2, 2, 2, 2, 2, null],
            [null, null, 2, 2, 2, 2, null, null],
            [null, null, null, 2, 2, null, null, null],
            [null, null, null, 2, 2, null, null, null],
            [null, null, 2, 2, 2, 2, null, null]
        ];
    }

    static getTier3Template() {
        return [
            [null, null, 2, 2, 2, 2, 2, null, null],
            [null, 2, 2, 2, 2, 2, 2, 2, null],
            [2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 3, 3, 2, 6, 2, 2],
            [2, 2, 2, 3, 3, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 6, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2],
            [null, 2, 2, 2, 2, 2, 2, 2, null],
            [null, null, 2, 2, 2, 2, 2, null, null],
            [null, 1, 1, null, null, null, 1, 1, null],
            [1, 1, 1, null, null, null, 1, 1, 1],
            [1, 1, 1, null, null, null, 1, 1, 1],
            [null, 1, 1, null, null, null, 1, 1, null],
            [null, null, 2, 2, 2, 2, 2, null, null],
            [null, null, null, 2, 2, 2, null, null, null],
            [null, null, 2, 2, 2, 2, 2, null, null]
        ];
    }

    static getTier4Template() {
        return [
            [null, null, null, 1, 1, 1, null, null, null, null],
            [null, null, 1, 2, 2, 2, 1, null, null, null],
            [null, 1, 2, 2, 2, 2, 2, 1, null, null],
            [1, 2, 2, 2, 2, 2, 2, 2, 1, null],
            [1, 2, 2, 3, 3, 2, 2, 6, 2, 1],
            [1, 2, 2, 3, 3, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 6, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [null, 1, 2, 2, 2, 2, 2, 2, 1, null],
            [null, null, 1, 2, 2, 2, 2, 1, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, 1, 1, null, null, 1, 1, null, null],
            [null, 1, 1, null, null, null, null, 1, 1, null],
            [1, 1, null, null, null, null, null, null, 1, 1],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, null, 1, 1, null, null, null, null]
        ];
    }

    static getTier5Template() {
        return [
            [null, null, null, null, 1, 1, 1, 1, null, null, null, null],
            [null, null, null, 1, 2, 2, 2, 2, 1, null, null, null],
            [null, null, 1, 2, 2, 2, 2, 2, 2, 1, null, null],
            [null, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, null],
            [1, 2, 2, 3, 3, 2, 2, 2, 6, 2, 2, 1],
            [1, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [null, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, null],
            [null, null, 1, 2, 2, 2, 2, 2, 2, 1, null, null],
            [null, null, null, 1, 1, 2, 2, 1, 1, null, null, null],
            [null, null, 1, 1, null, 1, 1, null, 1, 1, null, null],
            [null, 1, 1, null, null, null, null, null, 1, 1, null],
            [1, 1, null, null, null, null, null, null, null, 1, 1],
            [null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, 1, 1, 1, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 1, 1, 1, 1, 1, 1, null, null],
            [null, null, 1, 1, 1, 1, 1, 1, 1, 1, null, null],
            [null, null, null, 1, 1, 1, 1, 1, null, null, null, null],
            [null, null, null, null, 1, 1, 1, null, null, null, null, null],
            [null, null, null, null, 1, 1, 1, null, null, null, null, null]
        ];
    }

    static getBackgroundTexture(scene, key, width, height) {
        const graphics = scene.add.graphics();
        
        const gradientSteps = 20;
        const stepHeight = height / gradientSteps;
        
        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / gradientSteps;
            const r = Math.floor(10 + ratio * 5);
            const g = Math.floor(10 + ratio * 15);
            const b = Math.floor(18 + ratio * 25);
            const color = (r << 16) | (g << 8) | b;
            
            graphics.fillStyle(color, 1);
            graphics.fillRect(0, i * stepHeight, width, stepHeight + 1);
        }
        
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    static generateBubbleTexture(scene, key, size) {
        const graphics = scene.add.graphics();
        const center = size / 2;
        const radius = size / 2 - 1;
        
        graphics.fillStyle(0x4a6fa5, 0.3);
        graphics.fillCircle(center, center, radius);
        
        graphics.lineStyle(1, 0x6a8fc5, 0.5);
        graphics.strokeCircle(center, center, radius);
        
        graphics.fillStyle(0xffffff, 0.7);
        graphics.fillCircle(center - radius * 0.3, center - radius * 0.3, radius * 0.2);
        
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }
}
