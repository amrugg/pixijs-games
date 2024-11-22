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
"sprites/ball.png", "sprites/lvl1/plasma-top.png", "sprites/lvl1/plasma-base.png", "sprites/grey-laser.png", "sprites/coin.png","sprites/5coin.png","sprites/10coin.png","sprites/lvl1/asteroid-2.png",
"sprites/weapons/missiles/heat.png","sprites/weapons/smoke.png","sprites/weapons/missiles/dumb.png", "sprites/weapons/missiles/radar.png", "sprites/weapons/missiles/torpedo.png", "sprites/weapons/smoke-small.png"];
var spriteNames = ["player", "blue-plasma", "red-plasma", "enemy-1-1", "enemy-1-2", "enemy-1-3", "asteroid-1", "exp-1", "exp-2", "exp-3",
"upgrade-ball", "plasma-top", "plasma-base", "grey-plasma", "coin", "5coin", "10coin","asteroid-2",
"heat", "smoke", "DF", "radar", "torpedo", "smoke-small"];

var ui;
var background;
var foreground;
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
var missiles = [];
var powerups = [];
var globalFrameCount = 0;
var healthBar;
var healthHolder;
var powerupBar;
var powerupHolder;
var energyBar;
var battleMode = "locked";
var energyHolder;
var starfield;
var targetLock;
var curLevel;
var coins = 0;
var missileData = {
    "heat": {radius: 200, primDamage: 3, burstDamage: 1, speed: 5, acc: 0.3, trailMax: 5, trailType: "smoke", lockTime: 30},
    "DF": {radius: 250, primDamage: 3, burstDamage: 1, speed: 10, acc: 0.5, trailMax: 4, trailType: "smoke", lockTime: Infinity},
    "radar": {radius: 300, primDamage: 3, burstDamage: 1, speed: 3, acc: 0.75, trailMax: 3, trailType: "smoke", lockTime: 60},
    "torpedo": {radius: 0, primDamage: 5, burstDamage: 0, speed: 20, acc: 1, trailMax: 2, trailType: "smoke", lockTime: Infinity},
};

///Handle different weapons
var weaponIndex = 0;
var weaponList = ["DF", "heat", "radar", "torpedo"];
var weaponUI = [];

/// Scale the sprites for different screens
var scalar = innerHeight/800;

/// Length of canvas
var canvasLength = app.renderer.view.width

