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
app.renderer.backgroundColor = 0x050520;
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
var healthBar;
var healthHolder;
var energyBar;
var energyHolder;
var starfield;
var curLevel;

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
sidebar.style.left = ((innerWidth - canvasLength)/2 + canvasLength + 2.5*scalar) + "px";

/// Make the verse text
var textDiv = document.createElement("div");
textDiv.style.position = "relative";
textDiv.innerHTML = "God, who at sundry times and in diverse manners spake in time past unto the fathers by the prophets,"
textDiv.style.fontSize = "30px";
textDiv.style.color = "white";
sidebar.appendChild(textDiv);

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
    player.health = 10;
    player.maxHealth = 10;

    player.energy = 100;
    player.maxEnergy = 100;
    player.efficiencyScore = 90;
    player.colRect = {
        x: player.x,
        y: player.y,
        width: player.width * 0.75,
        height: player.height * 0.9,
    }
    player.plasma = {
        cooldown: 30,
        lastTime: -1000,
        damage: 1,
        efficiencyScore: 1
    }
    player.generator = {
        energyPerQuestion: 10
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
    healthBar.lineStyle(5, 0xFF0000,10);
    healthBar.beginFill(0xFF0000, 10);
    healthBar.drawRect(0,0,150*scalar,15*scalar);
    healthBar.x = canvasLength - 175*scalar;
    healthBar.y = canvasLength - 50*scalar;
    healthBar.maxWidth = 150*scalar;
    app.stage.addChild(healthBar);

    /// Build energy bar
    energyHolder = new PIXI.Graphics();
    energyHolder.lineStyle(5, 0x00AAAA,10);
    energyHolder.beginFill(0x000015);
    energyHolder.drawRect(0,0,150*scalar,15*scalar)
    app.stage.addChild(energyHolder);
    energyHolder.x = canvasLength - 175*scalar;
    energyHolder.y = canvasLength - 25*scalar;
    energyBar = new PIXI.Graphics();
    energyBar.lineStyle(5, 0x00AAAA,10);
    energyBar.beginFill(0x00AAAA, 10);
    energyBar.drawRect(0,0,150*scalar,15*scalar);
    energyBar.x = canvasLength - 175*scalar;
    energyBar.y = canvasLength - 25*scalar;
    energyBar.maxWidth = 150*scalar;
    app.stage.addChild(energyBar);


    prepareLevel(level1);
    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

function prepareLevel(level) {
    curLevel = level;
    var i;
    var len = level.enemies.length;
    for(i = 0; i < len; i++) {
        var curEnemies = level.enemies[i];
        spawnNewEnemy(curEnemies.type, curEnemies.level, curEnemies.positions, level.randInt);
    }
    starfield.clear();
    for(i = 0; i < 100; i++) {
        starfield.beginFill(0xFFFFFF);
        starfield.drawRect(level.randInt(0, canvasLength), level.randInt(level.endY/2, canvasLength), 3*scalar, 3*scalar);
    }
    app.stage.addChild(starfield);
}
function spawnNewEnemy(type, level, positions, seededRandInt) {
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
        if(player.plasma.lastTime + player.plasma.cooldown < globalFrameCount && player.energy > player.plasma.damage * 5 / player.plasma.efficiencyScore) {
            fireLaser(player.x, player.y - player.height/2, 0, 10, "blue", player.plasma.damage);
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore
            updateEnergyBar();
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
    globalY -= curLevel.speed * scalar;
    if(globalY < curLevel.endY * scalar) {
        state = finish;
    }
    starfield.y += curLevel.speed * 0.25 * scalar;
    handleLasers();
    handleEnemies();
    handleExplosions();
}
function finish() {
    if(player.y < -100) {
        state = restart;
    }
    player.y -= 5;
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
        laser.myY += vector.y;
        laser.y =  laser.myY    - globalY;
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
                    enemy.health -= laser.damage;
                }
            });
        } else {
            var playerRect = {
                x: player.x,
                y: player.y,
                width: player.colRect.width,
                height: player.colRect.height
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
function updateHealthBar() {
    healthBar.width = (player.health * healthBar.maxWidth) / player.maxHealth;
}
function updateEnergyBar() {
    energyBar.width = (player.energy * energyBar.maxWidth) / player.maxEnergy;
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
    laser.myY = y + globalY;
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
    console.log(e.code)
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