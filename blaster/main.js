"use strict";
    
var params = getParams();
function getParams() {
  var params = {};
  location.search.substr(1).split("&").forEach(function(el) {
    var data = el.replace(/\+/g, " ").split("=");
    params[decodeURIComponent(data[0])] = data[1] ? decodeURIComponent(data[1]) : true;
  });
  return params;
}
PIXI.utils.skipHello();
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Graphics = PIXI.Graphics;
let app = new Application({ 
    width: innerHeight,
    height: innerHeight,              
    antialias: true,
    transparent: false,
    resolution: 1
  }
);
/// Put the canvas in the middle of the screen and make it borderless
app.renderer.view.style.left = (innerWidth - innerHeight)/2 + "px";
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.backgroundColor = 0;
document.body.appendChild(app.view);

/// Defining variables
var spritesToLoad = ["sprites/rocket.png", "sprites/laser.png", "sprites/enemy-laser.png", "sprites/lvl1/enemy1.png", "sprites/exp1.png", "sprites/exp2.png", "sprites/exp3.png"];
var spriteNames = ["player", "blue_plasma", "red_plasma", "enemy-1-1", "exp_1", "exp_2", "exp_3"];
var keysOfSprites;
var state;
var keys = {};
var mouseX
var mouseY;
var player;
var enemies = [];
var explosions = [];
var globalFrameCount = 0;

/// Scale the sprites for different screens
var scalar = innerHeight/800;

/// Length of canvas
var canvasLength = app.renderer.view.width

