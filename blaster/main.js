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
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
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
app.renderer.backgroundColor = 0x050520;
document.body.appendChild(app.view);

/// Defining variables
var spritesToLoad = ["sprites/rocket.png", "sprites/laser.png", "sprites/enemy-laser.png", "sprites/lvl1/enemy1.png", "sprites/lvl1/enemy2.png", "sprites/lvl1/enemy3.png", "sprites/lvl1/asteroid-1.png","sprites/exp1.png", "sprites/exp2.png", "sprites/exp3.png",
"sprites/ball.png", "sprites/lvl1/plasma-top.png", "sprites/lvl1/plasma-base.png", "sprites/grey-laser.png", "sprites/coin.png","sprites/5coin.png","sprites/10coin.png",];
var spriteNames = ["player", "blue-plasma", "red-plasma", "enemy-1-1", "enemy-1-2", "enemy-1-3", "asteroid-1", "exp-1", "exp-2", "exp-3",
"upgrade-ball", "plasma-top", "plasma-base", "grey-plasma", "coin", "5coin", "10coin"];

var keysOfSprites;
var state;
var dependencies = [];
var keys = {};
var mouseX
var mouseY;
var player;
var enemies = [];
var explosions = [];
var lasers = [];
var powerups = [];
var globalFrameCount = 0;
var healthBar;
var healthHolder;
var powerupBar;
var powerupHolder;
var energyBar;
var energyHolder;
var starfield;
var curLevel;
var coins = 0;

/// Scale the sprites for different screens
var scalar = innerHeight/800;

/// Length of canvas
var canvasLength = app.renderer.view.width

