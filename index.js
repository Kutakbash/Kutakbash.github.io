console.log("Hi there");

// import fckng pixi
import PIXI_B from './assets/pixi.js';
let exports = {}
exports = PIXI_B(exports)
const PIXI = exports
//console.log(Object.keys(PIXI))

// create pixijs app
const app = new PIXI.Application();
globalThis.__PIXI_APP__ = app;
// intialize app
//await app.init({background: '#ffefd5', resizeTo: window});
await app.init({ background: '#ffefd5', width: 400, height: 800 });
// add app's canvas into DOM
document.body.appendChild(app.canvas);

// save screen height to scale everything (default resolution is 400x800 pixels)
const defaultWidth = 800;
const defaultHeight = 400;
const screenWidth = app.screen.width;
const screenHeight = app.screen.height;

// LOAD TEXTURES
let appleTexture = await PIXI.Assets.load('./assets/sprites/apple.png');
const shieldTexture = await PIXI.Assets.load('./assets/sprites/shield.png');
const knifeTexture = await PIXI.Assets.load('./assets/sprites/knife.png');
const horizontalLineTexture = await PIXI.Assets.load('./assets/sprites/horizontalLine.png');
const verticalLineTexture = await PIXI.Assets.load('./assets/sprites/verticalLine.png');

// variable for game logic
let knives = [];
const shieldSize = 4;
const shieldPosX = screenWidth * 0.5;
const shieldPosY = screenHeight * 0.25;
const knifeSize = 3;
const knifeSpeed = 20;
const knifePosX = screenWidth * 0.5;
const knifePosY = screenHeight * 0.75;

// create sprite
let appleSprite = new PIXI.Sprite(appleTexture);
appleSprite.label = "Apple";
// add sprite to container (scene aka stage)
app.stage.addChild(appleSprite);

// DRAW GRID
DrawGrid(4, 8);

// CREATE SHIELD CONTAINER
let shieldContainer = new PIXI.Container();
app.stage.addChild(shieldContainer);
shieldContainer.label = "Shield";
shieldContainer.x = shieldPosX;
shieldContainer.y = shieldPosY;

// CREATE SHIELD SPRITE
let shieldSprite = new PIXI.Sprite(shieldTexture);
shieldContainer.addChild(shieldSprite);
shieldSprite.label = "Shield";
shieldSprite.anchor.set(0.5, 0.5);
shieldSprite.width = shieldSprite.width * shieldSize;
shieldSprite.height = shieldSprite.height * shieldSize;

// REPOSE KNIFE
let knifeSprite = new PIXI.Sprite(knifeTexture);
knifeSprite.label = "Knife";
app.stage.addChild(knifeSprite);
knifeSprite.anchor.set(0.5, 0);
knifeSprite.x = knifePosX;
knifeSprite.y = knifePosY;
knifeSprite.width = knifeSprite.width * knifeSize;
knifeSprite.height = knifeSprite.height * knifeSize;

// ROTATE SHIELD
let shieldRotationSpeed = 4;
app.ticker.add((ticker) => {
    shieldContainer.rotation += shieldRotationSpeed * ticker.deltaTime / 100;
});

// FROM TUTOR, to delete later
// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
appleSprite.y = shieldSprite.x; // inline to sprites
app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    appleSprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
    //console.log(IsColliding(appleSprite, shieldSprite));
});

// SET TOUCH AREA
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', ThrowKnife);



// Draw grid
function DrawGrid(xSections, ySections) {
    let gridContainer = new PIXI.Container();
    gridContainer.label = "Grid";
    app.stage.addChild(gridContainer);
    for (let i = 1; i < ySections; i++) {
        let horizontalLine = new PIXI.Sprite(horizontalLineTexture);
        gridContainer.addChild(horizontalLine);
        horizontalLine.label = "Horizontal line #" + i.toString();
        horizontalLine.y = defaultWidth / ySections * i;
    }
    for (let i = 1; i < xSections; i++) {
        let verticalLine = new PIXI.Sprite(verticalLineTexture);
        gridContainer.addChild(verticalLine);
        verticalLine.label = "Vertical line #" + i.toString();
        verticalLine.x = defaultHeight / xSections * i;
    }
}

// Throw Knife
function ThrowKnife() {
    console.log("hi there");
    let newKnife = Createknife();
    let rot = true;
    app.ticker.add((ticker) => {
        console.log("ticky-ricky-tock");
        if (IsKnifeStuckIntoShield(newKnife)) {
            // add knife as child to the shield
            shieldContainer.addChild(newKnife);
            newKnife.x = 0;
            newKnife.y = 0;
            if (rot) {
                newKnife.rotation = -shieldContainer.rotation;
                rot = false;
            }
            console.log(shieldContainer.rotation);

            // destroy this ticker
        }
        else
            newKnife.y -= knifeSpeed * ticker.deltaTime;
    });
}

function Createknife() {
    let knife = new PIXI.Sprite(knifeTexture);
    app.stage.addChild(knife);

    knife.label = "New Knife";
    knife.anchor.set(0.5, 0);
    knife.width = knife.width * knifeSize;
    knife.height = knife.height * knifeSize;
    knife.x = knifePosX;
    knife.y = knifePosY;

    return knife;
}

function IsColliding(object1, object2) {

    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );
}

function IsKnifeStuckIntoShield(knife) {
    let radius = shieldSprite.width / 2;

    return (shieldContainer.y + radius > knife.y);
}