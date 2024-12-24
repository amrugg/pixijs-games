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
    width: 800,
    height: 800,              
    antialias: true,
    transparent: false,
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
var charNames = ["tong", "nels", "sam", "flam", "tux", "will", "goat"];
var monsterNames = ["Goblin", "Dark Goblin", "Sam", "Flam", "Cobra", "Bat", "Ice Goblin", "River Dragon"];
loadArray(charNames, "sprites/chars/", "png");
loadArray(charNames, "sprites/heads/", "png");
loadArray(monsterNames, "sprites/monsters/", "png");
loader.add("sprites/particle.png").add("sprites/eye.png").add("sprites/bone.png").load(setup);
var background = new PIXI.Container();
var foreground = new PIXI.Container();
var ui = new PIXI.Container();
var state;
var keys = {};
var mouseX,mouseY;
var activeParty = [];
var totalParty = [];
var activePartyI = 0;
// var activeSetup = [[0.33,0.85], [0.66,0.85]];
var enemyParty = [];
var icon;
var iconContainer = new PIXI.Container();
var playerMenu = {};
var gameState = "actions";
var keyMappings = {up: ["ArrowUp", "ArrowLeft"], down: ["ArrowDown", "ArrowRight"], confirm: [" ", "x", "Enter"], back: ["z","Escape"]};
var partyActions = [];
var partyActionsI = 0;

var battleRandom = 1;
function updateBattleRandom() {
    battleRandom = randNum(0.75,1.25);
};

