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
    transparent: false,
    resolution: 1
    }
);
app.renderer.backgroundColor = 0x7777EE;
/// Fill the screen 
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
PIXI.loader.add(["sprites/squirrels/SquirrelSprite.png","sprites/birds/BirdSprite.png","sprites/food/birdseed.png","sprites/food/bird-feeder.png"]).load(setup);
var loaded = 0;
function setup() {
    if(++loaded === 2) {
        run_simulation();
    }
}
var player1 = {birdseed:0};
var player2 = {birdseed:0};
window.player1 = player1;
window.player2 = player2;
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
    var groundColliderDesc = RAPIER.ColliderDesc.cuboid(50, 150).setTranslation(innerWidth/2,innerHeight - 650);

    var feedPoint1 = {x: innerWidth/2 - 100, y: innerHeight - 550};
    var feedPoint2 = {x: innerWidth/2 + 100, y: innerHeight - 550};

    world.createCollider(groundColliderDesc);
    var birdFeeder = new Sprite(resources["sprites/food/bird-feeder.png"].texture);
    app.stage.addChild(birdFeeder);
    birdFeeder.x = innerWidth/2;
    birdFeeder.y = innerHeight;
    birdFeeder.anchor.set(0.5,1);
    birdFeeder.scale.set(6)
    
    var groundColliderDesc = RAPIER.ColliderDesc.cuboid(innerWidth * 2, 2).setTranslation(0,innerHeight-20);
    world.createCollider(groundColliderDesc);

    var groundColliderDesc1 = RAPIER.ColliderDesc.cuboid(2, innerHeight * 2).setTranslation(20,0);
    world.createCollider(groundColliderDesc1);

    var groundColliderDesc2 = RAPIER.ColliderDesc.cuboid(2, innerHeight * 2).setTranslation(innerWidth - 20,0);
    world.createCollider(groundColliderDesc2);

    // Create a dynamic rigid-body.
    var rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(300.0, 0);
    rigidBodyDesc.setAdditionalMass(1);
    var rigidBody = world.createRigidBody(rigidBodyDesc);
    var colliderDesc = RAPIER.ColliderDesc.cuboid(50, 50).setDensity(0);
    var collider = world.createCollider(colliderDesc, rigidBody);
    rigidBody.setLinearDamping(1);
    bird.form = rigidBody;
    bird.form.desc = rigidBodyDesc;


    
    var rigidBodyDesc2 = RAPIER.RigidBodyDesc.dynamic().setTranslation(700.0, 0);
    rigidBodyDesc2.setAdditionalMass(1);
    var rigidBody2 = world.createRigidBody(rigidBodyDesc2);
    var colliderDesc = RAPIER.ColliderDesc.cuboid(64, 48).setDensity(0);
    var collider = world.createCollider(colliderDesc, rigidBody2);
    rigidBody2.setLinearDamping(1);
    squirrel.form = rigidBody2;
    squirrel.form.desc = rigidBodyDesc2;
    squirrel.anchor.set(0.5,0.75)
    squirrel.canJump = true;
    squirrel.lastY = squirrel.Y;
    squirrel.continuance = 0;
    window.squirrel = squirrel;
    window.bird = bird;

    // console.log(rigidBody);
    // Create a cuboid collider attached to the dynamic rigidBody.
    // Game loop. Replace by your own game loop system.
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
        bird.form.resetForces();
        squirrel.form.resetForces();
        var moving;
        birdSeed.children.forEach(function(seed){
            var translation = seed.collider.translation();
            seed.x = translation.x;
            seed.y = translation.y;
            
        });
        squirrel.x = squirrel.form.translation().x
        squirrel.y = squirrel.form.translation().y
        if(Math.abs(squirrel.y - squirrel.lastY) < 1) {
            ++squirrel.continuance;
            if(squirrel.continuance >= 10) {
                squirrel.canJump = 2;
            }
        } else {
            squirrel.continuance = 0;
            squirrel.lastY = squirrel.y;
        }
        if(bird.locked) {
            if(keys["Enter"] && (bird.animation.x === 0 || bird.animation.y !== 2)) {
                bird.animation.y = 2;
                bird.animation.x = 0;
                bird.animation.length = 3;
                bird.animation.speed = 2;
                bird.animation.destructive = function() {
                    console.log("Destruct")
                    ++player1.birdseed;
                    bird.animation.y = 0;
                    bird.animation.x = 0;
                    bird.animation.length = 2;
                    bird.animation.speed = 50;
                    bird.animation.frameCount = 0;
                    bird.animation.destructive = false;
                };
                keys["Enter"] = false;
            }
            if(keys.ArrowUp) {
                if(bird.doubleJump) {
                    bird.locked = false;
                    bird.impulse = true;
                    setTimeout(function () {
                        bird.impulse = false;
                    }, 200)
                    bird.form.setLinearDamping(1)
                    bird.form.applyImpulse({x:0,y:-500});
                    bird.doubleJump = false;
                } else {
                    bird.doubleJump = true;
                    setTimeout(function () {
                        bird.doubleJump = false;
                    }, 200)
                    keys.ArrowUp = false;
                }
            }
        } else if(keys["Enter"] && (bird.animation.x === 0 || bird.animation.y !== 2) && !bird.impulse) {
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
                if(getDistance(birdX,bird.y,squirrel.x,squirrel.y) < 150) {
                    var impulse = {x:squirrel.x - birdX,y:squirrel.y - (bird.y + 20)};
                    impulse.x /= Math.sqrt(impulse.x**2 + impulse.y **2);
                    impulse.y /= Math.sqrt(impulse.x**2 + impulse.y **2);
                    impulse.x *= 1000;
                    impulse.y *= 1000;
                    squirrel.form.applyImpulse(impulse);
                    if(!squirrel.impulse) {
                        squirrel.impulse = true;
                    }
                    squirrel.locked = false;
                    squirrel.form.setLinearDamping(1)
                    setTimeout(function() {
                        squirrel.impulse = false;
                    }, 500)
                    
                }
                bird.animation.destructive = false;
            };
            bird.animation.frameCount = 0;
            keys["Enter"] = false;
        } else if(!bird.impulse) {
            if(keys.ArrowUp) {
                bird.form.addForce({x: 0, y: -1000},true);
                moving = true;
            }
            if(keys.ArrowDown) {
                bird.form.addForce({x: 0, y: 1000},true);
                moving = true;
            }
            if(keys.ArrowRight) {
                bird.form.addForce({x: 500, y: 0},true);
                bird.scale.x = -8;
                moving = true;
            }
            if(keys.ArrowLeft) {
                bird.form.addForce({x: -500, y: 0},true);
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
            // console.log(getDistance(bird.x,bird.y,feedPoint1.x,feedPoint1.y));
            if(getDistance(bird.x,bird.y,feedPoint1.x,feedPoint1.y) < 25 && !bird.impulse) {
                bird.locked = true;
                console.log("Lock in place")
                // bird.form.lockTranslations(true,true);
                bird.form.resetForces();
                bird.form.setLinearDamping(Infinity)
                bird.animation.y = 0;
                bird.animation.x = 0;
                bird.animation.length = 2;
                bird.animation.speed = 50;
                bird.animation.frameCount = 0;
                console.log(bird.form.setTranslation(feedPoint1,true));
                bird.scale.x = -8;
            } else if(getDistance(bird.x,bird.y,feedPoint2.x,feedPoint2.y) < 25 && !bird.impulse) {
                bird.locked = true;
                console.log("Lock in place")
                // bird.form.lockTranslations(true,true);
                bird.form.resetForces();
                bird.form.setLinearDamping(Infinity)
                console.log(bird.form.setTranslation(feedPoint2,true));
                bird.animation.y = 0;
                bird.animation.x = 0;
                bird.animation.length = 2;
                bird.animation.speed = 50;
                bird.scale.x = 8;
                bird.animation.frameCount = 0;
            }
        }
        var position = bird.form.translation();
        bird.x = position.x;
        bird.y = position.y;
        // console.log(getDistance(bird.x,bird.y,feedPoint1.x,feedPoint1.y))






        ///// Squirrel Code
        moving = false;
        if(squirrel.locked) {
            if(keys[" "] && (squirrel.animation.x === 0 || squirrel.animation.y !== 4)) {
                squirrel.animation.y = 4;
                squirrel.animation.x = 0;
                squirrel.animation.length = 2;
                squirrel.animation.speed = 4;
                squirrel.animation.destructive = function() {
                    console.log("Destruct")
                    ++player2.birdseed;
                    squirrel.animation.y = 0;
                    squirrel.animation.x = 0;
                    squirrel.animation.length = 2;
                    squirrel.animation.speed = 50;
                    squirrel.animation.frameCount = 45;
                    squirrel.animation.destructive = false;
                };
                squirrel.animation.frameCount = 0;
                keys[" "] = false;
            } 
            if(keys.w) {
                if(squirrel.doubleJump) {
                    squirrel.locked = false;
                    squirrel.impulse = true;
                    setTimeout(function () {
                        squirrel.impulse = false;
                    }, 500)
                    squirrel.form.setLinearDamping(1)
                    squirrel.form.applyImpulse({x:0,y:-1000});
                    squirrel.doubleJump = false;
                    // squirrel.canJump = 2;
                    // setTimeout(function() {
                    //     squirrel.canJump = false;
                    // }, 300);
                } else {
                    squirrel.doubleJump = true;
                    setTimeout(function () {
                        squirrel.doubleJump = false;
                    }, 200)
                    keys.w = false;
                }
            }
        } else if(keys[" "] && (squirrel.animation.x === 0 || squirrel.animation.y !== 4) && !squirrel.impulse) {
            squirrel.animation.y = 4;
            squirrel.animation.x = 0;
            squirrel.animation.length = 2;
            squirrel.animation.speed = 4;
            squirrel.animation.destructive = function() {
                console.log("Destruct")
                squirrel.animation.y = 0;
                squirrel.animation.x = 0;
                squirrel.animation.length = 2;
                squirrel.animation.speed = 50;
                squirrel.animation.frameCount = 45;

                if(squirrel.scale.x > 1) {
                    var squirrelX = squirrel.x + squirrel.width/4;
                } else {
                    var squirrelX = squirrel.x - squirrel.width/4;
                }
                var squirrelY = squirrel.y + squirrel.height/4;
                var terminate = false;
                console.log(squirrelX,squirrelY);
                birdSeed.children.forEach(function(seed){
                    if(terminate) {
                        return;
                    }
                    if(getDistance(seed.x,seed.y,squirrelX,squirrelY)<30) {
                        birdSeed.removeChild(seed);
                        console.log("Birdseed eaten");
                        world.removeCollider(seed.collider);
                        // terminate = true;
                    }
                });
                if(getDistance(squirrelX,squirrel.y,bird.x,bird.y) < 150) {
                    var impulse = {x:bird.x - squirrelX,y:bird.y - squirrel.y};
                    impulse.x /= Math.sqrt(impulse.x**2 + impulse.y **2);
                    impulse.y /= Math.sqrt(impulse.x**2 + impulse.y **2);
                    impulse.x *= 1000;
                    impulse.y *= 1000;
                    bird.form.applyImpulse(impulse);
                    if(!bird.impulse) {
                        bird.impulse = true;
                    }
                    bird.locked = false;
                    bird.form.setLinearDamping(1)
                    setTimeout(function() {
                        bird.impulse = false;
                    }, 500)
                    
                }
                squirrel.animation.destructive = false;
            };
            squirrel.animation.frameCount = 0;
            keys[" "] = false;
        } else if (!squirrel.impulse) {

            if(keys.w && squirrel.canJump && (squirrel.y > innerHeight - 80 || squirrel.canJump === 2)) {
                squirrel.form.applyImpulse({x: 0, y: -1200},true);
                moving = true;
                keys.w = false;
                squirrel.canJump = false;
                setTimeout(function(){
                    squirrel.canJump = true;
                }, 300);
            }
            if(keys.s) {
                squirrel.form.addForce({x: 0, y: 1000},true);
                moving = true;
            }
            if(keys.d) {
                squirrel.form.addForce({x: 500, y: 0},true);
                squirrel.scale.x = 8;
                moving = true;
            }
            if(keys.a) {
                squirrel.form.addForce({x: -500, y: 0},true);
                squirrel.scale.x = -8;
                moving = true;
            }
            if(moving && squirrel.animation.y === 0) {
                squirrel.animation.y = 2;
                squirrel.animation.x = 0;
                squirrel.animation.length = 4;
                squirrel.animation.speed = 4;
            } else if(squirrel.animation.y === 2 && !moving){
                squirrel.animation.y = 0;
                squirrel.animation.x = 0;
                squirrel.animation.length = 6;
                squirrel.animation.speed = 6;
            }
            if(getDistance(squirrel.x,squirrel.y,feedPoint1.x,feedPoint1.y) < 25 && !squirrel.impulse) {
                squirrel.locked = true;
                console.log("Lock in place")
                // squirrel.form.lockTranslations(true,true);
                squirrel.form.resetForces();
                squirrel.form.setLinearDamping(Infinity)
                console.log(squirrel.form.setTranslation(feedPoint1,true));
            } else if(getDistance(squirrel.x,squirrel.y,feedPoint2.x,feedPoint2.y) < 25 && !squirrel.impulse) {
                squirrel.locked = true;
                console.log("Lock in place")
                // squirrel.form.lockTranslations(true,true);
                squirrel.form.resetForces();
                squirrel.form.setLinearDamping(Infinity)
                console.log(squirrel.form.setTranslation(feedPoint2,true));
            }
        }











        setTimeout(gameLoop, 16);
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