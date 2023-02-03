var keys = {};

var Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Graphics = PIXI.Graphics;
var app = new Application({ 
    width: 800,
    height: 800,              
    antialias: true,
    transparent: true,
    resolution: 1
    }
);
app.renderer.backgroundColor = 0x55DD55;
/// Fill the screen 
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
PIXI.loader.add(["sprites/birds/BirdSprite.png","sprites/squirrels/SquirrelSprite.png"]).load(startGame);
var loaded = 0;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var animations = [];
function startGame() {
    var birdTexture = TextureCache["sprites/birds/BirdSprite.png"];
    var birdRectangle = new Rectangle(0,0,16,16);
    birdTexture.frame = birdRectangle;
    // birdTexture.baseTexture.scaleMode = ;
    var bird = new Sprite(birdTexture);
    bird.anchor.set(0.5);
    app.stage.addChild(bird);
    bird.scale.set(8);
    var squirrelTexture = TextureCache["sprites/squirrels/SquirrelSprite.png"];
    var squirrelRectangle = new Rectangle(0,0,32,32);
    squirrelTexture.frame = squirrelRectangle;
    // squirrelTexture.baseTexture.scaleMode = ;
    var squirrel = new Sprite(squirrelTexture);
    squirrel.anchor.set(0.5);
    app.stage.addChild(squirrel);
    squirrel.x = innerWidth/2;
    squirrel.y = innerHeight/2 - 300;
    squirrel.scale.set(8);
    squirrel.animation = {y: 2, x: 0, length: 4, speed: 4, frameCount: 0, texture: squirrelTexture, rectangle: squirrelRectangle, size: 32};
    animations.push(squirrel.animation)
    /// Y is basically the index of the animation
    /// Length is how many steps to run
    /// Speed is how many frames to run on
    /// Frame count is for when we don't want to animate every turn
    /// Texture is the texture to update
    /// Rectangle is the rectangle to change
    /// Size is how much to change the X and Y by
    bird.animation = {y: 1, x: 0, length: 8, speed: 4, frameCount: 0, texture: birdTexture, rectangle: birdRectangle, size: 16};
    bird.colSize = 16 * 4;
    squirrel.colSize = 32 * 4;
    animations.push(bird.animation)
    bird.x = 500;
    bird.y = 500;
    bird.vx = 0;
    bird.vy = 0;
    squirrel.vx = 0;
    squirrel.vy = 0;
    bird.colWidth = 128;
    bird.colHeight = 128;
    squirrel
    var gravity = 0.1;
    var gameLoop = () => {
        /// Gravity and Decay
        bird.vy += gravity;
        if(bird.vx > 0.1) {
            bird.vx -= 0.1;
        } else if(bird.vx < -0.1) {
            bird.vx += 0.1;
        } else {
            bird.vx = 0;
        }

        /// Movement
        var moving = false;
        if(keys.ArrowUp) {
            bird.vy -= 0.4;
            moving = true;
        }
        if(keys.ArrowDown) {
            bird.vy += 0.2;
            moving = true;
        }
        if(keys.ArrowLeft) {
            bird.vx -= 0.5;
            moving = true;
            bird.scale.x = 8;
        }
        if(keys.ArrowRight) {
            bird.vx += 0.5;
            moving = true;
            bird.scale.x = -8;
        }
        if(moving) {
            if(bird.animation.y !== 1) {
                bird.animation.y = 1;
                bird.animation.x = 0;
                bird.animation.length = 8;
                bird.animation.speed = 4;
            }
        } else if(bird.vy < -2 || bird.vx > 3) {
            bird.animation.y = 4;
            bird.animation.x = 0;
            bird.animation.length = 2;
            bird.animation.speed = 1;
        } else {
            bird.animation.y = 0;
            bird.animation.x = 0;
            bird.animation.length = 2;
            bird.animation.speed = 50;
        }


        /* ********************* */


        /// Squirrel (I know, so inefficient)
        /// Gravity
        squirrel.vy += gravity;
        if(squirrel.vx > 0.3) {
            squirrel.vx -= 0.3;
        } else if(squirrel.vx < -0.3) {
            squirrel.vx += 0.3;
        } else {
            squirrel.vx = 0;
        }

        /// Movement
        var moving = false;
        if(keys.w && squirrel.canJump) {
            squirrel.vy -= 10;
            moving = true;
            squirrel.canJump = false;
        }
        if(keys.a) {
            if(squirrel.canJump) {
                squirrel.vx -= 3;
            } else {
                squirrel.vx -= 0.5;
            }
            moving = true;
            squirrel.scale.x = -8;
        }
        if(keys.d) {
            if(squirrel.canJump) {
                squirrel.vx += 3;
            } else {
                squirrel.vx += 0.5;
            }
            moving = true;
            squirrel.scale.x = 8;
        }
        if(moving) {
            if(squirrel.animation.y !== 2) {
                squirrel.animation.y = 2;
                squirrel.animation.x = 0;
                squirrel.animation.length = 4;
                squirrel.animation.speed = 8;
            }
        } else if(squirrel.animation.y !== 0) {
            squirrel.animation.y = 0;
            squirrel.animation.x = 0;
            squirrel.animation.length = 6;
            squirrel.animation.speed = 5;
        }

        animations.forEach(function(animation){
            if(animation.frameCount%animation.speed === 0) {
                if(animation.x >= animation.length) {
                    if(animation.destructive) {
                        animation.destructive();
                        return;
                    } else {
                        animation.x = 0;
                    }
                }
                animation.rectangle.x = animation.x * animation.size;
                animation.rectangle.y = animation.y * animation.size;
                animation.rectangle.width = animation.size;
                animation.rectangle.height = animation.size;
                animation.texture.frame = animation.rectangle;
                ++animation.x;
            }
            ++animation.frameCount;
        });
        setTimeout(gameLoop,16)
        bird.vy = Math.max(-8,bird.vy)
        bird.vx = minAbs(bird.vx,8);
        bird.x += bird.vx;
        bird.y += bird.vy;

        if(bird.y + bird.colSize > innerHeight || bird.y - bird.colSize < 0) {
            bird.y -= bird.vy;
            bird.vy = 0;
        }
        if(bird.x + bird.colSize > innerWidth || bird.x - bird.colSize < 0) {
            bird.x -= bird.vx;
            bird.vx = 0;
        }

        /// Squirrel (this code is so bad)
        

        // squirrel.vy = Math.max(-,squirrel.vy)
        squirrel.vx = minAbs(squirrel.vx,10);
        squirrel.x += squirrel.vx;
        squirrel.y += squirrel.vy;
        if(squirrel.y + squirrel.colSize > innerHeight || squirrel.y - squirrel.colSize < 0) {
            squirrel.y -= squirrel.vy;
            squirrel.vy = 0;
            squirrel.canJump = true;
        }
        if(squirrel.x + squirrel.colSize > innerWidth || squirrel.x - squirrel.colSize < 0) {
            squirrel.x -= squirrel.vx;
            squirrel.vx = 0;
        }

        if(hitTestRectangle(bird,squirrel)) {
            bird.y -= bird.vy*1.5;
            squirrel.y -= squirrel.vy*1.5;
            if(hitTestRectangle(bird,squirrel)) {
                bird.y += bird.vy*1.5;
                squirrel.y += squirrel.vy*1.5;    
                
                squirrel.x -= squirrel.vx;
                bird.x -= bird.vx;
                bird.vx *= -0.75;
                squirrel.vx *= -0.75;
            } else {
                bird.vy *= -0.75;
                squirrel.vy *= -0.75;
            }

            // bird.vx = 0;
            // bird.vy = 0;
            // squirrel.vx = 0;
            // squirrel.vy = 0;
        }
    };
    gameLoop();
}
addEventListener("keydown", function (e){
    keys[e.key] = true;
});
addEventListener("keyup", function (e){
    keys[e.key] = false;
});
function minAbs(num,abs) {
    if(Math.abs(num) < abs) {
        return num;
    } else if(num < 0) {
        return -abs;
    }
    return abs;
}
function getDistance(x1,y1,x2,y2) {
    /// Mine
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}
function hitTestRectangle(r1, r2, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x// + r1.width / 2;
    r1.centerY = r1.y //+ r1.height / 2;
    r2.centerX = r2.x //+ r2.width / 2;
    r2.centerY = r2.y //+ r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx + offsetX) < combinedHalfWidths) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy +offsetY) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
        } else {

        //There's no collision on the y axis
        hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};