// Create the application helper and add its render target to the page
const app = new PIXI.Application();
await app.init({background: '#ffefd5', resizeTo: window}); // so nnow we need to resize our actual app, cause app is always full window
document.body.appendChild(app.canvas);

// Create the sprite and add it to the stage
await PIXI.Assets.load('./assets/sprites/shield.png');
let sprite = PIXI.Sprite.from('./assets/sprites/shield.png');
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});