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
        atk: 13,
        def: 5,
        maxHP: 10,
        maxPP:  0,
        agl: 2,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 3,
        xp: 3
    },
    "Dark Goblin": {
        atk: 18,
        def: 10,
        maxHP: 13,
        maxPP:  0,
        agl: 5,
        evd: 5,
        ai: targetRandomPlayer,
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
    }
}
var random1 = [["Goblin", "Goblin", "Goblin"], ["Dark Goblin"], ["Goblin", "Goblin"]];
var random2 = [["Dark Goblin", "Dark Goblin", "Dark Goblin"], ["Goblin"], ["Dark Goblin", "Dark Goblin"]];
var curDialogue = {}; /// Serves as a type of window.
var cutSceneI = 0;
/*var log1 = [
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
];*/

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

var log1 = [
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
            log1[1]();
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
        goat.y = -100;
        clearCharTalk();
        curDialogue.goat = goat;
        animations.push({
            sprite: goat,
            type: "transform",
            props: ["y"],
            min: [-100],
            max: [200],
            direction: "one",
            speed: 60,
            destruct: 1,
            mode: 1,
            cb: function() {
                charTalk("goat", "Oh man! What are you guys doing here? You're destroying all my trees!");
                gameState = "dialogue";
            },
            i: 0,
        });
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
var gamePlayStatus = 0;
var gamePlayAgenda = [
    {set: random1, encounters: 0},
    {set: log1, dialogue: true},
    {set: random2, encounters: 1},
    {set: log2, dialogue: true},
    {set: [["Sam", "Flam"]], encounters: 1},
    {set: log3, dialogue: true},
    {set: random2, encounters: 4}
];