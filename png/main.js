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

loader.add("sprites/chars/tong.png").add("sprites/chars/nels.png").add("sprites/monsters/Goblin.png").add("sprites/eye.png").load(setup);
var background = new PIXI.Container();
var foreground = new PIXI.Container();
var ui = new PIXI.Container();
var state;
var keys = {};
var mouseX,mouseY;
var activeParty = [];
var activePartyI = 0;
var activeSetup = [[0.33,0.85], [0.66,0.85]];
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
var dialogues = [];
var dialogueTxt = new PIXI.Text("");
var frameOuts = [];
var globalFrameCount = 0;
var loot = {gold: 0, xp: 0, items: []};
var partyGold = 0;
var partyItems = [];
function setup() {
    updateBattleRandom();
    app.stage.addChild(background);
    app.stage.addChild(foreground);
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
        atk: 105,
        def: 15,
        maxHP: 25,
        hp: 25,
        maxPP: 10,
        pp: 10,
        agl: 5,
        evd: 5,
        lvl: 1,
        xp: 0,
        actions: ["Fight", "Dino", "Swap", "Item"],
        Dino: {
            "Tremor": {
                pp: 3,
                dmgMult: 0.75,
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
            }
        }
    }
    tong.sprite.scale.set(0.75,0.75)
    tong.sprite.anchor.set(0.5,0.5);
    foreground.addChild(tong.sprite);

    var nels = {
        name: "Nels",
        sprite: new Sprite(resources["sprites/chars/nels.png"].texture),
        atk: 10,
        def: 10,
        maxHP: 20,
        hp: 20,
        maxPP: 15,
        pp: 15,
        agl: 15,
        evd: 10,
        actions: ["Fight", "Swordplay", "Swap", "Item"],
        Swordplay: {
            "Finis": {
                pp: 3,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= nels.agl + nels.atk * battleRandom) {
                        target.hp = -1;
                        deathFade(target.sprite);
                        makeTxt("MORTIS", target.sprite);
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                    updateBattleRandom();
                },
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
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                    setFrameout(function() {
                        animations.push({
                            sprite: target,
                            type: "transform",
                            props: ["rotation"],
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
            }
        }
    }
    nels.sprite.scale.set(0.75,0.75)
    nels.sprite.anchor.set(0.5,0.5);
    foreground.addChild(nels.sprite);
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
    activeParty.push(nels);
    enemyParty = generateEnemyParty(random1);
    setForBattle(activeParty, activeSetup, enemyParty);
    gameState = "actions";
    state = play;
    app.ticker.add(delta => gameLoop(delta));
}
function loadPlayerMenu(char) {
    var els = [];
    playerMenu.targets = [];
    char.actions.forEach(function (name, i) {
        playerMenu.targets.push(name);
        var el = new PIXI.Text(name);
        playerMenu.list.addChild(el);
        el.y = 25 + i * 50;
        el.anchor.set(1,0.5);
        el.x = innerWidth - 25;
        els.push(el);
    });
    playerMenu.choices = els;
    playerMenu.char = char;
    playerMenu.state = "basic";
    playerMenu.i = 0;    
    updateIcon();
}
function clearPlayerMenu() {
    for(var i = 0; i <playerMenu.list.children.length; i+=0) {
        var cur = playerMenu.list.children[i]
        playerMenu.list.removeChild(cur);
    }
}
function loadAbilityMenu(ability,charPP) {
    var els = [];
    playerMenu.targets = [];
    var keys = Object.keys(ability);
    keys.forEach(function (name, i) {
        var el = new PIXI.Text(name);
        playerMenu.list.addChild(el);
        el.y = 25 + i * 50;
        el.anchor.set(1,0.5);
        el.x = innerWidth - 190 + el.width;
        els.push(el);
        var pp = new PIXI.Text(ability[name].pp);
        playerMenu.list.addChild(pp);

        pp.y = 25 + i * 50;
        pp.anchor.set(1,0.5);
        pp.x = innerWidth - 25;
        if(ability[name].pp > charPP) {
            el.alpha = 0.5;
            pp.alpha = 0.5;
        }
        playerMenu.targets.push(ability[name]);
    });
    playerMenu.choices = els;
    playerMenu.state = "complex";
    playerMenu.i = 0;
    
    updateIcon();
}
function setForBattle(good, setup, bad) {   
    for(var i = 0; i < setup.length; i++) {
        good[i].sprite.x = innerWidth * setup[i][0];
        good[i].sprite.y = innerHeight * setup[i][1];
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
    nextPlayer();
}
function updateIcon() {
    icon.visible = true;
    icon.x = playerMenu.choices[playerMenu.i].x - playerMenu.choices[playerMenu.i].width/2 - 60;
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
function attack(atk, defender) {
    var dmg = Math.round(constrain(1, atk * 1.5 * battleRandom - defender.def, 9999));
    defender.hp -= dmg;
    makeTxt(dmg, defender.sprite);
    if(defender.hp <= 0) {
        deathFade(defender.sprite);
    }
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
                    loadAbilityMenu(playerMenu.char[playerMenu.targets[playerMenu.i]], playerMenu.char.pp);
                    playerMenu.state = "complex";
                }
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
                var curAbility = playerMenu.targets[playerMenu.i];
                if(playerMenu.char.pp >= curAbility.pp) {
                    if(curAbility.target === "all") {
                        playerMenu.choices = [getSprites(enemyParty), getSprites(activeParty)];
                        playerMenu.targets = [enemyParty, activeParty];
                        playerMenu.state = "target-all";
                        playerMenu.action = "special";
                        playerMenu.i = 0;
                        playerMenu.ability = curAbility;
                        loadMultiIcons(playerMenu.choices[0]);
                    } else {
                        playerMenu.choices = getSprites(enemyParty.concat(activeParty));
                        playerMenu.targets = enemyParty.concat(activeParty);
                        playerMenu.state = "target";
                        playerMenu.action = "special";
                        playerMenu.i = 0;
                        playerMenu.ability = curAbility;
                        updateIcon();
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

                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        action: "special",
                        ability: playerMenu.ability
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
                    console.log("ERROR: Trying to fight with multi-targeting is currently unsupported");
                    partyActions.push({
                        char: playerMenu.char,
                        targets: [playerMenu.targets[playerMenu.i]],
                        action: "fight"
                    });
                } else if(playerMenu.action === "special") {
                    partyActions.push({
                        char: playerMenu.char,
                        targets: playerMenu.targets[playerMenu.i],
                        action: "special",
                        ability: playerMenu.ability
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
        if(checkEnemyParty()) {
            dialogues = [];
            dialogues.push("You were victorious!");
            dialogues.push("Gained " + loot.gold + " gold");
            dialogues.push("Gained " + loot.xp + " xp");
            loot.items.forEach(function(e) {
                dialogues.push("Gained a " + e);
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
        // debugger;

        if(curAction.action === "fight") {
            if(curAction.targets[0].hp <= 0) {
                curAction.targets = chooseRandomEnemy(enemyParty);
            }
            runFight(curAction);
        } else if (curAction.action === "special") {
            /// TODO: If the character ran out of PP we need to check again.
            if(curAction.char.pp < curAction.ability.pp) {
                runFight({
                    char: curAction.char,
                    targets: chooseRandomEnemy(enemyParty),
                    action: "fight",
                })
            } else {
                curAction.char.pp -= curAction.ability.pp;
                if(curAction.targets.length === 1) {
                    if(curAction.targets[0].hp <= 0) {
                        curAction.targets = chooseRandomEnemy(enemyParty);
                    }
                }
                runSpecial(curAction);
            }
        }
    } else if(gameState === "end") {
        if(userInput.confirm && dialogueTxt.text.length > 7) {
            disableUserInput("confirm");
            dialogueTxt.text = "";
            dialogues.shift();
            if(dialogues.length === 0) {
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
                    speed: 20,
                    destruct: 1,
                    cb: function() {
                        ui.removeChild(fade);
                    },
                    mode: 1,
                    i: 0,
                });
                setFrameout(function() {
                    enemyParty = generateEnemyParty(random1);
                    setForBattle(activeParty, activeSetup, enemyParty);
                    gameState = "actions";
                }, 20);
                gameState = "anim";
            }
        } else if(dialogueTxt.text.length !== dialogues[0].length) {
            if(globalFrameCount % 2 === 0) {
                dialogueTxt.text += dialogues[0][dialogueTxt.text.length];
            }
        }
    }
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
    curAction.char.pp -= curAction.ability.pp;
    gameState = "anim";
    if(!curAction.targets.length) {
        curAction.targets = [curAction.targets];
    }
    for(var i = 0; i < curAction.targets.length; i++) {
        curAction.ability.targetAnim(curAction.targets[i].sprite);
    }
    setFrameout(function() {
        for(var i = 0; i < curAction.targets.length; i++) {
            if(typeof curAction.ability.dmgMult === "function") {
                curAction.ability.dmgMult(curAction.targets[i]);
            } else {
                attack(curAction.char.atk * curAction.ability.dmgMult, curAction.targets[i]);
            }
        }
        setFrameout(function() {
            gameState = "action";
        }, 60);
    }, curAction.ability.animLen);
}
function runFight(curAction) {
    var target = normalize(curAction.char.sprite.x - curAction.targets[0].sprite.x, curAction.char.sprite.y - curAction.targets[0].sprite.y, -30);
    target.x += curAction.char.sprite.x;
    target.y += curAction.char.sprite.y;
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
            attack(curAction.char.atk, curAction.targets[0]);
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
    partyActionsI = 0;
    activePartyI = -1;
    nextPlayer();
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
        }
        if(anim.type === "transform") {

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
    } while(activeParty[activePartyI].hp <= 0);

    if(activePartyI > activeParty.length-1) {
        gameState = "anim";
        partyActions = partyActions.concat(playEnemies(enemyParty));
        partyActions.sort(function(a,b) {
            return b.char.agl - a.char.agl;
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
        playerMenu.state === "basic";        
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