var animations = [];
var charTalkBox = new PIXI.Graphics();
var dialogues = [];
var dialogueTxt = new PIXI.Text("");
var frameOuts = [];
var particleEmitters = [];
var globalFrameCount = 0;
var loot = {gold: 0, xp: 0, items: []};
var partyGold = 0;
var partyItems = {};
addPartyItem("Barbecue Sauce");
var particles = [];
var particleContainer = new PIXI.Container();
var nelsVenegance = false;
var curSpecialName = "";
var twinAbility = 0;
function findActivePartyMember(name, party, verify) {
    verify = verify || function(){};
    for(var i = 0; i < party.length; i++) {
        if(party[i].name === name && verify(party[i])) {
            return party[i];
        }
    }
}
var statuses = [];
function setup() {
    updateBattleRandom();
    app.stage.addChild(background);
    app.stage.addChild(foreground);
    app.stage.addChild(particleContainer);
    app.stage.addChild(ui);
    playerMenu.list = new PIXI.Container();
    ui.addChild(playerMenu.list);
    ui.addChild(dialogueTxt);
    dialogueTxt.anchor.set(0.5,0.5);
    dialogueTxt.x = innerWidth/2;
    dialogueTxt.y = 25;
    dialogueTxt.visible = false;
    var tong = {
        name: "Tongarango",
        sprite: new Sprite(resources["sprites/chars/tong.png"].texture),
        atk: 15,
        def: 13,
        maxHP: 25,
        hp: 25,
        maxPP: 10,
        pp: 10,
        agl: 5,
        evd: 5,
        level: 1,
        xp: 0,
        actions: ["Fight", "Dino", "Swap", "Item"],
        status: [],
        Dino: {
            "Tremor": {
                pp: 3,
                dmgMult: 0.65,
                target: "all",
                animLen: 100,
                evade: false, /// Attack cannot be evaded
                charAnim: function(char) {
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["y"],
                        min: [char.y],
                        max: [char.y - 100],
                        direction: "both",
                        speed: 10,
                        mode: 1,
                        destruct: 1,
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                    animations.push({
                        sprite: target,
                        type: "transform",
                        props: ["x"],
                        min: [target.x],
                        max: [target.x + 10],
                        direction: "both",
                        speed: 5,
                        mode: 1,
                        destruct: 10,
                        i: 0,
                    });
                }
            },
            "Resuscitate": {
                pp: 2,
                dmgMult: function(target) {
                    console.log(target.hp)
                    if(target.hp <= 0) {
                        target.hp = Math.round(target.maxHP/5);
                        healFade(target.sprite);
                        makeTxt(target.hp,target.sprite);
                    } else {
                        makeTxt("Luke 5:31", target.sprite);
                    }
                },
                target: "one",
                allied: true,
                healing: true,
                animLen: 140,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    target = target[0].sprite;
                    foreground.removeChild(char);
                    foreground.addChild(char);
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["y"],
                        min: [char.y],
                        max: [-500],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {

                            setFrameout(function(){
                                char.x = target.x;
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["y"],
                                    min: [char.y],
                                    max: [target.y],
                                    direction: "one",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    cb: function() {
                                        animations.push({
                                            sprite: char.scale,
                                            type: "transform",
                                            props: ["x","y"],
                                            min: [0.75,0.75],
                                            max: [1.25, 1.25],
                                            direction: "one",
                                            speed: 15,
                                            mode: 1,
                                            destruct: 1,
                                                cb: function() {
                                                    setFrameout(function() {
    
                                                        animations.push({
                                                            sprite: char.scale,
                                                            type: "transform",
                                                            props: ["x","y"],
                                                            min: [1.25,1.25],
                                                            max: [0.75, 0.75],
                                                            direction: "one",
                                                            speed: 15,
                                                            mode: 1,
                                                            destruct: 1,
                                                            cb: function() {
                                                                setFrameout(function() {
    
                                                                    animations.push({
                                                                        sprite: char,
                                                                        type: "transform",
                                                                        props: ["x","y"],
                                                                        min: [char.x,char.y],
                                                                        max: [origX, origY],
                                                                        direction: "one",
                                                                        speed: 30,
                                                                        mode: 1,
                                                                        destruct: 1,
                                                                        
                                                                        i: -1,
                                                                    });
                                                                },30);
                                                            },
                                                            i: 0,
                                                        });
                                                    },60);
                                                },
                                            i: 0,
                                        });
                                    },
                                    i: 0,
                                });
                            },60);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
            "Dynamite": {
                pp: 5,
                dmgMult: 1,
                target: "all",
                animLen: 200,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [innerWidth/2, innerHeight/2],
                        direction: "both",
                        speed: 30,
                        mode: 1,
                        destruct: 1,
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    type: "transform",
                                    props: [],
                                    min: [],
                                    max: [],
                                    direction: "both",
                                    speed: 60,
                                    mode: 1,
                                    destruct: 1,
                                    play: function(anim) {
                                        for(var i = 0; i < 50; i++) {
                                            spawnParticle(innerWidth/2 + randInt(-300, 300), innerHeight/2 + randInt(-100, 100), 0xD93526, direction(13,randNum(-Math.PI/2.1,Math.PI/2.1)), 0).fadeSpeed = 0.01;
                                        }
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
                    setFrameout(function() {

                        animations.push({
                            sprite: target,
                            type: "transform",
                            props: ["x"],
                            min: [target.x],
                            max: [target.x - 5],
                            direction: "both",
                            speed: 7,
                            mode: 1,
                            destruct: 7,
                            i: 0,
                        });
                    },60);
                }
            },
            "Sumo Finish Flop": {
                pp: 2,
                dmgMult: 3,
                target: "one",
                animLen: 140,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    target = target[0].sprite;
                    foreground.removeChild(char);
                    foreground.addChild(char);
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["y"],
                        min: [char.y],
                        max: [-500],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {

                            setFrameout(function(){
                                char.x = target.x;
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["y"],
                                    min: [char.y],
                                    max: [target.y],
                                    direction: "one",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    cb: function() {
                                        animations.push({
                                            sprite: char.scale,
                                            type: "transform",
                                            props: ["x","y"],
                                            min: [0.75,0.75],
                                            max: [1.25, 1.25],
                                            direction: "one",
                                            speed: 15,
                                            mode: 1,
                                            destruct: 1,
                                                cb: function() {
                                                    setFrameout(function() {
    
                                                        animations.push({
                                                            sprite: char.scale,
                                                            type: "transform",
                                                            props: ["x","y"],
                                                            min: [1.25,1.25],
                                                            max: [0.75, 0.75],
                                                            direction: "one",
                                                            speed: 15,
                                                            mode: 1,
                                                            destruct: 1,
                                                            cb: function() {
                                                                setFrameout(function() {
    
                                                                    animations.push({
                                                                        sprite: char,
                                                                        type: "transform",
                                                                        props: ["x","y"],
                                                                        min: [char.x,char.y],
                                                                        max: [origX, origY],
                                                                        direction: "one",
                                                                        speed: 30,
                                                                        mode: 1,
                                                                        destruct: 1,
                                                                        
                                                                        i: -1,
                                                                    });
                                                                },30);
                                                            },
                                                            i: 0,
                                                        });
                                                    },60);
                                                },
                                            i: 0,
                                        });
                                    },
                                    i: 0,
                                });
                            },60);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
        }
    }
    tong.sprite.scale.set(0.75,0.75)
    tong.sprite.anchor.set(0.5,0.5);
    foreground.addChild(tong.sprite);
    
    icon = new Sprite(resources["sprites/eye.png"].texture);
    animations.push({
        sprite: icon.scale,
        type: "transform",
        props: ["x","y"],
        min: [1,1],
        max: [1.25,1.25],
        direction: "both",
        speed: 20,
        mode: 1,
        i: 0,
    });
    ui.addChild(icon);
    ui.addChild(iconContainer);
    icon.anchor.set(0.5,0.5);
    activeParty.push(tong);
    totalParty.push(tong);
    enemyParty = generateEnemyParty(gamePlayAgenda[gamePlayStatus].set);
    setForBattle(activeParty, enemyParty);
    charTalkBox.beginFill(0x3C71F7);
    charTalkBox.lineStyle(10, 0x51B4FF);
    charTalkBox.drawRect(2.5, 2.5, innerWidth-5, 200);
    
    gameState = "actions";
    state = play;
    app.ticker.add(delta => gameLoop(delta));
}
function newStatus(name, time, char) {
    var foundCurStatus;
    statuses.forEach(function(stat) {
        if(stat.name === name && stat.char === char) {
            foundCurStatus = stat;
            stat.time = time;
        }
    });
    if(foundCurStatus) {
        return foundCurStatus;
    }
    /*
                poison = 0x398712;
                heal = 0xD92662;
                valor = 0xEE402E
                */
    var status = {name, time, bonus: {}, char: char};
    if(name === "valor") {
        status.bonus.atk = {mult: 2};
        char.atk *= 2;
        status.emitter = addEmitter(char.sprite.x - 100, char.sprite.x + 100, char.sprite.y - 100, char.sprite.y + 100, function(){return randDir(1)}, 0xEE402E, 1, Infinity, 10);
    } else if(name === "poison") {
        status.bonus.hp = {val: Math.round(char.hp/10)};
        status.emitter = addEmitter(char.sprite.x - 100, char.sprite.x + 100, char.sprite.y - 100, char.sprite.y + 100, function(){return randDir(1)}, 0x398712, 1, Infinity, 10);
    }
    statuses.push(status);
    return status;
}
function loadPlayerMenu(char) {
    var els = [];
    playerMenu.targets = [];
    playerMenu.names = [];
    char.actions.forEach(function (name, i) {
        if(i === 1) {
            if(char.name === "Sam") {
                if(twinAbility === -1 || !findActivePartyMember("Flam", activeParty, function(char){return char.hp > 0})) {
                    return;
                }
            }
        }
        playerMenu.targets.push(name);
        var el = new PIXI.Text(name);
        playerMenu.names.push(name);
        playerMenu.list.addChild(el);
        el.y = 25 + i * 50;
        el.anchor.set(1,0.5);
        el.x = innerWidth - 25;
        els.push(el);
        if(i === 2 && activeParty.length === totalParty.length) {
            el.alpha = 0.5;
        } else if (i === 3 && noPartyItems()) {
            el.alpha = 0.5;
        }
    });
    playerMenu.choices = els;
    playerMenu.char = char;
    playerMenu.state = "basic";
    playerMenu.i = 0;    
    updateIcon();
}
function noPartyItems() {
    var keys = Object.keys(partyItems);
    for(var i = 0; i < keys.length; i++) {
        if(partyItems[keys[i]] > 0) {
            return false;
        }
    }
    return true;
}
function addPartyItem(e) {
    if(partyItems[e]) {
        ++partyItems[e];
    } else {
        partyItems[e] = 1;
    }
}
function clearPlayerMenu() {
    for(var i = 0; i <playerMenu.list.children.length; i+=0) {
        var cur = playerMenu.list.children[i]
        playerMenu.list.removeChild(cur);
    }
}
function loadAbilityMenu(ability,char) {
    var els = [];
    playerMenu.targets = [];
    playerMenu.names = [];
    var keys = Object.keys(ability);
    keys.forEach(function (name, i) {
        if(levelUpStats[char.name].ability[name] <= char.level) {
            var el = new PIXI.Text(name);
            playerMenu.names.push(name);
            playerMenu.list.addChild(el);
            el.y = 25 + i * 50;
            el.anchor.set(1,0.5);
            el.x = innerWidth - 250 + el.width;
            els.push(el);
            var pp = new PIXI.Text(ability[name].pp);
            playerMenu.list.addChild(pp);
    
            pp.y = 25 + i * 50;
            pp.anchor.set(1,0.5);
            pp.x = innerWidth - 25;
            var twinCheck = true;
            if(char.myTwin) {
                if(char.myTwin.pp < ability[name].pp) {
                    twinCheck = false;
                }
            }
            if(ability[name].pp > char.pp || twinCheck === false) {
                el.alpha = 0.5;
                pp.alpha = 0.5;
            }
            playerMenu.targets.push(ability[name]);
        }
    });
    playerMenu.choices = els;
    playerMenu.state = "complex";
    playerMenu.i = 0;
    
    updateIcon();
}
function loadSwapMenu() {
    var els = [];
    playerMenu.targets = [];
    playerMenu.names = [];
    var trueI = 0;
    for(var i = 0; i < totalParty.length; i++) {
        var cur = totalParty[i]
        if(!activeParty.includes(cur)) {
            var el = new PIXI.Text(cur.name);
            playerMenu.names.push(cur.name);
            playerMenu.list.addChild(el);
            el.y = 25 + trueI++ * 50;
            el.anchor.set(1,0.5);
            el.x = innerWidth - 25;
            els.push(el);
            if(cur.hp <= 0) {
                el.alpha = 0.5;
                pp.alpha = 0.5;
            }
            playerMenu.targets.push(cur);
        }
    };
    playerMenu.choices = els;
    playerMenu.state = "complex";
    playerMenu.i = 0;
    
    updateIcon();
}
function loadItemMenu() {
    var els = [];
    playerMenu.targets = [];
    playerMenu.names = [];
    var keys = Object.keys(partyItems);
    keys.forEach(function (name, i) {
        if(partyItems[name] <= 0) {
            return;
        }
        var el = new PIXI.Text(name);
        playerMenu.names.push(name);
        playerMenu.list.addChild(el);
        el.y = 25 + i * 50;
        el.anchor.set(1,0.5);
        el.x = innerWidth - 275 + el.width;
        els.push(el);
        var pp = new PIXI.Text(partyItems[name]);
        playerMenu.list.addChild(pp);
        pp.y = 25 + i * 50;
        pp.anchor.set(1,0.5);
        pp.x = innerWidth - 25;
        playerMenu.targets.push(itempedia[name]);
    });
    playerMenu.choices = els;
    playerMenu.state = "complex";
    playerMenu.i = 0;
    
    updateIcon();
}
function handleParticles(particles) {
    var i;
    var len = particles.length;
    for(i = 0; i < len; i++) {
        var part = particles[i];
        if(part.vector) {
            part.x += part.vector.x;
            part.y += part.vector.y;
        }
        if(part.alpha > 0) {
            part.alpha -= part.fadeSpeed || 0.01;
        } else {
            particleContainer.removeChild(part);
            particles.splice(i,1);
            --i;
            --len;
        }
    }
}
function spawnParticle(x,y,tint, vector) {
    var part = new Sprite(resources["sprites/particle.png"].texture);
    particleContainer.addChild(part);
    part.scale.set(0.5,0.5);
    particles.push(part);
    part.x = x;
    part.y = y;
    part.vector = vector;
    part.tint = tint;
    return part;
}
function drawBar(width, length, color) {
    var bar = new PIXI.Graphics();
    bar.beginFill(color);
    bar.drawRect(0,0,width,length);
    ui.addChild(bar);
    return bar;
}
function createInterface(char) {
    var hpBack = drawBar(200,10,0x000000);
    hpBack.x = char.sprite.x - char.sprite.width/2;
    hpBack.y = char.sprite.y + 10 + char.sprite.height/2;
    var hpBar = drawBar(200,10,0xEE402E);
    hpBar.x = hpBack.x;
    hpBar.y = hpBack.y;
    var hpText = new PIXI.Text(char.hp);
    hpText.x = hpBack.x + 210;
    hpText.y = hpBack.y - 10;
    ui.addChild(hpText);

    var ppBack = drawBar(200,10,0x000000);
    ppBack.x = char.sprite.x - char.sprite.width/2;
    ppBack.y = char.sprite.y + 40 + char.sprite.height/2;
    var ppBar = drawBar(200,10,0x059494);
    ppBar.x = ppBack.x;
    ppBar.y = ppBack.y;
    var ppText = new PIXI.Text(char.pp);
    ppText.x = ppBack.x + 210;
    ppText.y = ppBack.y - 10;
    ui.addChild(ppText);
    return {hpBack, hpBar, hpText, ppBack, ppBar, ppText}
}
function clearInterface(e) {
    if(!e.interface) {
        return;
    }
    var keys = Object.keys(e.interface);
    keys.forEach(function(key){
        ui.removeChild(e.interface[key]);
    });
}
function setForBattle(good, bad) {
    while(good.length > 4) {
        good.pop().sprite.visible = false;
    }
    for(var i = 0; i < good.length; i++) {
        good[i].sprite.x = innerWidth * (i+1)/(good.length+1);
        good[i].sprite.y = innerHeight - 180;

        clearInterface(good[i]);
        good[i].interface = createInterface(good[i]);
        updateInterface(good[i]);
    }

    for(var i = 0; i < bad.length; i++) {
        bad[i].sprite.x = innerWidth * (i+1)/(bad.length+1);
        bad[i].sprite.y = 180;
    }
    loot.gold = 0;
    loot.xp = 0;
    loot.items = [];
    partyActions = [];
    partyActionsI = [];
    activePartyI = -1;
    nelsVenegance = false;
    twinAbility = 0;
    nextPlayer();
}
function updateIcon() {
    icon.visible = true;
    icon.x = playerMenu.choices[playerMenu.i].x - playerMenu.choices[playerMenu.i].width * (playerMenu.choices[playerMenu.i].anchor.x) - 30;
    icon.y = playerMenu.choices[playerMenu.i].y;
}
function gameLoop(delta) {
    state(delta)
}
function disableUserInput(input) {
    if(typeof keyMappings[input] === "string") {
        keys[keyMappings[input]] = false;
    } else {
        keyMappings[input].forEach(function(e) {
            keys[e] = false;
        });
    }
}
function makeTxt(dmg, target) {

    var dmgTxt = new PIXI.Text(dmg);
    dmgTxt.anchor.set(0.5,1)
    ui.addChild(dmgTxt);
    dmgTxt.x = target.x;
    dmgTxt.y = target.y - target.width/2;
    animations.push({
        sprite: dmgTxt,
        type: "transform",
        props: ["y"],
        min: [dmgTxt.y],
        max: [dmgTxt.y - 25],
        direction: "one",
        speed: 20,
        destruct: 1,
        mode: 1,
        cb: function() {
            animations.push({
                sprite: dmgTxt,
                type: "transform",
                props: ["alpha"],
                min: [1],
                max: [0],
                direction: "one",
                speed: 40,
                destruct: 1,
                mode: 1,
                cb: function() {
                    ui.removeChild(dmgTxt);
                },
                i: 0,
            });
        },
        i: 0,
    });
}
function attack(atk, attacker, defender, fixedDMG) {
    var def = defender.def;
    var dmg = fixedDMG || Math.round(constrain(1, (atk * 1.5 - def) * battleRandom, 9999));
    defender.hp -= dmg;
    makeTxt(dmg, defender.sprite);
    if(defender.hp <= 0) {
        defender.hp = 0;
        if(activeParty.includes(defender)) {
            halfFade(defender.sprite);
            console.log("Grace");
        } else {
            deathFade(defender.sprite);
        }
    }
    updateInterface(defender);
    updateBattleRandom();
    return dmg;
}
function setFrameout(func, time) {
    time = time || 1;
    frameOuts.push({func,time,callTime:globalFrameCount});
}
function handleFrameouts(frame) {
    var i;
    var len = frameOuts.length;
    for(i = 0; i < len; i++) {
        var cur = frameOuts[i];
        if(cur.callTime + cur.time <= globalFrameCount) {
            cur.func();
            frameOuts.splice(i,1);
            --i;
            --len;
        }
    }
}
function play() {
    playAnimations(animations);
    handleFrameouts(++globalFrameCount);
    handleEmitters(particleEmitters)
    handleParticles(particles);
    var userInput = readKeyMappings(keyMappings, keys);
    if(gameState === "actions") {
        if(playerMenu.state === "basic") {
            if(userInput.up) {
                disableUserInput("up");
                if(--playerMenu.i < 0) {
                    playerMenu.i = playerMenu.choices.length-1;
                }
                updateIcon();
            } else if(userInput.down) {
                disableUserInput("down");
                if(++playerMenu.i > playerMenu.choices.length-1) {
                    playerMenu.i = 0;
                }
                updateIcon();
            } else if(userInput.confirm) {
                disableUserInput("confirm");
                if(playerMenu.targets[playerMenu.i] === "Fight") {
                    playerMenu.choices = getSprites(enemyParty.concat(activeParty));
                    playerMenu.targets = enemyParty.concat(activeParty);
                    playerMenu.state = "target";
                    playerMenu.action = "fight";
                    updateIcon();
                } else if(playerMenu.char[playerMenu.targets[playerMenu.i]]) {
                    /// Special Ability
                    clearPlayerMenu();
                    loadAbilityMenu(playerMenu.char[playerMenu.targets[playerMenu.i]], playerMenu.char);
                    playerMenu.state = "complex";
                } else if(playerMenu.targets[playerMenu.i] === "Swap" && activeParty.length < totalParty.length) {
                    clearPlayerMenu();
                    loadSwapMenu();
                    playerMenu.state = "complex";
                } else if(playerMenu.targets[playerMenu.i] === "Item" && !noPartyItems()) {
                    clearPlayerMenu();
                    loadItemMenu();
                    playerMenu.state = "complex";
                }
            } else if(userInput.back) {
                animRetreat(playerMenu.char.sprite);
                nextPlayer();
            }
        } else if(playerMenu.state === "complex") {
            if(userInput.up) {
                disableUserInput("up");
                if(--playerMenu.i < 0) {
                    playerMenu.i = playerMenu.choices.length-1;
                }
                updateIcon();
            } else if(userInput.down) {
                disableUserInput("down");
                if(++playerMenu.i > playerMenu.choices.length-1) {
                    playerMenu.i = 0;
                }
                updateIcon();
            } else if(userInput.confirm) {
                disableUserInput("confirm");
                if(playerMenu.targets[playerMenu.i].sprite) {
                    /// If our target is a character it should have a sprite, right?
                    gameState = "anim";
                    animRetreat(playerMenu.char.sprite, function(){
                        deathFade(playerMenu.char.sprite, function() {
                            foreground.removeChild(playerMenu.char.sprite);
                            clearInterface(playerMenu.char);
                            playerMenu.targets[playerMenu.i].sprite.x = playerMenu.char.sprite.x;
                            playerMenu.targets[playerMenu.i].sprite.y = playerMenu.char.sprite.y;
                            playerMenu.targets[playerMenu.i].sprite.visible = true;
                            swapInFade(playerMenu.targets[playerMenu.i].sprite, function() {
                                playerMenu.targets[playerMenu.i].interface = createInterface(playerMenu.targets[playerMenu.i]);
                                updateInterface(playerMenu.targets[playerMenu.i]);
                                activeParty.splice(activePartyI,1,playerMenu.targets[playerMenu.i]);
                                gameState = "actions";
                                nextPlayer();
                            });
                        });
                    });
                } else if(playerMenu.targets[playerMenu.i].tint){ 
                    var curItem = playerMenu.targets[playerMenu.i];
                    curSpecialName = playerMenu.names[playerMenu.i];
                    if(curItem.target === "all") {
                        playerMenu.choices = [getSprites(activeParty), getSprites(enemyParty)];
                        playerMenu.targets = [activeParty, enemyParty];
                        playerMenu.state = "target-all";
                        playerMenu.action = "item";
                        playerMenu.i = 0;
                        playerMenu.item = curItem;
                        loadMultiIcons(playerMenu.choices[0]);
                    } else if(curItem.target === "one") {
                        playerMenu.choices = getSprites(activeParty.concat(enemyParty));
                        playerMenu.targets = activeParty.concat(enemyParty);
                        playerMenu.state = "target";
                        playerMenu.action = "item";
                        playerMenu.i = 0;
                        playerMenu.item = curItem;
                        updateIcon();
                    }
                } else {
                    var curAbility = playerMenu.targets[playerMenu.i];
                    var twinCheck = true;
                    if(playerMenu.char.myTwin) {
                        if(playerMenu.char.myTwin.pp < curAbility.pp) {
                            twinCheck = false;
                        }
                    }
                    curSpecialName = playerMenu.names[playerMenu.i];
                    if(playerMenu.char.pp >= curAbility.pp && twinCheck) {
                        if(curAbility.target === "all") {
                            playerMenu.choices = [getSprites(enemyParty), getSprites(activeParty)];
                            playerMenu.targets = [enemyParty, activeParty];
                            playerMenu.state = "target-all";
                            playerMenu.action = "special";
                            playerMenu.i = 0;
                            playerMenu.ability = curAbility;
                            loadMultiIcons(playerMenu.choices[0]);
                        } else if(curAbility.target === "one") {
                            if(curAbility.allied) {
                                playerMenu.choices = getSprites(activeParty.concat(enemyParty));
                                playerMenu.targets = activeParty.concat(enemyParty);
                            } else {
                                playerMenu.choices = getSprites(enemyParty.concat(activeParty));
                                playerMenu.targets = enemyParty.concat(activeParty);
                            }
                            playerMenu.state = "target";
                            playerMenu.action = "special";
                            playerMenu.i = 0;
                            playerMenu.ability = curAbility;
                            updateIcon();
                        } else if(curAbility.target === "none") {
                            partyActions.push({
                                char: playerMenu.char,
                                targets: [playerMenu.char],
                                action: "special",
                                name: curSpecialName,
                                ability: curAbility,
                            });
                            animRetreat(playerMenu.char.sprite);
                            nextPlayer();
                        }
                    }
                }
            } else if(userInput.back) {
                disableUserInput("back");
                clearPlayerMenu();
                loadPlayerMenu(playerMenu.char);
                playerMenu.state = "basic";
            }
        } else if(playerMenu.state === "target") {
            if(userInput.up) {
                disableUserInput("up");
                if(--playerMenu.i < 0) {
                    playerMenu.i = playerMenu.choices.length-1;
                }
                updateIcon();
            } else if(userInput.down) {
                disableUserInput("down");
                if(++playerMenu.i > playerMenu.choices.length-1) {
                    playerMenu.i = 0;
                }
                updateIcon();
            } else if(userInput.confirm) {
                disableUserInput("confirm");
                if(playerMenu.action === "fight") {
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        action: "fight"
                    });
                } else if(playerMenu.action === "special") {
                    /// TODO
                    if(playerMenu.char.Twin) {
                        twinAbility = 1;
                    }
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        name: curSpecialName,
                        action: "special",
                        ability: playerMenu.ability
                    });
                } else if(playerMenu.action === "item") {
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        name: curSpecialName,
                        action: "item",
                        ability: playerMenu.item
                    });
                }
                animRetreat(playerMenu.char.sprite);
                nextPlayer();
            } else if(userInput.back) {
                disableUserInput("back");
                clearPlayerMenu();
                loadPlayerMenu(playerMenu.char);
                playerMenu.state = "basic";
            }
        } else if(playerMenu.state === "target-all") {
            if(userInput.up) {
                disableUserInput("up");
                if(--playerMenu.i < 0) {
                    playerMenu.i = playerMenu.choices.length-1;
                }
                loadMultiIcons(playerMenu.choices[playerMenu.i]);
            } else if(userInput.down) {
                disableUserInput("down");
                if(++playerMenu.i > playerMenu.choices.length-1) {
                    playerMenu.i = 0;
                }
                loadMultiIcons(playerMenu.choices[playerMenu.i]);
            } else if(userInput.confirm) {
                disableUserInput("confirm");
                if(playerMenu.action === "fight") {
                    alert("ERROR: Trying to fight with multi-targeting is currently unsupported");
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        action: "fight"
                    });
                } else if(playerMenu.action === "special") {
                    if(playerMenu.char.Twin) {
                        twinAbility = 1;
                    }
                    partyActions.push({
                        char: playerMenu.char,
                        targets: playerMenu.targets[playerMenu.i],
                        name: curSpecialName,
                        action: "special",
                        ability: playerMenu.ability
                    });
                } else if(playerMenu.action === "item") {
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        name: curSpecialName,
                        action: "item",
                        ability: playerMenu.item
                    });
                }
                animRetreat(playerMenu.char.sprite);
                nextPlayer();
            } else if(userInput.back) {
                disableUserInput("back");
                clearPlayerMenu();
                loadPlayerMenu(playerMenu.char);
                iconContainer.visible = false;
                playerMenu.state = "basic";
            }
        }
    } else if(gameState === "action") {
        updatePartyInterface(activeParty);
        if(checkEnemyParty()) {
            dialogues = [];
            dialogues.push("You were victorious!");
            dialogues.push("Gained " + loot.gold + " gold");
            partyGold += loot.gold;
            dialogues.push("Gained " + loot.xp + " xp");
            activeParty.forEach(function(char) {
                if(char.hp <= 0) {
                    return;
                }
                char.xp += loot.xp;
                while(levelUpReq(char.level) < char.xp) {
                    char.level++;
                    dialogues.push(char.name + " reached level " + char.level);
                    var skillLearned = findNewSkillLearned(levelUpStats[char.name].ability, char.level);
                    if(skillLearned) {
                        dialogues.push(char.name + " learned " + skillLearned);
                    }
                    var curStatBonus = levelUpStats[char.name];
                    char.atk += curStatBonus.atk;
                    char.def += curStatBonus.def;
                    char.maxHP += curStatBonus.maxHP;
                    char.hp += curStatBonus.maxHP;
                    char.maxPP += curStatBonus.maxPP;
                    char.pp += curStatBonus.maxPP;
                    char.agl += curStatBonus.agl;
                    char.evd += curStatBonus.evd;
                }
            });

            statuses.forEach(function(stat){
                removeBuff(stat);
            });
            statuses = [];
            loot.items.forEach(function(e) {
                dialogues.push("Found " + e);
                addPartyItem(e);
            });
            dialogueTxt.visible = true;
            gameState = "anim";
            setFrameout(function() {
                gameState = "end";
            }, 60);
            return;
        }

        if(partyActionsI === partyActions.length) {
            resetRound();
            return;
        }
        do {
            var curAction = partyActions[partyActionsI];
            partyActionsI++;
        } while(curAction.char.hp <= 0 && partyActionsI < partyActions.length);
        if(curAction.char.hp <= 0) {
            resetRound();
            return;
        }
        if(curAction.action === "fight") {
            if(curAction.targets[0].hp <= 0) {
                if(activeParty.includes(curAction.char)) {
                    curAction.targets = chooseRandomEnemy(enemyParty);
                } else {
                    curAction.targets = chooseRandomEnemy(activeParty);
                }
            }
            runFight(curAction);
        } else if (curAction.action === "special") {
            /// TODO: If the character ran out of PP we need to check again.
            if(curAction.char.pp < curAction.ability.pp) {
                if(activeParty.includes(curAction.char)) {
                    runFight({
                        char: curAction.char,
                        targets: chooseRandomEnemy(enemyParty),
                        action: "fight",
                    });
                } else {
                    runFight({
                        char: curAction.char,
                        targets: chooseRandomEnemy(activeParty),
                        action: "fight",
                    });
                }
            } else {
                if(curAction.targets.length === 1) {
                    if(curAction.targets[0].hp <= 0 && !curAction.ability.healing) {
                        if(activeParty.includes(curAction.char)) {
                            curAction.targets = chooseRandomEnemy(enemyParty);
                        } else {
                            curAction.targets = chooseRandomEnemy(activeParty);
                        }
                    }
                }
                gameState = "anim";
                dialogueTxt.text = curAction.name;
                dialogueTxt.alpha = 0;
                dialogueTxt.visible = true;
                alphaFade(dialogueTxt,0,1,10);
                setFrameout(function(){
                    alphaFade(dialogueTxt,1,0,10, function(){dialogueTxt.text = ""; dialogueTxt.visible = false; dialogueTxt.alpha = 1});                    
                    curAction.char.pp -= curAction.ability.pp;
                    updateInterface(curAction.char);
                    if(curAction.ability.repeater) {
                        runRepeatSpecial(curAction);
                    } else if(curAction.ability.twin) {
                        runTwin(curAction);
                    } else {
                        runSpecial(curAction);
                    }
                },60);
            }
        } else if(curAction.action === "item") {
            gameState = "anim";
            dialogueTxt.text = curAction.name;
            dialogueTxt.alpha = 0;
            dialogueTxt.visible = true;
            alphaFade(dialogueTxt,0,1,10);
            setFrameout(function(){
                alphaFade(dialogueTxt,1,0,10, function(){dialogueTxt.text = ""; dialogueTxt.visible = false; dialogueTxt.alpha = 1});
                if(!curAction.enemyItem) {
                    partyItems[curAction.name]--;
                }
                runItem(curAction);
            },60);
        }
    } else if(gameState === "end") {
        if(userInput.confirm && dialogueTxt.text.length > 7) {
            disableUserInput("confirm");
            dialogueTxt.text = "";
            dialogues.shift();
            if(dialogues.length === 0) {
                fadeOut(20);
                nextScene(20);
                console.log(gameState);
                gameState = "anim";
            }
        } else if(dialogueTxt.text.length !== dialogues[0].length) {
            if(globalFrameCount % 2 === 0) {
                dialogueTxt.text += dialogues[0][dialogueTxt.text.length];
            }
        }
    } else if(gameState === "dialogue") {
        if(userInput.confirm) {
            disableUserInput("confirm");
            gamePlayAgenda[gamePlayStatus].set[++cutSceneI]();
        } else if(curCharTalkText) {
            updateCharTalk();
        }
    }
}
function updateCharTalk() {
    if(dialogueTxt.text.length !== curCharTalkText.length) {
        dialogueTxt.text += curCharTalkText[dialogueTxt.text.length];
        if(curCharTalkText[dialogueTxt.text.length] === " " && dialogueTxt.width + dialogueTxt.x > (innerWidth-150) * ((dialogueTxt.text.match(/\n/g) || []).length+1)) {
            dialogueTxt.text += "\n";

        }
    }
}
function handleEmitters(emitters) {
    var i;
    var len = emitters.length;
    for(i = 0; i < len; i++) {
        if(globalFrameCount % emitters[i].rate === 0) {
            handleE(emitters[i]);
            if(--emitters[i].period <= 0) {
                emitters.splice(i,1);
                --i;
                --len;
            }
        }
    }
}
function handleE(em) {
    for(var i = 0; i < em.count; i++) {
        var vector;
        if(!em.vector) {
            vector = randDir(3);
        } else if(typeof em.vector === "function") {
            vector = em.vector();
        } else {
            vector = em.vector;
        }
        spawnParticle(randInt(em.minX,em.maxX),randInt(em.minY,em.maxY),em.tint,vector);
    }
}
function runItem(action) {
    for(var i = 0; i < action.targets.length; i++) {
        var cur = action.targets[i];
        addEmitter(cur.sprite.x - 100, cur.sprite.x + 100, cur.sprite.y - 150, cur.sprite.y - 100, {x:0, y:3}, action.ability.tint, 2,90);
    }
    setFrameout(function() {
        var keys = Object.keys(action.ability.bonus);
        for(var i = 0; i < action.targets.length; i++) {
            var curChar = action.targets[i];
            for(var i = 0; i < keys.length; i++) {

                var cur = action.ability.bonus[keys[i]];
                if(typeof cur === "function") {
                    cur(curChar);
                } else if(curChar.hp > 0) {
                    if(cur.mult) {
                        curChar[keys[i]] *= cur.mult;
                    } else if(cur.val) {
                        curChar[keys[i]] += cur.val;
                    }
                    if(i === 0) {
                        if(cur.mult) {
                            makeTxt(curChar[keys[i]] / cur.mult, action.targets[i].sprite);
                        } else if(cur.val) {
                            makeTxt(cur.val, action.targets[i].sprite);
                        }
                    }
                } else {
                    makeTxt("Ecclesiastes 9:4", action.targets[i].sprite);
                }
            }
            curChar.hp = constrain(0, curChar.hp, curChar.maxHP);
            curChar.pp = constrain(0, curChar.pp, curChar.maxPP);
        }
        setFrameout(function() {
            gameState = "action";
        }, 30);
    }, 90);
}
function findNewSkillLearned(ability, lvl) {
    var keys = Object.keys(ability);
    for(var i = 0; i<keys.length;i++) {
        if(ability[keys[i]] === lvl) {
            return keys[i];
        }
    }
}
function addEmitter(minX,maxX,minY,maxY,vector,tint,count,period,rate) {
    var emitter = {minX,maxX,minY,maxY,vector,tint,count,period, rate: rate || 1}
    particleEmitters.push(emitter);
    return emitter
}
function nextScene(timeOut) {
    setFrameout(function() {
                    
        if(gamePlayAgenda[gamePlayStatus].encounters-- <= 0) {
            gamePlayStatus++;
        }
        if(gamePlayAgenda[gamePlayStatus].dialogue) {
            cutSceneI = 0;
            gameState = "anim";
            gamePlayAgenda[gamePlayStatus].set[cutSceneI]();
            activeParty.forEach(function(e) {
                foreground.removeChild(e.sprite);
                if(!e.interface) {
                    return;
                }
                var keys = Object.keys(e.interface);
                keys.forEach(function(key){
                    ui.removeChild(e.interface[key]);
                });
            });
        } else {
            enemyParty = generateEnemyParty(gamePlayAgenda[gamePlayStatus].set);
            setForBattle(activeParty, enemyParty);
            gameState = "actions";
        }
    }, timeOut);
}
function updateInterface(char) {
    if(!char.interface) {
        return;
    }
    char.interface.hpBar.width = 200 * (char.hp / char.maxHP);
    char.interface.ppBar.width = 200 * (char.pp / char.maxPP);
    char.interface.hpText.text = char.hp;
    char.interface.ppText.text = char.pp;
}
function fadeOut(duration) {
    var fade = new PIXI.Graphics();
    fade.x = -10;
    fade.y = -10;
    fade.beginFill(0xFFFFFF);
    fade.drawRect(0,0,innerWidth + 100, innerHeight + 100);
    ui.addChild(fade);
    fade.alpha = 0;
    animations.push({
        sprite: fade,
        type: "transform",
        props: ["alpha"],
        min: [0],
        max: [1],
        direction: "both",
        speed: duration,
        destruct: 1,
        cb: function() {
            ui.removeChild(fade);
        },
        mode: 1,
        i: 0,
    });
}
function charTalk(name, txt) {
    name = name.toLowerCase();
    ui.removeChild(charTalkBox)
    ui.addChild(charTalkBox)
    var head = new Sprite(resources["sprites/heads/" + name + ".png"].texture);
    head.x = 10;
    head.y = 10;
    charTalkHead = head;
    ui.addChild(head);
    ui.removeChild(dialogueTxt);
    ui.addChild(dialogueTxt);
    dialogueTxt.x = 200;
    dialogueTxt.anchor.set(0,0.5);
    dialogueTxt.y = 100;
    dialogueTxt.text = "";
    curCharTalkText = txt;
};
function clearCharTalk() {
    ui.removeChild(charTalkBox);
    ui.removeChild(charTalkHead);
    dialogueTxt.anchor.set(0.5,0.5);
    dialogueTxt.x = innerWidth/2;
    dialogueTxt.y = 25;
    dialogueTxt.text = "";
    curCharTalkText = "";
    charTalkHead = false;
}
var curCharTalkText = "";
var charTalkHead;
function levelUpReq(level) {
    return level ** 1.75 * 10;
}
function chooseRandomEnemy(players) {
    var living = [];
    for(var i = 0; i < players.length; i++) {
        if(players[i].hp > 0) {
            living.push(players[i]);
        }
    }
    return [living[randInt(0,living.length-1)]]
}
function runSpecial(curAction) {
    curAction.ability.charAnim(curAction.char.sprite, curAction.targets);
    gameState = "anim";
    if(!curAction.targets.length) {
        curAction.targets = [curAction.targets];
    }
    for(var i = 0; i < curAction.targets.length; i++) {
        if(curAction.ability.targetAnim) {
            curAction.ability.targetAnim(curAction.targets[i].sprite);
        }
    }
    setFrameout(function() {
        for(var i = 0; i < curAction.targets.length; i++) {
            if(typeof curAction.ability.dmgMult === "function") {
                curAction.ability.dmgMult(curAction.targets[i]);
            } else {
                attack(curAction.char.atk * curAction.ability.dmgMult, curAction.char, curAction.targets[i]);
            }
        }
        setFrameout(function() {
            gameState = "action";
            curAction.targets
        }, 60);
    }, curAction.ability.animLen);
}
function updatePartyInterface(party) {
    party = party || activeParty;
    party.forEach(function(char) {
        updateInterface(char);
    })
}
function runTwin(curAction) {
    curAction.ability.charAnim(curAction.char.sprite, curAction.targets);
    curAction.char.myTwin.Twin[curAction.ability.name].charAnim(curAction.char.myTwin.sprite, curAction.targets);
    curAction.char.myTwin.pp -= curAction.ability.pp;
    updateInterface(curAction.char.myTwin);
    gameState = "anim";
    if(!curAction.targets.length) {
        curAction.targets = [curAction.targets];
    }
    for(var i = 0; i < curAction.targets.length; i++) {
        if(curAction.ability.targetAnim) {
            curAction.ability.targetAnim(curAction.targets[i].sprite);
        }
    }
    setFrameout(function() {
        for(var i = 0; i < curAction.targets.length; i++) {
            if(typeof curAction.ability.dmgMult === "function") {
                curAction.ability.dmgMult(curAction.targets[i]);
            } else {
                attack(curAction.char.atk * curAction.ability.dmgMult + curAction.char.myTwin.atk + curAction.ability.dmgMult, curAction.char, curAction.targets[i]);
            }
        }
        setFrameout(function() {
            gameState = "action";
        }, 60);
    }, curAction.ability.animLen);
}
function runRepeatSpecial(curAction) {
    gameState = "anim";
    var targets = [];
    for(var i = 0; i < curAction.ability.repeater; i++) {
        setFrameout(function() {
            var curTargets = chooseRandomEnemy(curAction.targets);
            if(curTargets[0]) {

            } else {
                return;
            }
            curAction.ability.charAnim(curAction.char.sprite, curTargets);
            curAction.ability.targetAnim(curTargets[0].sprite);
    
            setFrameout(function() {
                for(var i = 0; i < curTargets.length; i++) {
                    if(typeof curAction.ability.dmgMult === "function") {
                        curAction.ability.dmgMult(curTargets[i]);
                    } else {
                        attack(curAction.char.atk * curAction.ability.dmgMult, curAction.char, curTargets[i]);
                    }
                }
            }, 30);
        }, curAction.ability.animLen * i);
    }
    setFrameout(function() {
        gameState = "action";
    }, curAction.ability.animLen * curAction.ability.repeater + 60);
}
function runFight(curAction) {
    var target = normalize(curAction.char.sprite.x - curAction.targets[0].sprite.x, curAction.char.sprite.y - curAction.targets[0].sprite.y, -30);
    target.x += curAction.char.sprite.x;
    target.y += curAction.char.sprite.y;
    if(curAction.targets[0].name === "Nels" && nelsVenegance) {
        nelsVenegance = false;
        partyActions.splice(partyActionsI, 0, {
            char: curAction.targets[0],
            targets: [curAction.char],
            action: "special",
            name: "Venegance",
            ability: {
                pp: 0,
                dmgMult: 3,
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {

                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [target[0].sprite.x, target[0].sprite.y],
                        direction: "both",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            for(var i = 0; i < 10; i++) {
                                spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0xEE402E, direction(randNum(0,Math.PI*2),3), 0);
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                    setFrameout(function() {
                        animations.push({
                            sprite: target,
                            type: "transform",
                            props: [],
                            min: [0],
                            max: [Math.PI*4],
                            direction: "one",
                            speed: 40,
                            mode: 1,
                            destruct: 1,
                            i: 0,
                        });
                    },20);
                }
            },
        });
    }
    animations.push({
        sprite: curAction.char.sprite,
        type: "transform",
        props: ["x","y"],
        min: [curAction.char.sprite.x,curAction.char.sprite.y],
        max: [target.x,target.y],
        direction: "both",
        speed: 20,
        destruct: 1,
        mode: 1,
        cb: function() {
            attack(curAction.char.atk, curAction.char, curAction.targets[0]);
            gameState = "action";
        },
        i: 0,
    });
    gameState = "anim";
}
function loadMultiIcons(choices) {
    icon.visible = false;
    iconContainer.visible = true;
    while(iconContainer.children[0]) {
        iconContainer.children[0].anim.dead = true;
        iconContainer.removeChild(iconContainer.children[0]);
    }
    for(var i = 0; i < choices.length; i++) {
        var eye = new Sprite(resources["sprites/eye.png"].texture);
        eye.x = choices[i].x - choices[i].width/2 - 60;
        eye.y = choices[i].y;
        eye.anchor.set(0.5,0.5);
        eye.anim = {
            sprite: eye.scale,
            type: "transform",
            props: ["x","y"],
            min: [1,1],
            max: [1.25,1.25],
            direction: "both",
            speed: 20,
            mode: 1,
            i: 0,
        }
        animations.push(eye.anim);
        iconContainer.addChild(eye);
    }
}
function resetRound() {
    gameState = "actions";
    partyActions = [];
    handleStatus();
    nelsVenegance = false;
    twinAbility = 0;
    partyActionsI = 0;
    activePartyI = -1;
    nextPlayer();
}
function handleStatus() {
    for(var i = 0; i < statuses.length; i++) {
        var stat = statuses[i];
        if(--stat.time <= 0 || stat.char.hp <= 0) {
            removeBuff(stat);
            statuses.splice(i,1);
            --i;
        } else if(stat.bonus.hp) {
            var dmg = Math.round(stat.bonus.hp.val*battleRandom);
            if(stat.bonus.hp.val > 0) {
                var tint = 0x398712;
            } else {
                var tint = 0xD92662;
            }
            spawnRandomParticles(stat.char.sprite.x, stat.char.sprite.y, tint, 50);
            attack(0, {}, stat.char, dmg);
            makeTxt(dmg,stat.char);
            updateInterface(stat.char);
        }
    };
}
function spawnRandomParticles(x,y,tint,count) {
    count = count || 100;
    for(var j = 0; j < count; j++) {
        spawnParticle(x + randInt(-50,50), y + randInt(-50,50), tint, randDir(1));
    }
}
function removeBuff(stat) {
    stat.emitter.period = 0;
    var keys = Object.keys(stat.bonus);
    for(var i = 0; i < keys.length; i++) {
        var cur = stat.bonus[keys[i]];
        if(cur.mult) {
            stat.char[keys[i]] /= cur.mult;
        } else if(cur.val) {
            stat.char[keys[i]] -= cur.val;
        }
    }
    spawnRandomParticles(stat.char.sprite.x, stat.char.sprite.y, 0x01AAFF, 25);
}
function checkEnemyParty() {
    var i;
    var len = enemyParty.length;
    for(i = 0; i < len; i++) {
        var cur = enemyParty[i];
        if(cur.hp <= 0) {
            loot.gold += monsterpedia[cur.name].gold;
            loot.xp += monsterpedia[cur.name].xp;
            if(cur.items) {
                loot.items = loot.items.concat(cur.items);
            }

            enemyParty.splice(i,1);
            --i;
            --len;
        }
    }
    if(enemyParty.length === 0) {
        return true;
    }
}
function normalize(x,y,speed) {
    var len = Math.sqrt(x**2 + y**2)
    if(len === 0) {
        return {x:0, y:0};
    }
    return {x: x/len*speed, y: y/len*speed};
}
function playAnimations(anims) {
    var i;
    var len = anims.length;
    for(i = 0; i < len; i++) {
        var anim = anims[i];
        if(!anim.mode) {
            anim.mode = 1;
        }
        if(anim.dead) {
            /// Simple way to kill an animation if the sprite is no longer needed
            anims.splice(i--,1);
            --len;
            return;
        }
        if(anim.type === "transform") {
            if(anim.play) {
                anim.play(anim);
            }
            anim.props.forEach(function(prop,i) {
                anim.sprite[prop] = anim.min[i] + ((anim.i % anim.speed)/(anim.speed-1)) * (anim.max[i] - anim.min[i]);
            });
            if(anim.direction === "both") {
                if(anim.i + 1 === anim.speed) {
                    anim.mode = -1;
                } else if(anim.i - 1 === -1) {
                    anim.mode = 1;
                    if(anim.destruct && anim.ran) {
                        --anim.destruct;
                        if(anim.destruct === 0) {
                            if(anim.cb) {
                                anim.cb();
                            }
                            anims.splice(i--,1);
                            --len;
                        }
                    }
                }
            } else if(anim.i === anim.speed-1 && anim.destruct && anim.ran) {
                --anim.destruct;
                if(anim.destruct === 0) {
                    if(anim.cb) {
                        anim.cb();
                    }
                    anims.splice(i--,1);
                    --len;
                }
            }
            anim.i += 1 * anim.mode;
            anim.ran = true;
        }
    }
}
function nextPlayer() {
    do {
        activePartyI++;
        if(activePartyI > activeParty.length-1) {
            break;
        }
    } while(activeParty[activePartyI].hp <= 0 || (activeParty[activePartyI].Twin && twinAbility === 1));

    if(activePartyI > activeParty.length-1) {
        gameState = "anim";
        partyActions = partyActions.concat(playEnemies(enemyParty));
        partyActions.sort(function(a,b) {
            var bb = b.char.agl
            var aa = a.char.agl;
            if(b.ability) {
                if(b.ability.actionSpeed) {
                    bb *= b.ability.actionSpeed;
                }
            }
            if(a.ability) {
                if(a.ability.actionSpeed) {
                    aa *= a.ability.actionSpeed;
                }
            }
            return bb - aa;
        });
        partyActionsI = 0;
        clearPlayerMenu();
        icon.visible = false;
        iconContainer.visible = false;
        setFrameout(function() {
            gameState = "action";
        },10);
    } else {
        playerMenu.char = activeParty[activePartyI];
        animAdvance(playerMenu.char.sprite);
        clearPlayerMenu();
        loadPlayerMenu(playerMenu.char);
        iconContainer.visible = false;
        playerMenu.state = "basic";        
    }
}
function playEnemies(party) {
    var i;
    var len = party.length;
    var actions = [];
    for(i = 0; i < len; i++) {
        actions.push(monsterpedia[party[i].name].ai(activeParty, party[i]));
    }
    return actions;
}
function getSprites(arr) {
    var newArr = [];
    for(var i = 0; i < arr.length; i++ ) {
        newArr.push(arr[i].sprite);
    }
    return newArr;
}
function generateEnemyParty(configs) {
    var party = [];
    var curConfig = configs[randInt(0,configs.length-1)];
    for(var i = 0; i < curConfig.length; i++) {
        var curDetails = monsterpedia[curConfig[i]];
        console.log(curDetails,curConfig);
        var monster = {
            name: curConfig[i],
            sprite: new Sprite(resources["sprites/monsters/" + curConfig[i] + ".png"].texture),
            atk: curDetails.atk,
            def: curDetails.def,
            maxHP: curDetails.maxHP,
            hp: curDetails.maxHP,
            maxPP: curDetails.maxPP,
            pp: curDetails.maxPP,
            agl: curDetails.agl,
            evd: curDetails.evd,
            items: []
        }
        if(curDetails.items) {
            curDetails.items.forEach(function(item){
                if(Math.random() < item.r) {
                    monster.items.push(item.n);
                }
            });
        }
        monster.sprite.scale.set(0.75,0.75);
        monster.sprite.anchor.set(0.5,0.5);
        foreground.addChild(monster.sprite);
        party.push(monster);
    }
    return party;
}
function readKeyMappings(mappings, keys) {
    var mappingsActive = {}
    var mapKeys = Object.keys(mappings);
    var i;
    var len = mapKeys.length;
    for(i = 0; i < len; i++) {
        var curKey = mapKeys[i];
        if(typeof mappings[curKey] === "string") {
            mappingsActive[curKey] = keys[mappings[curKey]];
        } else if(typeof mappings[curKey] === "object") {
            var active = false;
            mappings[curKey].forEach(function(e,i) {
                if(keys[e]) {
                    active = true;
                }
            });
            mappingsActive[curKey] = active;
        }
    }
    return mappingsActive;
}
function press(key){
    if(keys[key]){
        keys[key] = false;
        return true;
    }
    return false;
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
function loadArray(array, folder, type){
    /// Loop through the array
    for(let i = 0; i < array.length; i++) {
        /// Make a string that we will change and eventually load with the loader
        let newString = "";
        /// If you give it a folder to load stuff from, so that you don't have to type it all yourself
        if(folder) {
        /// Start with that
            newString += folder;
            if(newString[newString.length - 1] != "/") {
                /// Make sure there's a slash at the end
                newString += "/"
            }
        }
        /// Then add that element
        newString += array[i];
        /// If you want to give it a type and not type that as well
        if(type){
        /// Make sure there's a dot at the end
        if(type[0] != ".") {
            newString += ".";
        }
        /// Add the type
        newString += type;
        }
        /// Load it!
        PIXI.loader.add(newString);
    }
}