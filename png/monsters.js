function targetRandomPlayer(players, char) {
    var living = [];
    for(var i = 0; i < players.length; i++) {
        if(players[i].hp > 0) {
            living.push(players[i]);
        }
    }
    return {
        char: char,
        targets: [living[randInt(0,living.length-1)]],
        action: "fight",
    }
}
var monsterpedia = {
    "Goblin": {
        atk: 10,
        def: 5,
        maxHP: 10,
        maxPP:  0,
        agl: 2,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 3,
        xp: 3,
        items: [{n: "Barbecue Sauce", r: 0.25}],
    },
    "Dark Goblin": {
        atk: 10,
        def: 15,
        maxHP: 13,
        maxPP:  5,
        agl: 5,
        evd: 5,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.5 && char.pp >= 3) {
                action.action = "special";
                action.name = "Cutthroat";
                action.ability = createSpecial(3, 1.5);
                /*
                                char: playerMenu.char,
                                targets: [playerMenu.char],
                                action: "special",
                                name: curSpecialName,
                                ability: curAbility,
                                 */   
            }
            return action;
        },
        items: [{n: "Tuna-flavored Mint", r: 0.1},{n: "Paint", r: 0.25}],
        gold: 5,
        xp: 5
    },
    "Flam": {
        atk: 13,
        def: 10,
        maxHP: 23,
        maxPP:  0,
        agl: 15,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 10,
        xp: 12
    },
    "Sam": {
        atk: 15,
        def: 11,
        maxHP: 35,
        maxPP:  0,
        agl: 13,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 12,
        xp: 10
    },
    "Bat": {
        atk: 10,
        def: 13,
        maxHP: 10,
        maxPP:  0,
        agl: 15,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 7,
        xp: 6,
        items: [{n: "Tuna-flavored Mint", r: 0.1}],
    },
    "Cobra": {
        atk: 16,
        def: 15,
        maxHP: 20,
        maxPP:  10,
        agl: 18,
        evd: 5,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.5 && char.pp >= 3) {
                action.action = "special";
                action.name = "Poison";
                action.ability = createSpecial(1, function(target){
                    newStatus("poison", 3, target)
                    attack(13,char,target);
                });
                /*
                                char: playerMenu.char,
                                targets: [playerMenu.char],
                                action: "special",
                                name: curSpecialName,
                                ability: curAbility,
                                 */   
            }
            return action;
        },
        items: [{n: "Paint", r: 0.1}, {n: "Barbecue Sauce", r: 0.1}],
        gold: 10,
        xp: 9,
    },
    "Ice Goblin": {
        atk: 23,
        def: 23,
        maxHP: 23,
        maxPP:  5,
        agl: 20,
        items: [{n: "Mayonnaise", r: 0.25}],
        evd: 10,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.75 && char.pp >= 3) {
                action.action = "special";
                action.name = "Wind Chill";
                action.targets = activeParty;
                action.ability = {
                    pp: 3,
                    dmgMult: 0.75,
                    target: "all",
                    animLen: 160,
                    charAnim: function(char, target) {
                        var track1 = {x: 0, y: innerHeight - 150};
                        var track2 = {x: innerWidth, y: innerHeight - 150};
                        animations.push({
                            sprite: track1,
                            type: "transform",
                            props: ["x"],
                            min: [0],
                            max: [innerWidth],
                            direction: "one",
                            speed: 180,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xB7D9FC, 0x9BCCFD, 0x0F3888, 0x0F3888];
                                for(var i = 0; i < 10; i++) {
                                    // console.log(track1.y,innerHeight)
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(track1.x + randInt(-150,150), track1.y + randInt(-150,150), randTint, randDir(2), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                        animations.push({
                            sprite: track2,
                            type: "transform",
                            props: ["x"],
                            min: [innerWidth],
                            max: [0],
                            direction: "one",
                            speed: 180,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xB7D9FC, 0x9BCCFD, 0x0F3888, 0x0F3888]
                                for(var i = 0; i < 10; i++) {
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(track2.x + randInt(-150,150), track2.y + randInt(-150,150), randTint, randDir(2), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                    },
                    targetAnim: function(target) {
                        setFrameout(function() {
                            animations.push({
                                sprite: target,
                                type: "transform",
                                props: ["x"],
                                min: [target.x],
                                max: [target.x + 25],
                                direction: "both",
                                speed: 5,
                                mode: 1,
                                destruct: 5,
                                i: 0,
                            });
                        },20);
                    }
                };
            }
            return action;
        },
        gold: 25,
        xp: 19
    },
    "River Dragon": {
        atk: 35,
        def: 25,
        maxHP: 350,
        maxPP:  100,
        agl: 30,
        items: [{n: "Pancake", r: 1}],
        evd: 15,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            var rand = Math.random()
            if(rand < 0.25 && char.pp >= 3) {
                action.action = "special";
                action.name = "Deluge";
                action.targets = activeParty;
                action.ability = {
                    pp: 10,
                    dmgMult: 0.75,
                    target: "all",
                    animLen: 160,
                    charAnim: function(char, target) {
                        var track1 = {x: 0, y: innerHeight - 150};
                        var track2 = {x: innerWidth, y: innerHeight - 150};
                        animations.push({
                            sprite: track1,
                            type: "transform",
                            props: ["x"],
                            min: [0],
                            max: [innerWidth],
                            direction: "one",
                            speed: 100,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xB7D9FC, 0x9BCCFD, 0x0F3888, 0x0F3888];
                                for(var i = 0; i < 50; i++) {
                                    // console.log(track1.y,innerHeight)
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(track1.x + randInt(-150,150), track1.y + randInt(-150,150), randTint, randDir(5), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                        animations.push({
                            sprite: track2,
                            type: "transform",
                            props: ["x"],
                            min: [innerWidth],
                            max: [0],
                            direction: "one",
                            speed: 100,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xB7D9FC, 0x9BCCFD, 0x0F3888, 0x0F3888]
                                for(var i = 0; i < 50; i++) {
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(track2.x + randInt(-150,150), track2.y + randInt(-150,150), randTint, randDir(5), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                    },
                    targetAnim: function(target) {
                        setFrameout(function() {
                            animations.push({
                                sprite: target,
                                type: "transform",
                                props: ["x"],
                                min: [target.x],
                                max: [target.x + 25],
                                direction: "both",
                                speed: 5,
                                mode: 1,
                                destruct: 5,
                                i: 0,
                            });
                        },20);
                    }
                };
            } else if(rand < 0.5 && char.pp > 5) {
                action.action = "special";
                action.name = "Kersplat";
                action.ability = createSpecial(5, 1.5);
            } else if(rand < 0.65 && char.pp > 3) {
                
                return {
                    char: char,
                    targets: [char],
                    name: "Pancake",
                    action: "item",
                    ability: {
                        target: "one",
                        enemyItem: true,
                        bonus: {
                            hp: {val: 200}
                        },
                        tint: 0xFECC63
                    }
                };
            }
            return action;
        },
        gold: 120,
        xp: 100
    },
    "Fire Goblin": {
        atk: 20,
        def: 23,
        maxHP: 100,
        maxPP:  15,
        agl: 50,
        items: [{n: "Pancake", r: 0.1}, {n: "Barbecue Sauce", r: 0.5}],
        evd: 10,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.75 && char.pp >= 5) {
                action.action = "special";
                action.name = "Fireballs";
                action.targets = activeParty;
                action.ability = {
                    pp: 5,
                    dmgMult: function(target){
                        attack(23, {}, target, 10);
                    },
                    target: "all",
                    animLen: 160,
                    charAnim: function(char, target) {
                        var track1 = {x: 0, y: innerHeight/2};
                        animations.push({
                            sprite: track1,
                            type: "transform",
                            props: ["y"],
                            min: [innerHeight/2],
                            max: [innerHeight],
                            direction: "one",
                            speed: 180,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xD93526, 0xF06048, 0x1C0D06, 0xD24317];
                                for(var i = 0; i < 100; i++) {
                                    // console.log(track1.y,innerHeight)
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(randInt(0,innerWidth), track1.y + randInt(-15,15), randTint, randDir(2), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                    },
                    targetAnim: function(target) {
                        setFrameout(function() {
                            animations.push({
                                sprite: target,
                                type: "transform",
                                props: ["x"],
                                min: [target.x],
                                max: [target.x + 25],
                                direction: "both",
                                speed: 5,
                                mode: 1,
                                destruct: 5,
                                i: 0,
                            });
                        },20);
                    }
                };
            }
            return action;
        },
        gold: 45,
        xp: 25
    },
    "Purple Dragon": {
        atk: 35,
        def: 25,
        maxHP: 1000,
        maxPP:  100,
        agl: 30,
        items: [{n: "Pancake", r: 1}, {n: "Pancake", r: 1}],
        evd: 15,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            var rand = Math.random()
            if(rand < 0.25 && char.pp >= 3) {
                
                action.action = "special";
                action.name = "Fire Breath";
                action.targets = activeParty;
                action.ability = {
                    pp: 5,
                    dmgMult: function(target){
                        attack(23, {}, target, 13);
                    },
                    target: "all",
                    animLen: 160,
                    charAnim: function(char, target) {
                        var track1 = {x: 0, y: innerHeight/2};
                        animations.push({
                            sprite: track1,
                            type: "transform",
                            props: ["y"],
                            min: [innerHeight/2],
                            max: [innerHeight],
                            direction: "one",
                            speed: 180,
                            mode: 1,
                            destruct: 1,
                            play: function(anim) {
                                var tints = [0xD93526, 0xF06048, 0x1C0D06, 0xD24317];
                                for(var i = 0; i < 100; i++) {
                                    // console.log(track1.y,innerHeight)
                                    var randTint = tints[randInt(0,3)];
                                    spawnParticle(randInt(0,innerWidth), track1.y + randInt(-15,15), randTint, randDir(2), 0).fadeSpeed = 0.025;
                                }
                            },
                            i: 0,
                        });
                    },
                    targetAnim: function(target) {
                        setFrameout(function() {
                            animations.push({
                                sprite: target,
                                type: "transform",
                                props: ["x"],
                                min: [target.x],
                                max: [target.x + 25],
                                direction: "both",
                                speed: 5,
                                mode: 1,
                                destruct: 5,
                                i: 0,
                            });
                        },20);
                    }
                };
            } else if(rand < 0.5 && char.pp > 5) {
                action.action = "special";
                action.name = "Red Claw";
                action.ability = createSpecial(5, 1.5);
            } else if(rand < 0.75 && char.pp > 5) {
                
                return {
                    char: char,
                    targets: [char],
                    name: "Molten Fire",
                    action: "item",
                    ability: {
                        target: "one",
                        enemyItem: true,
                        bonus: {
                            atk: {val: 15}
                        },
                        tint: 0xEE402E
                    }
                };
            }
            return action;
        },
        gold: 220,
        xp: 200
    },
    "Ogre": {
        atk: 60,
        def: 51,
        maxHP: 100,
        maxPP:  0,
        agl: 10,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 62,
        xp: 50
    },
    "Scorpion": {
        atk: 35,
        def: 20,
        maxHP: 30,
        maxPP:  10,
        agl: 18,
        evd: 5,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.5 && char.pp >= 3) {
                action.action = "special";
                action.name = "Tail Edge";
                action.ability = createSpecial(1, function(target){
                    newStatus("venom", 3, target);
                    attack(30,char,target);
                });
                /*
                                char: playerMenu.char,
                                targets: [playerMenu.char],
                                action: "special",
                                name: curSpecialName,
                                ability: curAbility,
                                 */   
            }
            return action;
        },
        items: [{n: "Paint", r: 0.1}, {n: "Barbecue Sauce", r: 0.1}],
        gold: 46,
        xp: 31,
    },
    "Crystal Scorpion": {
        atk: 40,
        def: 40,
        maxHP: 30,
        maxPP:  10,
        agl: 18,
        evd: 5,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 0.2 && char.pp >= 3) {
                action.action = "special";
                action.name = "Crystalline";
                action.ability = createSpecial(3, 3);
                /*
                                char: playerMenu.char,
                                targets: [playerMenu.char],
                                action: "special",
                                name: curSpecialName,
                                ability: curAbility,
                                 */   
            }
            return action;
        },
        items: [{n: "Paint", r: 0.1}, {n: "Barbecue Sauce", r: 0.1}],
        gold: 56,
        xp: 39,
    },
    "Red Bat": {
        atk: 35,
        def: 26,
        maxHP: 20,
        maxPP:  0,
        agl: 30,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 17,
        xp: 12,
        items: [{n: "Tuna-flavored Mint", r: 0.1}],
    },
}
var random1 = [["Goblin", "Goblin", "Goblin"], ["Dark Goblin"], ["Goblin", "Goblin"]];
var random2 = [["Dark Goblin", "Goblin", "Dark Goblin"], ["Dark Goblin"], ["Dark Goblin", "Dark Goblin"]];
var random3 = [["Bat", "Dark Goblin", "Bat"], ["Goblin", "Dark Goblin", "Goblin"], ["Cobra"], ["Ice Goblin"]];
var random4 = [["Cobra", "Dark Goblin"], ["Bat","Bat","Ice Goblin","Bat","Bat"], ["Goblin", "Ice Goblin", "Dark Goblin"]];
var random5 = [["Goblin", "Fire Goblin", "Ice Goblin", "Goblin"], ["Ice Goblin", "Fire Goblin", "Ice Goblin"], ["Ice Goblin", "Fire Goblin", "Dark Goblin"]];
var random6 = [["Ogre"], ["Scorpion", "Crystal Scorpion", "Scorpion"], ["Scorpion", "Scorpion", "Scorpion"], ["Crystal Scorpion"], ["Fire Goblin", "Ice Goblin"], ["Red Bat", "Bat", "Red Bat"],];
var random7 = [["Ogre", "Ogre"], ["Crystal Scorpion", "Scorpion", "Crystal Scorpion"], ["Scorpion", "Scorpion", "Scorpion"], ["Crystal Scorpion", "Fire Goblin"], ["Fire Goblin", "Dark Goblin", "Ice Goblin"], ["Red Bat", "Red Bat", "Red Bat"],];

//["Ice Goblin", "Cobra", "Ice Goblin"],
var curDialogue = {}; /// Serves as a type of window.
var cutSceneI = 0;
var log1 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth - tong.width/2 - 50;
        tong.y = innerHeight/2;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = nels.width/2 + 50;
        nels.y = innerHeight/2;
        console.log(gameState);
        curDialogue.tong = tong;
        curDialogue.nels = nels;
        setFrameout(function() {
            log1[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("tong", "Wow. What in the world are you?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "The insolence! I'm Prince Nels! The greatest swordsbear in the world!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Well, if you're the greatest swordsbear in the world, how'd you get captured by a bunch of goblins like that?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "... I was ambushed. It was a trap. <cough> Never mind about that. We've got more important things to discuss.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Like what?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Like why there's goblins in this forest at all, you moron! This is the king's forest! Why are there goblins here?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "I thought it was because this was an RPG and these were just random encounters.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What?! That's the worst excuse I've ever heard. Monsters don't just show up for no reason!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Well, if I know anything about RPGs, we need to find an old wise man to talk to. Come on, Nels!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Where are we going?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "I'm pretty sure there's a hermit in the woods somewhere around here. Follow me, Nels! I'll protect you from the goblins.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Nels joined your party.");
        gameState = "dialogue";
    },
    function() {
        gameState = "anim";
        clearCharTalk();
        var nels = addCharNels();
        activeParty.push(nels);
        totalParty.push(nels);
        foreground.removeChild(curDialogue.nels);
        foreground.removeChild(curDialogue.tong);
        ++gamePlayStatus;
        fadeOut(20);
        nextScene(20);
        activeParty.forEach(function(e) {
            foreground.addChild(e.sprite);
        });
    }
];
var log2 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.75;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.25;
        nels.y = innerHeight - nels.height/1.9;
        console.log(gameState);
        curDialogue.tong = tong;
        curDialogue.nels = nels;
        setFrameout(function() {
            log2[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("tong", "We should be close to the house by now.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "We'd better be. Why are there so many goblins around? It's like an infestation!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Well, don't worry, Nels. Nothing bad can happen to us now!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Goblins!!!");
        var flam = new Sprite(resources["sprites/heads/flam.png"].texture);
        flam.anchor.set(1,0);
        flam.x = innerWidth - 10;
        flam.y = 10;
        curDialogue.flam = flam;
        ui.addChild(flam);
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        ui.removeChild(curDialogue.flam);
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        sam.anchor.set(0.5,0.5);
        sam.x = curDialogue.nels.x;
        sam.y = -100;
        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        flam.anchor.set(0.5,0.5);
        flam.x = curDialogue.tong.x;
        flam.y = -100;
        foreground.addChild(flam);
        foreground.addChild(sam);
        animations.push({
            sprite: sam,
            type: "transform",
            props: ["y"],
            min: [sam.y],
            max: [curDialogue.nels.y],
            direction: "one",
            speed: 20,
            destruct: 1,
            mode: 1,
            i: 0,
        });
        animations.push({
            sprite: flam,
            type: "transform",
            props: ["y"],
            min: [flam.y],
            max: [curDialogue.tong.y],
            direction: "one",
            speed: 20,
            destruct: 1,
            mode: 1,
            i: 0,
        });
        gameState = "anim";
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(flam);
            foreground.removeChild(sam);
            ++gamePlayStatus;
            fadeOut(20);
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var log3 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.75;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.25;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.75;
        flam.y = flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.25;
        sam.y = sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log3[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("sam", "We got defeated by the goblins!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "We're not goblins! I'm Prince Nels!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", ". . .     Did you say \"Prince\" Nels?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Yes, I said Prince Nels. I'm Prince Nels of Ruggmark Kingdom, and this is...");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Tongarango.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Yes, Guard Tongarango. What are you doing here and why did you jump us?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "We were... um... We were actually just looking for adventure.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", "Yeah, being a dirt farmer is kinda boring.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "So we decided to go save the kingdom from the goblins!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "And then you jumped us.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Yeah, about that...");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Hey! You guys could join our party!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What?!?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yeah! They don't like goblins, and we don't like them!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Bark?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "I'm... not sure if I follow.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Well, I'm sure they could be a great help to us on a mission to save the world!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Save the world?!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "That's pretty much always what we do on RPGs, Nels.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "How are a couple of half-dead dogs going to help us figure fight off the goblins?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Oh, don't worry! In RPGs, whenever someone joins your team they get full health!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Sam joined your party.");
        curDialogue.trueCharSam = addCharSam();
        activeParty.push(curDialogue.trueCharSam);
        totalParty.push(curDialogue.trueCharSam);
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", "Flam joined your party.");
        curDialogue.trueCharFlam = addCharFlam();
        activeParty.push(curDialogue.trueCharFlam);
        totalParty.push(curDialogue.trueCharFlam);
        curDialogue.trueCharFlam.myTwin = curDialogue.trueCharSam;
        curDialogue.trueCharSam.myTwin = curDialogue.trueCharFlam;
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            ++gamePlayStatus;
            fadeOut(20);
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var log4 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.8;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.6;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.4;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.2;
        sam.y = innerHeight-sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log4[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("nels", "Hello! Is anyone home?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", ". . .");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Maybe if I put a rock over the chimney he'll--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "No! Shh! Here he comes.");
        gameState = "dialogue";
    },
    function() {
        var goat = new Sprite(resources["sprites/chars/goat.png"].texture);
        foreground.addChild(goat);
        goat.anchor.set(0.5,0.5);
        goat.x = innerWidth * 0.5;
        goat.y = -200;
        clearCharTalk();
        curDialogue.goat = goat;
        gameState = "anim";
        setFrameout(function() {
            animations.push({
                sprite: goat,
                type: "transform",
                props: ["y"],
                min: [-200],
                max: [400],
                direction: "one",
                speed: 90,
                destruct: 1,
                mode: 1,
                cb: function() {
                    charTalk("goat", "Oh man! What are you guys doing here? You're destroying all my trees!");
                    gameState = "dialogue";
                },
                i: 0,
            });
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Wh-- Tongarango! Don't you have eyes?!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yeah, but going around the trees takes so much work.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Augh.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "So mister, do you have any idea why there's goblins around here?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Goblins?!? Oh man! And you made a giant trail of dead trees leading them right to me! Oh man!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "I thought you said you were a great warrior inside and weren't afraid of a few little goblins.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh yeah, right. <coughs> Well you see, I'm a very poor old hermit. Maybe if you were to pay me something...");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Oh, Nels here has all the money.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "<sighs> Fine. <hands over 20 gold>");
        partyGold -= 20;
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Great. This is working out perfectly, man. <coughs> Well, you see what you gotta do is kill the River Dragon.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "The River Dragon? But I thought that was just a--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "The River Dragon! I thought I killed him! Did another one come back?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("Nels", "Um, Tongarango--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", ". . . I guess you could say that. Anyway, you gotta bring me back the eyes of the River Dragon.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Why do you need the eyes of the River Dragon?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Well, I can use them to make a crystal ball so I can see where the goblins are coming from.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "A crystal ball?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Or a telescope or something! You know! Just go get the eyes of the River Dragon and get out of here!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        setFrameout(function() {
            animations.push({
                sprite: curDialogue.goat,
                type: "transform",
                props: ["y"],
                min: [400],
                max: [-200],
                direction: "one",
                speed: 30,
                destruct: 1,
                mode: 1,
                cb: function() {
                    charTalk("tong", "Well, come on, Nels! We've got a river dragon to slay!");
                    gameState = "dialogue";
                },
                i: 0,
            });
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Doesn't something sound the least bit suspicious--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Come on, Nels! We've got a River Dragon to slay!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Don't tell me it's on the other side of the forest! Augh! More monsters again?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "This is an RPG, Nels. The active party always gets attacked by monsters no one else ever sees.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        fadeOut(20);
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            foreground.removeChild(curDialogue.goat);
            ++gamePlayStatus;
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var log5 = [
    function() {
        activeBackground.texture = resources["sprites/Backgrounds/river.png"].texture;
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.8;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.6;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.4;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.2;
        sam.y = innerHeight-sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log5[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("nels", "Well, here we are, and no River Dragons in sight. I told you it was just your own stupid reflection, Tongarango.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Dragons always like to hide in the most unexpected places, Nels.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Sometimes right under your nose!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        charTalk("nels", "A dragon hiding right under your nose!? That's the most preposterous thing I've ever-- AUGH!");
        var dragon = new Sprite(resources["sprites/monsters/River Dragon.png"].texture);
        foreground.addChild(dragon);
        dragon.anchor.set(0.5,0.5);
        dragon.x = innerWidth * 0.5;
        dragon.scale.set(0,0);
        dragon.y = innerHeight*0.5;
        animations.push({
            sprite: dragon.scale,
            type: "transform",
            props: ["x", "y"],
            min: [0,0],
            max: [1.5,1.5],
            direction: "one",
            speed: 140,
            mode: 1,
            destruct: 1,
            play: updateCharTalk,
            cb: function() {
                clearCharTalk();
                fadeOut(20);
                setFrameout(function() {
                    foreground.removeChild(curDialogue.tong);
                    foreground.removeChild(curDialogue.nels);
                    foreground.removeChild(curDialogue.flam);
                    foreground.removeChild(curDialogue.sam);
                    foreground.removeChild(dragon);
                    ++gamePlayStatus;
                    nextScene(20);
                    activeParty.forEach(function(e) {
                        foreground.addChild(e.sprite);
                    });
                }, 20);
            },
            i: 0,
        });
    },
];
var log6 = [
    function() {
        activeBackground.texture = resources["sprites/Backgrounds/grass.png"].texture;
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.8;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.6;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.4;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.2;
        sam.y = innerHeight-sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log6[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("nels", "Oh, hermit! We've brought back the eyes for the River Dragon!");
        gameState = "dialogue";
    },
    function() {
        var goat = new Sprite(resources["sprites/chars/goat.png"].texture);
        foreground.addChild(goat);
        goat.anchor.set(0.5,0.5);
        goat.x = innerWidth * 0.5;
        goat.y = -200;
        clearCharTalk();
        curDialogue.goat = goat;
        gameState = "anim";
        setFrameout(function() {
            animations.push({
                sprite: goat,
                type: "transform",
                props: ["y"],
                min: [-200],
                max: [400],
                direction: "one",
                speed: 90,
                destruct: 1,
                mode: 1,
                cb: function() {
                    charTalk("goat", "Oh man! You guys came back? How'd you beat the River Dragon?");
                    gameState = "dialogue";
                },
                i: 0,
            });
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("tong", "There's a reason this RPG is named after me, you know.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Will you stop about the RPG? Now, about the goblins...");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh, man! Couldn't you guys have died or something?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "I thought this was nothing but a trick! Prepare to die! Finis--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "No no, wait man! I can help you!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "And how do you propose to do that?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "I think I know how you can figure out where the monsters are coming from.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "How?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "You should go ask the king where the monsters are coming from!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "How brilliant.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Hey! Maybe he could join our party!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What?!? He just tried to kill us!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh, no man. You've got it all wrong! I knew you would defeat the River Dragon and I wanted you to get some experience!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", "He's got a point there, Nels.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "No he does not have a point!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh yeah man, I'd make a great party member. Anything so long as you don't kill me.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "I dunno, Mr. Hermit.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Goat.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yeah, Goat. I think we're only allowed to have four members in our party.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "I guess we could leave Nels behind.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What?! Leave me behind and take a random old hermit?!?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "No no, man. We can use the Swap command. I can stay in the back row, and if someone dies I can take their place!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "How come we could never do this before?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Cause you only had four characters, man! You can't swap someone out for no one!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Great. Come on, guys! Let's go talk to the king!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Wait a minute. If you're joining our party, does that mean we get our gold back?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "No, man.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "That's how it works in RPGs, Nels!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Augh. Let's just go talk to the king.");
        gameState = "dialogue";
        
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Goat joined your party.");
        var goat = addCharGoat();
        activeParty.push(goat);
        totalParty.push(goat);
        gameState = "dialogue";
        
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        fadeOut(20);
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            foreground.removeChild(curDialogue.goat);
            ++gamePlayStatus;
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var log7 = [
    function() {
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth + nels.width/2;
        nels.y = innerHeight *0.5;

        var goat = new Sprite(resources["sprites/chars/goat.png"].texture);
        foreground.addChild(goat);
        goat.anchor.set(0.5,0.5);
        goat.x = innerWidth + goat.width/2;
        goat.y = nels.y + nels.height;

        curDialogue.nels = nels;
        curDialogue.goat = goat;
        setFrameout(function() {
            log7[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        animMove(curDialogue.nels,-400,0,60, function() {
            charTalk("nels", "What on earth! Goblins are destroying the castle!");
            gameState = "dialogue";
            animMove(curDialogue.goat,-300,0,120);
        });
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh, man! I was hoping we weren't actually going to have to do any fighting, man!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "We'll have to sneak down very quietly.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Hey look, a butterfly.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "DON'T!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        fadeOut(20);
        setFrameout(function() {
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.goat);
            ++gamePlayStatus;
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];

var log8 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.8;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.6;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.4;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.2;
        sam.y = innerHeight-sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log8[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        charTalk("nels", "I wonder what all the goblins are doing here?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Maybe they were coming for a barbecue.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "A barbecue?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Something smells like a barbecue.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What smells like a barbecue?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("purple-dragon", "Those eyes are for the Emperor!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        charTalk("sam", "I think we're going to find out pretty fast!");
        var dragon = new Sprite(resources["sprites/monsters/Purple Dragon.png"].texture);
        foreground.addChild(dragon);
        dragon.anchor.set(0.5,0.5);
        dragon.x = innerWidth * 0.5;
        dragon.y = -200;
        animations.push({
            sprite: dragon,
            type: "transform",
            props: ["y"],
            min: [-200],
            max: [innerHeight*0.5],
            direction: "one",
            speed: 140,
            mode: 1,
            destruct: 1,
            play: updateCharTalk,
            cb: function() {
                clearCharTalk();
                fadeOut(20);
                setFrameout(function() {
                    foreground.removeChild(curDialogue.tong);
                    foreground.removeChild(curDialogue.nels);
                    foreground.removeChild(curDialogue.flam);
                    foreground.removeChild(curDialogue.sam);
                    foreground.removeChild(dragon);
                    ++gamePlayStatus;
                    nextScene(20);
                    activeParty.forEach(function(e) {
                        foreground.addChild(e.sprite);
                    });
                }, 20);
            },
            i: 0,
        });
    },
];
var log9 = [
    function() {
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.8;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.6;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.4;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.2;
        sam.y = innerHeight-sam.height/1.9;

        curDialogue.tong = tong;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        setFrameout(function() {
            log9[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        var woof = new Sprite(resources["sprites/chars/woof.png"].texture);
        foreground.addChild(woof);
        woof.anchor.set(0.5,0.5);
        woof.x = innerWidth * 0.5;
        woof.y = -200;
        clearCharTalk();
        curDialogue.woof = woof;
        gameState = "anim";
        setFrameout(function() {
            animations.push({
                sprite: woof,
                type: "transform",
                props: ["y"],
                min: [-200],
                max: [400],
                direction: "one",
                speed: 90,
                destruct: 1,
                mode: 1,
                cb: function() {
                    charTalk("woof", "Thank you, your highness!");
                    gameState = "dialogue";
                },
                i: 0,
            });
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("tong", "You're welcome, your lowliness!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "I was talking to Prince Nels.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Rats.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Chancellor, when we were fighting that dreadful monstrosity, he mentioned getting eyes for the Emperor. Does the enemy need new eyes?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "We are not quite certain at this time, but it is rumored among our spies that the Emperor has constructed an enormous weapon!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "However, it is also rumored that he cannot, as of yet, find a power source large enough to charge it.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "And. . .?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "And we think that Dinosaur eyes are perhaps a sufficient power source!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Oh man! Dinosaur eyes! Of all the luck! Are you sure bear eyes won't work too?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "So if they get Tongarango's eyes, they will destroy us?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "Correct. We also assume that this weapon controls the monsters. That means that if the weapon was destroyed, the monsters would also be killed.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "That means that Tongarango has a bounty on his eyes for the rest of his life.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Rats.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "So the king has commanded Nels to protect Tongarango!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "What! I can't do that! Why, then there would be a bounty on me, too!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "You're the greatest swordsbear of all time, Nels! This should be easy for you!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "You'll have to sleep in the same room as Tongarango to make sure he's safe.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "WHAT?!?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Great! I get the top bunk, Nels! Or maybe we'll have to share...");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "This will never work! I'm going after the Emperor's weapon myself!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("woof", "Nels! You can't possibly do it by yourself!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "I'm not by myself! I have my whole party! Tongarango and Sam and Flam--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Bark bark! ♫ Adventure is a wonderful thing... ♪ ");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "And Goat, of course--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "What?! Oh, man! I thought we were past that now!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yeah, well, I don't think this RPG supports guest characters.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Oh, man! But it's super easy, man! Just do party.splice(4,1)!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Come on, Nels! Let's go destroy a deadly weapon!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", ". . . That sounded easier in my head.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Come on, Sam and Flam!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", " ♬ We're underway and off to see the world! ♬ Bark! Sing it with us, Goat!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "♬ Shoulda took a train... ♬");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        gameState = "anim";
        fadeOut(20);
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            foreground.removeChild(curDialogue.woof);
            ++gamePlayStatus;
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var log10 = [
    function() {
        activeBackground.texture = resources["sprites/Backgrounds/city.png"].texture;
        activeBackground.visible = true;
        var tong = new Sprite(resources["sprites/chars/tong.png"].texture);
        foreground.addChild(tong);
        tong.anchor.set(0.5,0.5);
        tong.x = innerWidth * 0.833;
        tong.y = innerHeight - tong.height/1.9;
        var nels = new Sprite(resources["sprites/chars/nels.png"].texture);
        foreground.addChild(nels);
        nels.anchor.set(0.5,0.5);
        nels.x = innerWidth * 0.666;
        nels.y = innerHeight - nels.height/1.9;

        var flam = new Sprite(resources["sprites/chars/flam.png"].texture);
        foreground.addChild(flam);
        flam.anchor.set(0.5,0.5);
        flam.x = innerWidth * 0.5;
        flam.y = innerHeight-flam.height/1.9;
        var sam = new Sprite(resources["sprites/chars/sam.png"].texture);
        foreground.addChild(sam);
        sam.anchor.set(0.5,0.5);
        sam.x = innerWidth * 0.3333;
        sam.y = innerHeight-sam.height/1.9;
        var goat = new Sprite(resources["sprites/chars/goat.png"].texture);
        foreground.addChild(goat);
        goat.anchor.set(0.5,0.5);
        goat.x = innerWidth * 0.1666;
        goat.y = innerHeight-goat.height/1.9;

        curDialogue.tong = tong;
        curDialogue.goat = goat;
        curDialogue.nels = nels;
        curDialogue.sam = sam;
        curDialogue.flam = flam;
        
        setFrameout(function() {
            log10[1]();
            ++cutSceneI;
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Finally, a town!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "I'm starving. Let's find a bar or something.");
        gameState = "dialogue";
    },
    function() {
        var goblin = new Sprite(resources["sprites/monsters/Dark Goblin.png"].texture);
        foreground.addChild(goblin);
        goblin.anchor.set(0.5,0.5);
        goblin.x = innerWidth * 0.5;
        goblin.y = -200;
        clearCharTalk();
        curDialogue.goblin = goblin;
        gameState = "anim";
        setFrameout(function() {
            animations.push({
                sprite: goblin,
                type: "transform",
                props: ["y"],
                min: [-200],
                max: [400],
                direction: "one",
                speed: 60,
                destruct: 1,
                mode: 1,
                cb: function() {
                    charTalk("goat", "Oh man! A goblin here too??");
                    gameState = "dialogue";
                },
                i: 0,
            });
        },30);
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Fiends!");
        gameState = "dialogue";
    },
    function() {
        gameState = "anim";
        var origX = curDialogue.nels.x;
        var origY = curDialogue.nels.y;
        clearCharTalk();
        animMove(curDialogue.nels, 0, -100, 30, function() {
            animMoveTo(curDialogue.nels,innerWidth*0.5,400, 15, function() {
                deathFade(curDialogue.goblin);
                animMoveTo(curDialogue.nels,origX,origY, 30, function() {
                    clearCharTalk();
                    charTalk("will", "I say, good show, old chaps!");
                    gameState = "dialogue";
                });

            }).direction = "both";
        });
    },
    function() {

        clearCharTalk();
        var will = new Sprite(resources["sprites/chars/will.png"].texture);
        foreground.addChild(will);
        will.anchor.set(0.5,0.5);
        will.x = innerWidth/2;
        will.y = -100;
        curDialogue.will = will;
        gameState = "anim";
        animMoveTo(curDialogue.will,innerWidth/2,innerHeight/2,60, function() {
            charTalk("sam", "Who are you?");
            gameState = "dialogue";
        });
    },
    function() {
        clearCharTalk();
        charTalk("will", "My name is Willoughby. I'm the swordmaster of this town.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Oh, really! What a coincidence. Nels here is the greatest swordsbear in the world!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Shh!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Oh, really! Well, if you would like to spar, I'd be happy for a worthy opponent.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Ha ha ha. . . Um. . . I'm afraid we're much too busy at present.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "No we're not! Fight! Fight! Fight!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", "Bark bark! Fight fight fight!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Shut up! We really can't stay long, you see, we're on a mission to save the world and we just had to stop at an inn before we--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "A mission to save the world! Well, this sounds very interesting indeed.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yeah, there's an evil Emperor who made a secret weapon and he's going to use it to destroy the world.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "I see. . .");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "But before he can do it, he needs dinosaur eyes!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Dinosaur eyes?!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("flam", "So we're going to destroy the weapon before he can destroy us with it!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Well, that seems like quite the story indeed! So all of you are going off together to destroy this secret weapon?");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("goat", "Don't look at me, man. I'm just stuck here because they didn't want any guest characters. Do they sell any burritos at the bar?");
        setFrameout(function() {
            animMoveTo(curDialogue.goat,-curDialogue.goat.width,curDialogue.goat.y,60);
        },90);
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Ah... yes. <ahem> Perhaps I could accompany you on your trip. You might be glad for some assistance.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Well, I don't really know that would work. You see, we can't have too many people in our party so maybe it would be better if--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("tong", "Yes we can, Nels! Remember? The Swap command! We can have as many bonus members as we want!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Well, I don't know if you would be a good fit--");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("sam", "Maybe he should spar Nels to find out whether he would be a good fit! Fight! Fight!");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("nels", "Augh! Nevermind. I guess you can come along. Try to make yourself useful.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Ah. . . um. . . thank you, good sir. We shall set out after a quick rest in the inn.");
        gameState = "dialogue";
    },
    function() {
        clearCharTalk();
        charTalk("will", "Willoughby joined your party.");
        gameState = "dialogue";
    },
    function() {
        activeBackground.texture = resources["sprites/Backgrounds/grass.png"].texture;
        clearCharTalk();
        gameState = "anim";
        fadeOut(20);
        var will = addCharWill();
        activeParty.push(will);
        totalParty.push(will);
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            foreground.removeChild(curDialogue.goat);
            foreground.removeChild(curDialogue.will);
            ++gamePlayStatus;
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];

var gamePlayStatus = 0;
setTimeout(function(){
    if(!activeParty[0]) return;
    activeParty[0].xp = gamePlayStatus * 50;
    invisLevel(activeParty[0]);
}, 100);
var gamePlayAgenda = [
    {set: random1, encounters: 0, bossBattle: true},
    {set: log1, dialogue: true},
    {set: random2, encounters: 4},
    {set: log2, dialogue: true},
    {set: [["Sam", "Flam"]], encounters: 1, bossBattle: true},
    {set: log3, dialogue: true},
    {set: random3, encounters: 6},
    {set: log4, dialogue: true},
    {set: random4, encounters: 6},
    {set: log5, dialogue: true},
    {set: [["River Dragon"]], encounters: 1, bossBattle: true},
    {set: log6, dialogue: true},
    {set: random4, encounters: 3, bossBattle: false},
    {set: log7, dialogue: true},
    {set: random5, encounters: 3, bossBattle: true},
    {set: log8, dialogue: true},
    {set: [["Purple Dragon"]], encounters: 1, bossBattle: true},
    {set: log9, dialogue: true},
    {set: random6, encounters: 8},
    {set: log10, dialogue: true},
    {set: random7, encounters: 4},
];

function createSpecial(pp, dmgMult) {
    return {
        pp: pp,
        dmgMult: dmgMult,
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
                    if(anim.i === anim.speed-1) {
                        for(var i = 0; i < 100; i++) {
                            spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0x111110, randDir(2), 0).fadeSpeed = 0.025;
                        }
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
                    props: ["y"],
                    min: [target.y],
                    max: [target.y + 25],
                    direction: "both",
                    speed: 10,
                    mode: 1,
                    destruct: 4,
                    i: 0,
                });
            },20);
        }
    };
}