/// Store custom key-mappings
var keyMappings = {up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", fire: " ", switch: "z", special: "x", target: "c"};

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
    background = new PIXI.Container();
    foreground = new PIXI.Container();
    ui = new PIXI.Container();
    app.stage.addChild(background);
    app.stage.addChild(foreground);
    app.stage.addChild(ui);
    starfield = new PIXI.Graphics();
    background.addChild(starfield);
    targetLock = new PIXI.Graphics();
    ui.addChild(targetLock);
    keysOfSprites = keySpritesTo(spriteNames, spritesToLoad);
    player = new Sprite(keysOfSprites.player);
    player.visible = false;
    foreground.addChild(player);
    player.scale.set(1.75 * scalar);
    player.anchor.set(0.5,0.5);
    player.x = canvasLength/2;
    player.y = canvasLength - player.height/2 - 30;
    player.ax = 0;
    player.ay = 0;
    player.ar = 0;
    player.vx = 0;
    player.vy = 0;
    player.vr = 0;
    player.speed = 1 * scalar;
    player.turnSpeed = 0.05;
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
    player.target = {
        enemy: false,
        index: -1,
        locking: -1,
        locked: false,
        border: 20 * scalar,
    }
    player.launcher = {
        cooldown: 30,
        lastTime: -1000,
        targetSpeed: 1,
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
    ui.addChild(healthHolder);
    healthHolder.x = canvasLength - 175*scalar;
    healthHolder.y = canvasLength - 50*scalar;
    healthBar = new PIXI.Graphics();
    healthBar.lineStyle(5, 0xFF33333,10);
    healthBar.beginFill(0xFF3333, 10);
    healthBar.drawRect(0,0,150*scalar,15*scalar);
    healthBar.x = canvasLength - 175*scalar;
    healthBar.y = canvasLength - 50*scalar;
    healthBar.maxWidth = 150*scalar;
    ui.addChild(healthBar);

    /// Build energy bar
    energyHolder = new PIXI.Graphics();
    energyHolder.lineStyle(5, 0x00FFFF,10);
    energyHolder.beginFill(0x000015);
    energyHolder.drawRect(0,0,150*scalar,15*scalar)
    ui.addChild(energyHolder);
    energyHolder.x = canvasLength - 175*scalar;
    energyHolder.y = canvasLength - 25*scalar;
    energyBar = new PIXI.Graphics();
    energyBar.lineStyle(5, 0x00FFFF,10);
    energyBar.beginFill(0x00FFFF, 10);
    energyBar.drawRect(0,0,150*scalar,15*scalar);
    energyBar.x = canvasLength - 175*scalar;
    energyBar.y = canvasLength - 25*scalar;
    energyBar.maxWidth = 150*scalar;
    ui.addChild(energyBar);


    /// Prepare powerup bar
    powerupHolder = new PIXI.Graphics();
    ui.addChild(powerupHolder);
    powerupBar = new PIXI.Graphics();
    ui.addChild(powerupBar);
    powerupHolder.visible = false;
    powerupBar.visible = false;
    energyBar.visible = false;
    energyHolder.visible = false;
    healthBar.visible = false;
    healthHolder.visible = false;
    createMissileIndex(weaponList)

    state = overworld;
    app.ticker.add(delta => gameLoop(delta));
}
function createMissileIndex(arr) {
    for(var i = 0; i < arr.length; i++) {
        var missile = new Sprite(keysOfSprites[arr[i]]);
        if(i === 0) {
            missile.scale.set(1.25* scalar);
        } else {
            missile.alpha = 0.5;
        }
        ui.addChild(missile);
        missile.x = (20 + (30 * i)) * scalar;
        missile.anchor.set(0,1)
        missile.y = canvasLength - 20*scalar;
        weaponUI.push(missile);
    }
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
    player.y = canvasLength - player.height/2 - 30;
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
        console.log(type)
        enemy.scale.set(scalar * properties.scale)
        enemy.anchor.set(0.5,0.5);
        enemy.type = type;
        enemy.level = level;
        if(curPos.x === "random") {
            curPos.x = seededRandInt(0,canvasLength);
        }
        enemy.x = curPos.x * scalar;
        enemy.myY = curPos.y * scalar;
        enemy.y = enemy.myY;
        enemy.rotation = properties.direction
        
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
        enemy.noTarget = positions[i].noTarget || properties.noTarget;
        enemy.possibleDrops = positions[i].possibleDrops || properties.possibleDrops;
        enemy.lockResist = positions[i].lockResist || properties.lockResist || 30;
        foreground.addChild(enemy);
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
    player.ax = 0;
    player.ay = 0;
    player.ar = 0;
    if(userInput.up && player.y > player.height/2) {
        player.ay -= player.speed;
    }
    if(userInput.down && player.y < canvasLength - player.height/2) {
        player.ay += player.speed;
    }
    if(userInput.left && player.x > player.width/2) {
        player.ax -= player.speed;
        player.ar -= player.turnSpeed;
    }
    if(userInput.right && player.x < canvasLength - player.width/2) {
        player.ax += player.speed;
        player.ar += player.turnSpeed;
    }

    player.vx += player.ax;
    player.vy += player.ay;
    player.vr += player.ar;
    player.vx *= 0.9;
    player.vy *= 0.9;
    player.vr *= 0.9;
    if(Math.abs(player.vx) < 0.01) {
        player.vx = 0;
    }
    if(Math.abs(player.vy) < 0.01) {
        player.vy = 0;
    }
    if(Math.abs(player.vr) < 0.01) {
        player.vr = 0;
    }
    var energyToSpend = (Math.abs(player.ax) + Math.abs(player.ay))/player.efficiencyScore;
    if(player.energy > energyToSpend) {
        player.x += player.vx;
        player.y += player.vy;
        if(battleMode === "locked") {
            player.rotation = player.vr;
        } else {
            player.rotation += player.vr;
        }
        player.energy -= energyToSpend;
        updateEnergyBar();
    }
    player.x = constrain(player.width/2, player.x, canvasLength - player.width/2);
    player.y = constrain(player.height/2, player.y, canvasLength - player.height/2);
    if(userInput.switch) {
        disableUserInput("switch");
        resetLockProgress();
        weaponIndex++;
        if(weaponIndex >= weaponList.length) {
            weaponIndex = 0;
        }
        weaponUI.forEach(function(weapon, i) {
            if(i === weaponIndex) {
                weapon.alpha = 1;
                weapon.scale.set(scalar * 1.25);
            } else {
                weapon.alpha = 0.5;
                weapon.scale.set(scalar * 1);
            }
        })
    }
    if(userInput.fire) {
        player.firePoint = direction(player.rotation, player.height/2);
        if(player.plasma.lastTime + player.plasma.cooldown < globalFrameCount && player.energy > player.plasma.damage * 5 / player.plasma.efficiencyScore) {
            if(player.activePowerup.type) {
                powerupData[player.activePowerup.type].onFireHandle();
                updateEnergyBar();
                updatePowerupBar();
            } else {
                fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "blue", player.plasma.damage);
                player.plasma.lastTime = globalFrameCount;
                player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
                updateEnergyBar();
            }
        }
    }
    if(userInput.special) {
        var weapon = weaponList[weaponIndex];
        if(missileData[weapon]) {

            player.firePoint = direction(player.rotation, player.height/2);
            if(player.launcher.lastTime + player.launcher.cooldown < globalFrameCount && player.energy > player.launcher.efficiencyScore) {
                if(player.target.locked) {
                    launchMissile(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, weapon, player.target.enemy);
                } else {
                    launchMissile(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, weapon, false);
                }
                player.launcher.lastTime = globalFrameCount;
            }
        }
    }
    if(userInput.target) {
        disableUserInput("target");
        trackEnemy();
    }
    if(player.target.enemy) {
        if(!isValidTarget(player.target.enemy)) {
            player.target.enemy = false;
            player.target.index = -1;
            player.target.locking = -1;
            player.target.locked = false;
            targetLock.visible = false;
        }
        targetLock.x = player.target.enemy.x - player.target.enemy.width/2 - player.target.border/2;
        targetLock.y = player.target.enemy.y - player.target.enemy.height/2 - player.target.border/2;
        player.target.locking++;
        if(player.target.locking >= player.target.enemy.lockResist + missileData[weaponList[weaponIndex]].lockTime && !player.target.locked) {        
            targetLock.clear();
            targetLock.lineStyle(5, 0xAA5555);
            targetLock.drawRect(0, 0, player.target.enemy.width + player.target.border, player.target.enemy.height + player.target.border);
            player.target.locked = true;
        }
    } else {
        player.target.locking = 0;
    }
    
    globalY -= curLevel.speed * scalar * 0.25;
    if(globalY < curLevel.endY * scalar) {
        state = finish;
    }
    starfield.y += curLevel.speed * 0.25 * scalar * 0.25;
    handleLasers();
    handleMissiles();
    handleEnemies();
    handleExplosions();
    handlePowerups();
}
function resetLockProgress() {
    player.target.locking = 0;
    player.target.locked = false;
    targetLock.lineStyle(5, 0x555555);
    targetLock.drawRect(0, 0, player.target.enemy.width + player.target.border, player.target.enemy.height + player.target.border);
}
function trackEnemy() {
    if(!findTarget()) {
        player.target.index = -1;
        if(!findTarget()) {
            player.target.enemy = false;
            player.target.index = -1;
            player.target.locking = -1;
            player.target.locked = false;
            targetLock.visible = false;
            return;
        }
    }
    player.target.locked = false;
    player.target.locking = 0;
    targetLock.visible = true;
    targetLock.clear();
    targetLock.lineStyle(5, 0x555555);
    targetLock.drawRect(0, 0, player.target.enemy.width + player.target.border, player.target.enemy.height + player.target.border);
    targetLock.x = player.target.enemy.x - player.target.enemy.width/2 - player.target.border/2;
    targetLock.y = player.target.enemy.y - player.target.enemy.height/2 - player.target.border/2;
}
function findTarget() {
    for(var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if(isValidTarget(enemy)) {
            if(player.target.index < i) {
                player.target.enemy = enemy;
                player.target.index = i;
                return true;
            }
        }
    }
    return false;
}
function isValidTarget(enemy) {
    return enemy.x > -enemy.width/2 && enemy.x < canvasLength + enemy.width/2 && enemy.y > -enemy.height/2 && enemy.y < canvasLength + enemy.height/2 && enemy.health > 0;
}
function finish() {
    if(player.y < -100) {
        state = restart;
    }
    player.y -= 5;
    handleLasers();
    handleMissiles();
    handleEnemies();
    handleExplosions();
    handlePowerups();
}
function restart() {
    enemies.forEach(function(enemy) {
        foreground.removeChild(enemy);
    });
    powerups.forEach(function(enemy) {
        foreground.removeChild(enemy);
    });
    lasers.forEach(function(laser) {
        foreground.removeChild(laser);
    });
    explosions.forEach(function(exp) {
        background.removeChild(exp);
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
        explosions[i].alpha -= explosions[i].fadeSpeed || 0.05;
        if(explosions[i].alpha <= 0) {
            background.removeChild(explosions[i]);
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
            foreground.removeChild(cur);
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
            powerupHolder.clear();
            powerupBar.clear();
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
                laser.rotation = laser.direction;
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
                    laser.rotation = laser.direction;
                }
            }
        }
        if(laser.kill) {
            foreground.removeChild(laser);
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
            foreground.removeChild(laser);
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
                        foreground.removeChild(laser);
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
                foreground.removeChild(laser);
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
function handleMissiles() {
    var i = 0;
    var len = missiles.length;
    for(i = 0; i < len; i++) {
        var missile = missiles[i];

        debugger;
        if(++missile.trailNum === missile.trailMax) {
            missile.trailNum = 0;
            var smoke = new Sprite(keysOfSprites[missile.trailType]);
            var tail = normalize(-missile.vector.x, -missile.vector.y, missile.height/2);
            smoke.x = missile.x + tail.x;
            smoke.y = missile.y + tail.y;
            smoke.anchor.set(0.5,0.5);
            smoke.fadeSpeed = 0.025;
            background.addChild(smoke);
            explosions.push(smoke);
        }
        // if(laser.target) {
        //     if(laser.target.health > 0) {
        //         laser.direction = -pointTowards(laser.x,laser.y,laser.target.x,laser.target.y);
        //         laser.rotation = laser.direction;
        //     } else if(laser.gold) {
        //         laser.target = getClosestEnemy(laser, function(enemy) {
        //             if(enemy === laser.lastHit || enemy.dependent) {
        //                 return false;
        //             } else {
        //                 return true;
        //             }
        //         });
        //         if(laser.target) {
        //             laser.direction = -pointTowards(laser.x,laser.y,laser.target.x,laser.target.y);
        //             laser.rotation = laser.direction;
        //         }
        //     }
        // }
        // if(laser.kill) {
        //     foreground.removeChild(laser);
        //     lasers.splice(i,1);
        //     --i;
        //     --len;
        //     if(laser === player.activePowerup.loadedBullet) {
        //         player.activePowerup.loadedBullet = false;
        //     }
        //     continue;
        // }
        if(missile.target) {
            if(missile.target.health <= 0) {
                missile.target = false;
                var force = normalize(missile.vector.x,missile.vector.y, missile.acc);
            } else {
                var force = normalize(missile.target.x - missile.x, missile.target.y - missile.y, missile.acc);
            }
        } else {
            var force = normalize(missile.vector.x,missile.vector.y, missile.acc);
        }
        missile.rotation = -pointTowards(0, 0, missile.vector.x,missile.vector.y);
        missile.vector.x *= 0.975;
        missile.vector.y *= 0.975;
        missile.vector.x += force.x;
        missile.vector.y += force.y;
        missile.x += missile.vector.x;
        missile.myY += missile.vector.y;
        missile.y = missile.myY - globalY;
        if(missile.y < -100 * scalar || missile.y > canvasLength + 100 * scalar || missile.x < -100 * scalar || missile.x > canvasLength + 100 * scalar) {
            foreground.removeChild(missile);
            missiles.splice(i,1);
            --i;
            --len;

            if(missile === player.activePowerup.loadedBullet) {
                player.activePowerup.loadedBullet = false;
            }
            continue;
        }
        if(missile.good) {
            enemies.forEach(function(enemy){
                if(missile.lastHit !== enemy && !enemy.dependent) {
                    var col = handleMissileCol(missile,enemy);
                    if(col && !missile.alreadyDead) {
                        missile.alreadyDead = true;
                        foreground.removeChild(missile);
                        missiles.splice(i,1);
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

            if(missile.y < player.y) {
                playerRect.y += Math.abs(missile.x-player.x)
            }
            if(hitTestRectangle(missile,playerRect)) {
                foreground.removeChild(missile);
                missiles.splice(i,1);
                --i;
                --len;
                explode(1,{x: missile.x, y: missile.y-10},20);
                player.health -= missile.damage;
                updateHealthBar();
            }
        }
    }
}
function handleMissileCol(missile, enemy) {
    var i;
    var len = enemy.colRects.length;
    for(i = 0; i < len; i++) {
        var enemyRect = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.colRects[i].width,
            height: enemy.colRects[i].height
        }
        if(enemy.colRects[i].shiftingSlope && missile.y > enemy.y) {
            enemyRect.y -= Math.abs(missile.x-enemy.x) * enemy.colRects[i].shiftingSlope;
        }
        if(hitTestRectangle(missile,enemyRect)) {
            explode(1,{x: missile.x, y: missile.y-10},20);
            enemy.health -= missile.exp.primDamage * enemy.colRects[i].dmgMult;
            return true;
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
    foreground.addChild(powerup);
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
    laser.rotation = direction;
    laser.speed = speed * scalar;
    laser.direction = direction;
    laser.damage = damage;
    if(type === "gold") {
        laser.gold = true;
        laser.bounce = 10;
    }
    foreground.addChild(laser);
    lasers.push(laser);
    return laser;
}
function launchMissile(x, y, dir, type, target) {
    debugger;
    var missile = new Sprite(keysOfSprites[type]);
    missile.scale.set(scalar);
    missile.x = x;
    missile.y = y;
    missile.myY = y + globalY;
    missile.target = target;
    missile.anchor.set(0.5,0.5);
    missile.good = true;
    missile.rotation = dir;
    var curMissileData = missileData[type];
    console.log(curMissileData,type)
    missile.acc = curMissileData.acc * scalar;
    missile.radius = curMissileData.radius * scalar;
    missile.primDamage = curMissileData.primDamage;
    missile.burstDamage = curMissileData.burstDamage;
    missile.trailMax = curMissileData.trailMax || 5;
    missile.trailType = curMissileData.trailType || "smoke";

    missile.direction = dir;
    missile.vector = direction(curMissileData.speed, dir);
    missile.exp = missileData[type];
    missile.trailNum = 0;
    missile.type = type;
    foreground.addChild(missile);
    missiles.push(missile);
    return missile;
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
        background.addChild(explosion);
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