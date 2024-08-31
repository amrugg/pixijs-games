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
"sprites/ball.png", "sprites/lvl1/plasma-top.png", "sprites/lvl1/plasma-base.png", "sprites/grey-laser.png", "sprites/coin.png","sprites/5coin.png","sprites/10coin.png","sprites/lvl1/asteroid-2.png"];
var spriteNames = ["player", "blue-plasma", "red-plasma", "enemy-1-1", "enemy-1-2", "enemy-1-3", "asteroid-1", "exp-1", "exp-2", "exp-3",
"upgrade-ball", "plasma-top", "plasma-base", "grey-plasma", "coin", "5coin", "10coin","asteroid-2"];

var health = 20;
var maxHealth = 20;
var xp = 0;
var maxXp = 4;
var maxPowerupTime = 120;
var activePowerup;
var curPowerupTime = 0;
var keysOfSprites;
var state;
var dependencies = [];
var keys = {};
var mouseX
var mouseY;
var enemies = [];
var explosions = [];
var lasers = [];
var powerups = [];
var globalFrameCount = 0;
var healthBar;
var healthHolder;
var powerupBar;
var powerupHolder;
var xpBar;
var xpHolder;
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
    xpHolder = new PIXI.Graphics();
    xpHolder.lineStyle(5, 0xEEEEEE,10);
    xpHolder.beginFill(0x000015);
    xpHolder.drawRect(0,0,150*scalar,15*scalar)
    app.stage.addChild(xpHolder);
    xpHolder.x = canvasLength - 175*scalar;
    xpHolder.y = canvasLength - 25*scalar;
    xpBar = new PIXI.Graphics();
    xpBar.lineStyle(5, 0xEEEEEE,10);
    xpBar.beginFill(0xEEEEEE, 10);
    xpBar.drawRect(0,0,150*scalar,15*scalar);
    xpBar.x = canvasLength - 175*scalar;
    xpBar.y = canvasLength - 25*scalar;
    xpBar.maxWidth = 150*scalar;
    xpBar.width = 0;
    app.stage.addChild(xpBar);


    /// Prepare powerup bar
    powerupHolder = new PIXI.Graphics();
    app.stage.addChild(powerupHolder);
    powerupBar = new PIXI.Graphics();
    app.stage.addChild(powerupBar);
    powerupHolder.visible = false;
    powerupBar.visible = false;
    xpBar.visible = false;
    xpHolder.visible = false;
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
    globalY = 0;
    healthBar.visible = true;
    healthHolder.visible = true;
    xpBar.visible = true;
    xpHolder.visible = true;
    powerupBar.visible = true;
    powerupHolder.visible = true;

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
    questionSet.answersLocked = false;
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
var fadeout = 0;
function play(){
    ++globalFrameCount;
    
    globalY -= curLevel.speed * scalar * 0.25;
    if(enemies.length === 0) {
        state = finish;
        fadeout = 60;
    }
    starfield.y += curLevel.speed * 0.25 * scalar * 0.25;
    handleLasers();
    handleEnemies();
    handleExplosions();
    if(curPowerupTime) {
        --curPowerupTime;
        updatePowerupBar();
    }
}
function finish() {
    if(--fadeout === 0) {
        state = restart;
    }
    handleLasers();
    handleEnemies();
    handleExplosions();
}
function restart() {
    lasers.forEach(function(laser) {
        app.stage.removeChild(laser);
    });
    explosions.forEach(function(exp) {
        app.stage.removeChild(exp);
    });
    lasers = [];
    explosions = [];
    healthBar.visible = false;
    healthHolder.visible = false;
    xpBar.visible = false;
    xpHolder.visible = false;
    powerupBar.visible = false;
    powerupHolder.visible = false;
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
            continue;
        }
        var vector = direction(laser.speed, laser.direction);
        laser.x += vector.x;
        laser.myY += vector.y;
        laser.y = laser.myY - globalY;
        if(laser.y < -100 * scalar || laser.y > canvasLength + 500 * scalar || laser.x < -100 * scalar || laser.x > canvasLength + 100 * scalar) {
            app.stage.removeChild(laser);
            lasers.splice(i,1);
            --i;
            --len;
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
function handleEnemies() {
    var i;
    var len = enemies.length;
    for(i = 0; i < len; i++) {
        var cut = handleEnemy(enemies[i]);
        if(cut) {
            enemies.splice(i,1);
            --i;
            --len;
        }
    }
}
function handleEnemy(enemy) {
    enemy.y = enemy.myY - globalY;
    if(enemy.y > canvasLength + enemy.height/2) {
        app.stage.removeChild(enemy);
        healthBar.width -= 10;
        return true;
    }
    if(enemy.health <= 0) {
        explode(20,enemy, 50);
        app.stage.removeChild(enemy);
        /// Return true; the ship was destroyed and should be removed from the array
        return true;
    }
    /// Return false; the ship should not be removed from the array
    return false;
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
                answerCorrect();
            } else {
                answerIncorrect();
            }
        }
}
});
function getFarthestEnemy() {
    var i;
    var len = enemies.length;
    var maxY = -1000;
    var match = enemies[0];
    for(i = 0; i < len; i++) {
        var cur = enemies[i];
        if(cur.y > maxY) {
            maxY = cur.y;
            match = cur; 
        }
    }
    return match;
}
function updateHealthBar() {
    healthBar.width = (health * healthBar.maxWidth) / maxHealth;
}
function updateXpBar() {
    xpBar.width = (xp * xpBar.maxWidth) / maxXp;
}
function updatePowerupBar() {
    powerupBar.width = (curPowerupTime * powerupBar.maxWidth) / maxPowerupTime;
    if(curPowerupTime === 0) {
        powerupBar.visible = false;
        powerupHolder.visible = false;
        activePowerup = false;
    }
}
function answerCorrect() {
    textDiv.innerHTML = questionSet.chooseNewVerse();
    numDiv.innerHTML = "";

    if(activePowerup) {
        activePowerup.onFireHandle(getFarthestEnemy());
        curPowerupTime = 0;
        updatePowerupBar();
    } else {
        fireLaser(getFarthestEnemy().x, canvasLength, 0, 10, "blue", 1);
    }
    if(++xp === maxXp) {
        xp = 0;
        health++;
        health = constrain(0,health, maxHealth);
        updateHealthBar();
        initPowerup();
        questionSet.updateRange();
        rangeDiv.textContent = questionSet.verseRange;
        if(questionSet.verseRange.split("-")[0] === "1") {
            maxXp = 7;
        } else {
            maxXp = 4;
        }
    }
    updateXpBar();
}
function initPowerup() {
    var powerups = Object.keys(powerupData);
    var powerup = powerupData[powerups[randInt(0,powerups.length-1)]]
    curPowerupTime = powerup.time;
    maxPowerupTime = powerup.time;
    activePowerup = powerup;
    drawPowerupBar(powerup);
}
function drawPowerupBar(powerup) {
    powerupHolder.clear();
    powerupBar.clear();
    powerupHolder.lineStyle(5, powerup.tint,10);
    powerupHolder.beginFill(0x000015);
    powerupHolder.drawRect(0,0,150*scalar,15*scalar)
    powerupHolder.x = canvasLength - 175*scalar;
    powerupHolder.y = canvasLength - 75*scalar;
    powerupBar.lineStyle(5, powerup.tint,10);
    powerupBar.beginFill(powerup.tint, 10);
    powerupBar.drawRect(0,0,150*scalar,15*scalar);
    powerupBar.x = canvasLength - 175*scalar;
    powerupBar.y = canvasLength - 75*scalar;
    powerupBar.maxWidth = 150*scalar;
    powerupBar.visible = true;
    powerupHolder.visible = true;
}
function answerIncorrect() {
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
    xp = 0;
    updateXpBar();
}
addEventListener("keyup", function (e){
    keys[e.key] = false;
});