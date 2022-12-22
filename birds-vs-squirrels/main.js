import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier2d-compat';
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
PIXI.loader.add(["sprites/birds/fly/x01.png","sprites/birds/BirdSprite.png","sprites/food/birdseed.png"]).load(setup);
var loaded = 0;
function setup() {
    if(++loaded === 2) {
        run_simulation();
    }
}
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var animations = [];
function run_simulation() {
    var birdTexture = TextureCache["sprites/birds/BirdSprite.png"];
    var birdRectangle = new Rectangle(0,0,16,16);
    birdTexture.frame = birdRectangle;
    // birdTexture.baseTexture.scaleMode = ;
    var bird = new Sprite(birdTexture);
    bird.anchor.set(0.5);
    app.stage.addChild(bird);
    bird.scale.set(8);
    /// Y is basically the index of the animation
    /// Length is how many steps to run
    /// Speed is how many frames to run on
    /// Frame count is for when we don't want to animate every turn
    /// Texture is the texture to update
    /// Rectangle is the rectangle to change
    /// Size is how much to change the X and Y by
    bird.animation = {y: 1, x: 0, length: 8, speed: 4, frameCount: 0, texture: birdTexture, rectangle: birdRectangle, size: 16};
    animations.push(bird.animation)
    
    var gravity = { x: 0.0, y: 98.1*5 };
    var world = new RAPIER.World(gravity);

    var birdSeed = new PIXI.ParticleContainer(4000);
    app.stage.addChild(birdSeed);
    birdSeed.maxSize = 4000;
    for(var i = 0; i < 40; i++) {
        var birdSeedParticle = new Sprite(resources["sprites/food/birdseed.png"].texture);
        var newRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0 + Math.random() * innerWidth, 200+Math.random() * 200);
        newRigidBodyDesc.setAdditionalMass(0.001);
        var newRigidBody = world.createRigidBody(newRigidBodyDesc);
        // console.log(newRigidBody);
        // Create a cuboid collider attached to the dynamic newRigidBody.
        var colliderDesc = RAPIER.ColliderDesc.cuboid(8, 8).setDensity(0);
        var collider = world.createCollider(colliderDesc, newRigidBody);
        birdSeedParticle.collider = collider;
        // Game loop. Replace by your own game loop system.
        birdSeed.addChild(birdSeedParticle);
    }
    // Create the ground
    var groundColliderDesc = RAPIER.ColliderDesc.cuboid(1800.0, 200).setTranslation(0,innerHeight-20);
    world.createCollider(groundColliderDesc);

    // Create a dynamic rigid-body.
    var rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(500.0, 0);
    rigidBodyDesc.setAdditionalMass(1);
    var rigidBody = world.createRigidBody(rigidBodyDesc);
    // console.log(rigidBody);
    // Create a cuboid collider attached to the dynamic rigidBody.
    var colliderDesc = RAPIER.ColliderDesc.cuboid(50, 50).setDensity(0);
    var collider = world.createCollider(colliderDesc, rigidBody);
    // Game loop. Replace by your own game loop system.
    rigidBody.setLinearDamping(1);
    collider.setFriction(0.1);
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    var eventQueue = new RAPIER.EventQueue(true);
    console.log(collider)
    eventQueue.drainCollisionEvents(function(event) {
        console.log(event);
    });
    var gameLoop = () => {
        // Ste the simulation forward.  
        world.step(eventQueue);
        rigidBody.resetForces();
        var moving;
        birdSeed.children.forEach(function(seed){
            var translation = seed.collider.translation();
            seed.x = translation.x;
            seed.y = translation.y;
            
        });
        if(keys[" "] && (bird.animation.x === 0 || bird.animation.y !== 2)) {
            bird.animation.y = 2;
            bird.animation.x = 0;
            bird.animation.length = 3;
            bird.animation.speed = 2;
            bird.animation.destructive = function() {
                console.log("Destruct")
                bird.animation.y = 0;
                bird.animation.x = 0;
                bird.animation.length = 2;
                bird.animation.speed = 50;
                bird.animation.frameCount = 45;

                if(bird.scale.x < 1) {
                    var birdX = bird.x + bird.width/2;
                } else {
                    var birdX = bird.x - bird.width/2;
                }
                var birdY = bird.y + bird.height/2;
                var terminate = false;
                birdSeed.children.forEach(function(seed){
                    if(terminate) {
                        return;
                    }
                    if(getDistance(seed.x,seed.y,birdX,birdY)<30) {
                        birdSeed.removeChild(seed);
                        console.log("Birdseed eaten");
                        world.removeCollider(seed.collider);
                        // terminate = true;
                    }
                });
                bird.animation.destructive = false;
            };
            bird.animation.frameCount = 0;
            keys[" "] = false;
        } else {
            if(keys.ArrowUp) {
                rigidBody.addForce({x: 0, y: -1000},true);
                moving = true;
            }
            if(keys.ArrowDown) {
                rigidBody.addForce({x: 0, y: 1000},true);
                moving = true;
            }
            if(keys.ArrowRight) {
                rigidBody.addForce({x: 500, y: 0},true);
                bird.scale.x = -8;
                moving = true;
            }
            if(keys.ArrowLeft) {
                rigidBody.addForce({x: -500, y: 0},true);
                bird.scale.x = 8;
                moving = true;
            }
            if(moving && bird.animation.y === 0) {
                bird.animation.y = 1;
                bird.animation.x = 0;
                bird.animation.length = 8;
                bird.animation.speed = 4;
            } else if(bird.animation.y === 1 && !moving){
                bird.animation.y = 0;
                bird.animation.x = 0;
                bird.animation.length = 2;
                bird.animation.speed = 50;
            }
        }
        var position = rigidBody.translation();
        setTimeout(gameLoop, 16);
        bird.x = position.x;
        bird.y = position.y;
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
    };
    gameLoop();
}
addEventListener("keydown", function (e){
    keys[e.key] = true;
});
addEventListener("keyup", function (e){
    keys[e.key] = false;
});
RAPIER.init().then(function () {
    if(++loaded === 2) {
        run_simulation();
    }
});
function getDistance(x1,y1,x2,y2) {
    /// Mine
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}