/// Store custom key-mappings
var keyMappings = {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", fire: " ", switch: "z", special: "x"}

/// Define globalY
var globalY = 0;

/// Load sprites and setup stage
loader.add(spritesToLoad).load(setup);
function setup() {

    keysOfSprites = keySpritesTo(spriteNames, spritesToLoad);
    player = new Sprite(keysOfSprites.player);
    app.stage.addChild(player);
    player.scale.set(1.75 * scalar);
    player.anchor.set(0.5,0.5);
    player.x = canvasLength/2;
    player.y = innerHeight - player.height/2 - 30;
    player.vx = 0;
    player.vy = 0;
    player.speed = 5 * scalar;
    player.plasma = {
        cooldown: 30,
        lastTime: -1000,
        damage: 1,
    }

    prepareLevel(level1);
    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

function prepareLevel(level) {
    var i;
    var len = level.enemies.length;
    for(i = 0; i < len; i++) {
        var curEnemies = level.enemies[i];
        spawnNewEnemy(curEnemies.type, curEnemies.level, curEnemies.positions);
    }
}
function spawnNewEnemy(type, level, positions) {
    for(var i = 0; i < positions.length; i++) {
        var enemy = new Sprite(keysOfSprites[type]);
        var curPos = positions[i];
        var properties = enemyProperties[type];

        enemy.scale.set(scalar * properties.scale)
        enemy.anchor.set(0.5,0.5);
        enemy.type = type;
        enemy.level = level;
        if(curPos.x === "random") {
            curPos.x = randInt(0,canvasLength);
        }
        enemy.x = curPos.x * scalar;
        enemy.x = constrain(enemy.width/2,enemy.x, canvasLength - enemy.width/2);
        enemy.myY = curPos.y * scalar;
        enemy.y = enemy.myY;
        enemy.rotation = pointInDirection(properties.direction)
        
        enemy.health = randInt(properties.healthRange.min, properties.healthRange.max);
        enemy.combo = {
            active: properties.combo.active,
            curTicks: properties.combo.curTicks,
            maxTicks: properties.combo.maxTicks,
            fireCooldown: properties.combo.fireCooldown,
            lastFire: properties.combo.lastFire,
            comboCooldown: properties.combo.comboCooldown,
            lastCombo: properties.combo.lastCombo
        };

        enemy.colRect = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width * properties.colXPercent,
            height: enemy.height * properties.colYPercent,

        }
        app.stage.addChild(enemy);
        enemies.push(enemy);
    }
}
var lasers = [];
function gameLoop(delta) {
  state(delta)
}
function play(){
    ++globalFrameCount;
    var userInput = readKeyMappings(keyMappings, keys);
    player.vx = 0;
    player.vy = 0;
    if(userInput.up && player.y > player.height/2) {
        player.vy--;
    }
    if(userInput.down && player.y < canvasLength - player.height/2) {
        player.vy++;
    }
    if(userInput.left && player.x > player.width/2) {
        player.vx--;
    }
    if(userInput.right && player.x < canvasLength - player.width/2) {
        player.vx++;
    }

    if(userInput.fire) {
        if(player.plasma.lastTime + player.plasma.cooldown < globalFrameCount) {
            fireLaser(player.x, player.y - player.height/2, 0, 10, "blue", player.plasma.damage);
            player.plasma.lastTime = globalFrameCount;
        }
    }

    var vector = normalize(player.vx, player.vy, player.speed)
    player.x += vector.x;
    player.y += vector.y;
    player.x = constrain(player.width/2, player.x, canvasLength - player.width/2);
    player.y = constrain(player.height/2, player.y, canvasLength - player.height/2);
    --globalY;
    handleLasers();
    handleEnemies();
    handleExplosions();
}
function handleExplosions() {
    var len = explosions.length;
    for(var i = 0; i < len; i++) {
        explosions[i].alpha -= 0.05;
        if(explosions[i].alpha <= 0) {
            app.stage.removeChild(explosions[i]);
            explosions.splice(i,1);
            --i;
            --len;
        }
    }
}
function handleLasers() {
    var i = 0;
    var len = lasers.length;
    for(i = 0; i < len; i++) {
        var laser = lasers[i];
        var vector = direction(laser.speed, laser.direction);
        laser.x += vector.x;
        laser.y += vector.y;
        if(laser.y < -100 * scalar || laser.y > canvasLength + 100 * scalar || laser.x < -100 * scalar || laser.x > canvasLength + 100 * scalar) {
            app.stage.removeChild(laser);
            lasers.splice(i,1);
            --i;
            --len;
        }
        if(laser.good) {
            enemies.forEach(function(enemy){
                var enemyRect = {
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.colRect.width,
                    height: enemy.colRect.height
                }
                if(hitTestRectangle(laser,enemyRect)) {
                    app.stage.removeChild(laser);
                    lasers.splice(i,1);
                    --i;
                    --len;
                    explode(1,{x: laser.x, y: laser.y-10},20);
                    console.log(laser.damage);
                    enemy.health -= laser.damage;
                }
            });
        }
    }
}
function handleEnemies() {
    var i;
    var len = enemies.length;
    for(i = 0; i < len; i++) {
        var curEnemy = enemies[i];
        var cut = handleEnemyBehaviors[curEnemy.type](curEnemy);
        if(cut) {
            enemies.splice(i,1);
            --i;
            --len;
        }
    }
}
function fireLaser(x, y, direction, speed, type, damage) {
    var laser = new Sprite(keysOfSprites[type + "_plasma"]);
    laser.scale.set(2 * scalar);
    laser.good = type === "blue";
    laser.x = x;
    laser.y = y;
    laser.anchor.set(0.5,0.5);
    laser.rotation = pointInDirection(direction);
    laser.speed = speed * scalar;
    laser.direction = direction;
    laser.damage = damage;
    app.stage.addChild(laser);
    lasers.push(laser);
    return laser;
}
function constrain(min, x, max) {
    x = Math.max(min, x);
    x = Math.min(max, x);
    return x;
}
function normalize(x,y,speed) {
    var len = Math.sqrt(x**2 + y**2)
    if(len === 0) {
        return {x:0, y:0};
    }
    return {x: x/len*speed, y: y/len*speed}
}
function readKeyMappings(mappings, keys) {
    var mappingsActive = {}
    var mapKeys = Object.keys(mappings);
    var i;
    var len = mapKeys.length;
    for(i = 0; i < len; i++) {
        var curKey = mapKeys[i];
        mappingsActive[curKey] = keys[mappings[curKey]];
    }
    return mappingsActive
}
function press(key){
    if(keys[key]){
        keys[key] = false;
        return true;
    }
    return false;
}
function explode(amount, position, distance) {
    distance = distance || 0;
    debugger;
    for(var i = 0; i < amount; i++) {
        var rand = Math.random();
        if(rand < 0.33) {
            var explosion = new Sprite(resources["sprites/exp1.png"].texture);
        } else if(rand < 0.66) {
            var explosion = new Sprite(resources["sprites/exp2.png"].texture);
        } else {
            var explosion = new Sprite(resources["sprites/exp3.png"].texture);
        }
        app.stage.addChild(explosion);
        explosion.x = position.x + randInt(-distance, distance);
        explosion.y = position.y + randInt(-distance, distance);
        explosions.push(explosion);
        explosion.scale.set(3*scalar);
    }
}
function keySpritesTo(arr1, arr2) {
    var obj = {};
    var i;
    var len = arr1.length;
    for(i = 0; i < len; i++) {
        obj[arr1[i]] = resources[arr2[i]].texture;
    }
    return obj;
}
addEventListener("mousedown",function(e){
    if(e.button == 0) {
        keys.mouse = true;
    } else if(e.button == 2) {
        keys.rightMouse = true;
    }
    mouseX = e.pageX;
    mouseY = e.pageY;
});
addEventListener("mouseup",function(e){
    if(e.button == 0) { 
        keys.mouse = false;
    } else if(e.button == 2) {
        keys.rightMouse = true;
    }
});
addEventListener("blur", function (){
    keys = {};
});
addEventListener("mousemove",function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
});
addEventListener("keydown", function (e){
    keys[e.key] = true;
});
addEventListener("keyup", function (e){
    keys[e.key] = false;
});