/// Store custom key-mappings
var keyMappings = {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", fire: " ", switch: "z", special: "x"}

/// Define globalY
var globalY = 0;

/// Access the sidebar section for the verses
var sidebar = document.getElementById("sidebar");
sidebar.style.position = "absolute";
sidebar.style.zIndex = "100";
sidebar.style.width = ((innerWidth - canvasLength)/2 - 5*scalar) + "px";
sidebar.style.height = innerHeight + "px";
sidebar.style.left = ((innerWidth - canvasLength)/2 + canvasLength + 2.5*scalar) + "px";

/// Make the verse text
var textDiv = document.createElement("div");
textDiv.style.position = "relative";
textDiv.style.fontSize = "30px";
textDiv.style.color = "white";
textDiv.innerHTML = questionSet.chooseNewVerse();
sidebar.appendChild(textDiv);

/// Make a range div
var rangeDiv = document.createElement("div");
rangeDiv.style.position = "absolute";
rangeDiv.style.top = (innerHeight - 50) + "px";
rangeDiv.style.right = "1px";
rangeDiv.style.fontSize = "30px";
rangeDiv.style.color = "white";
rangeDiv.innerHTML = "1-4"
sidebar.appendChild(rangeDiv);

/// Make the input number text
var numDiv = document.createElement("div");
numDiv.style.position = "absolute";
numDiv.style.top = (innerHeight - 50) + "px";
numDiv.style.fontSize = "30px";
numDiv.style.color = "white";
sidebar.appendChild(numDiv);

/// Load sprites and setup stage
loader.add(spritesToLoad).load(setup);
function setup() {
    starfield = new PIXI.Graphics();
    app.stage.addChild(starfield);
    keysOfSprites = keySpritesTo(spriteNames, spritesToLoad);
    player = new Sprite(keysOfSprites.player);
    player.visible = false;
    app.stage.addChild(player);
    player.scale.set(1.75 * scalar);
    player.anchor.set(0.5,0.5);
    player.x = canvasLength/2;
    player.y = innerHeight - player.height/2 - 30;
    player.vx = 0;
    player.vy = 0;
    player.speed = 5 * scalar;
    player.health = 10;
    player.maxHealth = 10;

    player.energy = 100;
    player.maxEnergy = 100;
    player.efficiencyScore = 90;
    player.colRect = {
        x: player.x,
        y: player.y,
        width: player.width * 0.9,
        height: player.height * 0.9,
    }
    player.plasma = {
        cooldown: 30,
        lastTime: -1000,
        damage: 1,
        efficiencyScore: 1
    }
    player.activePowerup = {};
    player.generator = {
        energyPerQuestion: 25
    }

    /// Initialize starfield

    /// Build health bar
    healthHolder = new PIXI.Graphics();
    healthHolder.lineStyle(5, 0xFF0000,10);
    healthHolder.beginFill(0x000015);
    healthHolder.drawRect(0,0,150*scalar,15*scalar)
    app.stage.addChild(healthHolder);
    healthHolder.x = canvasLength - 175*scalar;
    healthHolder.y = canvasLength - 50*scalar;
    healthBar = new PIXI.Graphics();
    healthBar.lineStyle(5, 0xFF33333,10);
    healthBar.beginFill(0xFF3333, 10);
    healthBar.drawRect(0,0,150*scalar,15*scalar);
    healthBar.x = canvasLength - 175*scalar;
    healthBar.y = canvasLength - 50*scalar;
    healthBar.maxWidth = 150*scalar;
    app.stage.addChild(healthBar);

    /// Build energy bar
    energyHolder = new PIXI.Graphics();
    energyHolder.lineStyle(5, 0x00FFFF,10);
    energyHolder.beginFill(0x000015);
    energyHolder.drawRect(0,0,150*scalar,15*scalar)
    app.stage.addChild(energyHolder);
    energyHolder.x = canvasLength - 175*scalar;
    energyHolder.y = canvasLength - 25*scalar;
    energyBar = new PIXI.Graphics();
    energyBar.lineStyle(5, 0x00FFFF,10);
    energyBar.beginFill(0x00FFFF, 10);
    energyBar.drawRect(0,0,150*scalar,15*scalar);
    energyBar.x = canvasLength - 175*scalar;
    energyBar.y = canvasLength - 25*scalar;
    energyBar.maxWidth = 150*scalar;
    app.stage.addChild(energyBar);


    /// Prepare powerup bar
    powerupHolder = new PIXI.Graphics();
    app.stage.addChild(powerupHolder);
    powerupBar = new PIXI.Graphics();
    app.stage.addChild(powerupBar);
    powerupHolder.visible = false;
    powerupBar.visible = false;
    energyBar.visible = false;
    energyHolder.visible = false;
    healthBar.visible = false;
    healthHolder.visible = false;
    state = overworld;
    app.ticker.add(delta => gameLoop(delta));
}


/// Overly simplified
function overworld() {
    if(keys[" "]) {
        prepareLevel(levels[++levelOn]);
        state = play;
    }
}
/// Testing only
function TEST() {

}
function prepareLevel(level) {
    /// Define global level
    curLevel = level;

    /// Reset player and progress
    player.x = canvasLength/2;
    player.y = innerHeight - player.height/2 - 30;
    globalY = 0;
    healthBar.visible = true;
    healthHolder.visible = true;
    energyBar.visible = true;
    energyHolder.visible = true;

    level.seed = level.startingSeed;
    var i;
    var len = level.enemies.length;
    for(i = 0; i < len; i++) {
        var curEnemies = level.enemies[i];
        console.log(curEnemies)
        spawnNewEnemy(curEnemies.type, curEnemies.level, curEnemies.positions, level.randInt, curEnemies.link);
    }
    starfield.y = 0;
    starfield.clear();
    for(i = 0; i < 100; i++) {
        starfield.beginFill(0xFFFFFF);
        starfield.drawRect(level.randInt(0, canvasLength), level.randInt(level.endY/2, canvasLength), 3*scalar, 3*scalar);
    }
    player.visible = true;
}
function spawnNewEnemy(type, level, positions, seededRandInt,link) {
    for(var i = 0; i < positions.length; i++) {
        var enemy = new Sprite(keysOfSprites[type]);
        var curPos = positions[i];
        var properties = enemyProperties[type];

        enemy.scale.set(scalar * properties.scale)
        enemy.anchor.set(0.5,0.5);
        enemy.type = type;
        enemy.level = level;
        if(curPos.x === "random") {
            curPos.x = seededRandInt(0,canvasLength);
        }
        enemy.x = curPos.x * scalar;
        enemy.x = constrain(enemy.width/2,enemy.x, canvasLength - enemy.width/2);
        enemy.myY = curPos.y * scalar;
        enemy.y = enemy.myY;
        enemy.rotation = pointInDirection(properties.direction)
        
        enemy.health = seededRandInt(properties.healthRange.min, properties.healthRange.max);
        enemy.damage = properties.damage;
        if(properties.combo) {
            enemy.combo = {
                active: properties.combo.active,
                curTicks: properties.combo.curTicks,
                maxTicks: properties.combo.maxTicks,
                fireCooldown: properties.combo.fireCooldown,
                lastFire: properties.combo.lastFire,
                comboCooldown: properties.combo.comboCooldown,
                lastCombo: properties.combo.lastCombo
            };
        } else {
            enemy.cooldown = properties.cooldown;
            enemy.lastFire = properties.lastFire;
        }

        enemy.colRects = []
        properties.colRects.forEach(function(rect) {
            enemy.colRects.push({
                x: enemy.x,
                y: enemy.y,
                width: enemy.width * rect.colXPercent,
                height: enemy.height * rect.colYPercent,
                dmgMult: rect.dmgMult,
                shiftingSlope: rect.shiftingSlope,
            })
        });
        enemy.dropWeights = positions[i].dropWeights || properties.dropWeights;
        enemy.dropChance = positions[i].dropChance || properties.dropChance;
        enemy.possibleDrops = positions[i].possibleDrops || properties.possibleDrops;
        app.stage.addChild(enemy);
        enemies.push(enemy);
        if(properties.init) {
            properties.init(enemy);
        }
        if(link) {
            if(link.nextSet) {
                dependencies.push(enemy);
            }
            if(link.thisSet) {
                dependencies[0].link = enemy;
                dependencies.shift();
                enemy.dependent = true;
            }
        }
    }
}
function disableUserInput(input) {
    keys[keyMappings[input]] = false;
}
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
        if(player.plasma.lastTime + player.plasma.cooldown < globalFrameCount && player.energy > player.plasma.damage * 5 / player.plasma.efficiencyScore) {
            if(player.activePowerup.type) {
                powerupData[player.activePowerup.type].onFireHandle();
                updateEnergyBar();
                updatePowerupBar();
            } else {
                fireLaser(player.x, player.y - player.height/2, 0, 10, "blue", player.plasma.damage);
                player.plasma.lastTime = globalFrameCount;
                player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
                updateEnergyBar();
            }
        }
    }

    var vector = normalize(player.vx, player.vy, player.speed)
    var energyToSpend = (Math.abs(vector.x) + Math.abs(vector.y))/player.efficiencyScore;
    if(player.energy > energyToSpend) {
        player.x += vector.x;
        player.y += vector.y;
        player.energy -= energyToSpend;
        updateEnergyBar();
    }
    player.x = constrain(player.width/2, player.x, canvasLength - player.width/2);
    player.y = constrain(player.height/2, player.y, canvasLength - player.height/2);
    globalY -= curLevel.speed * scalar * 0.25;
    if(globalY < curLevel.endY * scalar) {
        state = finish;
    }
    starfield.y += curLevel.speed * 0.25 * scalar * 0.25;
    handleLasers();
    handleEnemies();
    handleExplosions();
    handlePowerups();
}
function finish() {
    if(player.y < -100) {
        state = restart;
    }
    player.y -= 5;
    handleLasers();
    handleEnemies();
    handleExplosions();
    handlePowerups();
}
function restart() {
    enemies.forEach(function(enemy) {
        app.stage.removeChild(enemy);
    });
    powerups.forEach(function(enemy) {
        app.stage.removeChild(enemy);
    });
    lasers.forEach(function(laser) {
        app.stage.removeChild(laser);
    });
    explosions.forEach(function(exp) {
        app.stage.removeChild(exp);
    });
    enemies = [];
    powerups = [];
    lasers = [];
    explosions = [];
    player.tint = 0xFFFFFF;
    player.activePowerup = {};
    powerupHolder.visible = false;
    powerupBar.visible = false;
    energyBar.visible = false;
    energyHolder.visible = false;
    healthBar.visible = false;
    healthHolder.visible = false;
    
    starfield.clear();
    state = overworld;
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
function handlePowerups() {
    var i = 0;
    var len = powerups.length;
    for(i = 0; i < len; i++) {
        var cur = powerups[i];
        cur.y = cur.myY - globalY;
        var playerRect = {
            x: player.x,
            y: player.y,
            width: player.colRect.width,
            height: player.colRect.height
        }
        if(cur.y < player.y) {
            playerRect.y += Math.abs(cur.x-player.x)
        }
        if(hitTestRectangle(cur,playerRect)) {
            app.stage.removeChild(cur);
            powerups.splice(i,1);
            --i;
            --len;
            if(cur.value) {
                player.health += cur.value;
                player.health = Math.min(player.health,player.maxHealth);
                updateHealthBar();
                continue;
            }
            player.tint = cur.tint;
            player.activePowerup.type = cur.type;
            player.powerupEnergy = cur.energy;
            player.maxPowerupEnergy = cur.maxEnergy;
            powerupHolder.lineStyle(5, cur.tint,10);
            powerupHolder.beginFill(0x000015);
            powerupHolder.drawRect(0,0,150*scalar,15*scalar)
            powerupHolder.x = canvasLength - 175*scalar;
            powerupHolder.y = canvasLength - 75*scalar;
            powerupBar.lineStyle(5, cur.tint,10);
            powerupBar.beginFill(cur.tint, 10);
            powerupBar.drawRect(0,0,150*scalar,15*scalar);
            powerupBar.x = canvasLength - 175*scalar;
            powerupBar.y = canvasLength - 75*scalar;
            powerupBar.maxWidth = 150*scalar;
            powerupBar.visible = true;
            powerupHolder.visible = true;
        }
    }
}
function handleLasers() {
    var i = 0;
    var len = lasers.length;
    for(i = 0; i < len; i++) {
        var laser = lasers[i];
        if(laser.target) {
            if(laser.target.health > 0) {
                laser.direction = -pointTowards(laser.x,laser.y,laser.target.x,laser.target.y);
                laser.rotation = -pointInDirection(laser.direction);
            } else if(laser.gold) {
                laser.target = getClosestEnemy(laser, function(enemy) {
                    if(enemy === laser.lastHit || enemy.dependent) {
                        return false;
                    } else {
                        return true;
                    }
                });
                if(laser.target) {
                    laser.direction = -pointTowards(laser.x,laser.y,laser.target.x,laser.target.y);
                    laser.rotation = -pointInDirection(laser.direction);
                }
            }
        }
        if(laser.kill) {
            app.stage.removeChild(laser);
            lasers.splice(i,1);
            --i;
            --len;
            if(laser === player.activePowerup.loadedBullet) {
                player.activePowerup.loadedBullet = false;
            }
            continue;
        }
        var vector = direction(laser.speed, laser.direction);
        laser.x += vector.x;
        laser.myY += vector.y;
        laser.y = laser.myY - globalY;
        if(laser.y < -100 * scalar || laser.y > canvasLength + 100 * scalar || laser.x < -100 * scalar || laser.x > canvasLength + 100 * scalar) {
            app.stage.removeChild(laser);
            lasers.splice(i,1);
            --i;
            --len;

            if(laser === player.activePowerup.loadedBullet) {
                player.activePowerup.loadedBullet = false;
            }
            continue;
        }
        if(laser.good) {
            enemies.forEach(function(enemy){
                if(laser.lastHit !== enemy && !enemy.dependent) {
                    var col = handleLaserCol(laser,enemy);
                    if(col && laser.gold && laser.bounce > 0) {
                        if(laser.lastHit !== enemy) {
                            laser.lastHit = enemy;
                            laser.target = getClosestEnemy(laser, function(enemy) {
                                if(enemy === laser.lastHit || enemy.dependent) {
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                            if(!laser.target) {
                                enemy.health -= laser.bounce;
                            }
                            --laser.bounce;
                        }
                    } else if(col && !laser.alreadyDead) {
                        laser.alreadyDead = true;
                        app.stage.removeChild(laser);
                        lasers.splice(i,1);
                        --i;
                        --len;
                    }
                }
            });
        } else {
            var playerRect = {
                x: player.x,
                y: player.y,
                width: player.colRect.width,
                height: player.colRect.height
            }

            if(laser.y < player.y) {
                playerRect.y += Math.abs(laser.x-player.x)
            }
            if(hitTestRectangle(laser,playerRect)) {
                app.stage.removeChild(laser);
                lasers.splice(i,1);
                --i;
                --len;
                explode(1,{x: laser.x, y: laser.y-10},20);
                player.health -= laser.damage;
                updateHealthBar();
            }
        }
    }
}
function handleLaserCol(laser, enemy) {
    var i;
    var len = enemy.colRects.length;
    for(i = 0; i < len; i++) {
        var enemyRect = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.colRects[i].width,
            height: enemy.colRects[i].height
        }
        if(enemy.colRects[i].shiftingSlope && laser.y > enemy.y) {
            enemyRect.y -= Math.abs(laser.x-enemy.x) * enemy.colRects[i].shiftingSlope;
        }
        if(hitTestRectangle(laser,enemyRect)) {
            if(laser === player.activePowerup.loadedBullet) {
                player.activePowerup.loadedBullet = false;
            }
            explode(1,{x: laser.x, y: laser.y-10},20);
            enemy.health -= laser.damage * enemy.colRects[i].dmgMult;
            return true;
        }
    }
}
function getClosestEnemy(sprite,condition) {
    condition = condition || function(){return true};
    var bestDist = Infinity;
    var bestMatch = false;
    for(var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var dist = getDistance(sprite.x,sprite.y,enemy.x,enemy.y);
        if(dist < bestDist && condition(enemy)) {
            bestDist = dist;
            bestMatch = enemy;
        }
    }
    return bestMatch;
}
function updateHealthBar() {
    healthBar.width = (player.health * healthBar.maxWidth) / player.maxHealth;
}
function updateEnergyBar() {
    energyBar.width = (player.energy * energyBar.maxWidth) / player.maxEnergy;
}
function updatePowerupBar() {
    powerupBar.width = (player.powerupEnergy * powerupBar.maxWidth) / player.maxPowerupEnergy;
    if(player.powerupEnergy <= 0) {
        powerupBar.visible = false;
        powerupHolder.visible = false;
        player.tint = 0xFFFFFF;
        player.activePowerup.type = false;
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
            handleDrop(curEnemy);
        }
    }
}
function handleDrop(enemy) {
    var len = enemy.dropWeights.length;
    var random = curLevel.randInt(1,100);
    if(enemy.dropChance < random) {
        return;
    }
    var i;
    var random = curLevel.randInt(1,100);
    var sum = 0;
    for(i = 0; i < len; i++) {
        if(enemy.dropWeights[i]+sum >= random) {
            spawnDrop(enemy.possibleDrops[i], enemy.x, enemy.y);
            break;
        }
        sum += enemy.dropWeights[i];
    }
}
function spawnDrop(type, x, y) {
    if(type === "coin" || type === "5coin" || type === "10coin") {
        var powerup = new Sprite(keysOfSprites[type]);
    } else {
        var powerup = new Sprite(keysOfSprites["upgrade-ball"]);
    }
    powerup.anchor.set(0.5,0.5);
    powerup.scale.set(2);
    app.stage.addChild(powerup);
    powerup.x = x;
    powerup.y = y;
    powerup.myY = y + globalY;
    powerup.type = type;
    if(type === "coin") {
        powerup.value = 1;
    } else if(type === "5coin") {
        powerup.value = 5;
    } else if(type === "10coin") {
        powerup.value = 10;
    } else {
        powerup.tint = powerupData[type].tint;
        powerup.energy = powerupData[type].maxEnergy;
        powerup.maxEnergy = powerupData[type].maxEnergy;
    }
    powerups.push(powerup);
}
function fireLaser(x, y, direction, speed, type, damage, target) {
    if(type !== "red" && type !== "blue") {
        var laser = new Sprite(keysOfSprites["grey-plasma"]);
        laser.tint = powerupData[type].tint;
    } else {
        var laser = new Sprite(keysOfSprites[type + "-plasma"]);
    }
    laser.scale.set(2 * scalar);
    laser.good = type !== "red";
    laser.x = x;
    laser.y = y;
    laser.myY = y + globalY;
    laser.target = target;
    laser.anchor.set(0.5,0.5);
    laser.rotation = pointInDirection(-direction);
    laser.speed = speed * scalar;
    laser.direction = direction;
    laser.damage = damage;
    if(type === "gold") {
        laser.gold = true;
        laser.bounce = 10;
    }
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
    if(!questionSet.answersLocked) {
        if(e.code.substring(0,5) === "Digit") {
            if(numDiv.innerHTML.length < 7) {
                numDiv.innerHTML += e.code[5]
            }
        }
        if(e.code.substring(0,6) === "Numpad" && (/\d/).test(e.code[6])) {
            if(numDiv.innerHTML.length < 7) {
                numDiv.innerHTML += e.code[6]
            }
        }
        if(e.code === "Semicolon" || e.code === "Period" || e.code === "NumpadDecimal") {
            if(numDiv.innerHTML.length < 7 && !(/\./).test(numDiv.innerHTML) && numDiv.innerHTML.length) {
                numDiv.innerHTML += "."
            }
        }
        if(e.code === "Backspace" && numDiv.innerHTML.length) {
            numDiv.innerHTML = numDiv.innerHTML.substring(0,numDiv.innerHTML.length-1);
        }
        if(e.code === "Enter" || e.code === "NumpadEnter") { 
            if(questionSet.verifyAnswer(numDiv.innerHTML)) {
                player.energy += player.generator.energyPerQuestion;
                player.energy = Math.min(player.energy, player.maxEnergy);
                updateEnergyBar();
                textDiv.innerHTML = questionSet.chooseNewVerse();
                numDiv.innerHTML = "";
            } else {
                numDiv.style.color = "red";
                questionSet.answersLocked = true;
                setTimeout(function() {
                    numDiv.style.color = "green";
                    numDiv.innerHTML = questionSet.returnCorrectAnswer();
                    setTimeout(function() {
                        textDiv.innerHTML = questionSet.chooseNewVerse();
                        numDiv.style.color = "white";
                        numDiv.innerHTML = "";
                        questionSet.answersLocked = false;
                    },1000);
                },1000);
            }
        }
}
});
addEventListener("keyup", function (e){
    keys[e.key] = false;
});