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
        items: [{n: "Barbecue Sauce", r: 1}],
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
        gold: 5,
        xp: 5
    },
    "Flam": {
        atk: 13,
        def: 10,
        maxHP: 23,
        maxPP:  0,
        agl: 9,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 10,
        xp: 12
    },
    "Sam": {
        atk: 15,
        def: 11,
        maxHP: 25,
        maxPP:  0,
        agl: 8,
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
        gold: 12,
        xp: 10
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
        gold: 3,
        xp: 3
    },
    "Ice Goblin": {
        atk: 23,
        def: 23,
        maxHP: 23,
        maxPP:  5,
        agl: 15,
        evd: 10,
        ai: function(players, char) {
            var action = targetRandomPlayer(players,char);
            if(Math.random() < 1 && char.pp >= 3) {
                action.action = "special";
                action.name = "Wind Chill";
                action.target = activeParty;
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
        gold: 5,
        xp: 5
    },
}
var random1 = [["Goblin", "Goblin", "Goblin"], ["Dark Goblin"], ["Goblin", "Goblin"]];
var random2 = [["Dark Goblin", "Goblin", "Dark Goblin"], ["Dark Goblin"], ["Dark Goblin", "Dark Goblin"]];
var random3 = [["Bat", "Dark Goblin", "Bat"], ["Goblin", "Dark Goblin", "Goblin"], ["Cobra"], ["Ice Goblin"]];
var random4 = [["Cobra", "Dark Goblin"], ["Bat","Bat","Ice Goblin","Bat","Bat"], ["Goblin", "Ice Goblin", "Dark Goblin"]];
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
        charTalk("nels", "Well, there's always SUPPOSED to be a reason for monsters randomly popping up!");
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
        foreground.removeChild(curDialogue.tong);
        foreground.removeChild(curDialogue.nels);
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
        setFrameout(function() {
            foreground.removeChild(curDialogue.tong);
            foreground.removeChild(curDialogue.nels);
            foreground.removeChild(curDialogue.flam);
            foreground.removeChild(curDialogue.sam);
            foreground.removeChild(curDialogue.goat);
            ++gamePlayStatus;
            fadeOut(20);
            nextScene(20);
            activeParty.forEach(function(e) {
                foreground.addChild(e.sprite);
            });
        }, 20);
    }
];
var gamePlayStatus = 0;
var gamePlayAgenda = [
    {set: random1, encounters: 3},
    {set: log1, dialogue: true},
    {set: random2, encounters: 4},
    {set: log2, dialogue: true},
    {set: [["Sam", "Flam"]], encounters: 1},
    {set: log3, dialogue: true},
    {set: random3, encounters: 4},
    {set: log4, dialogue: true},
    {set: random4, encounters: 4},
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