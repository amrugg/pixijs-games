function addCharNels() {
    var nels = {
        name: "Nels",
        sprite: new Sprite(resources["sprites/chars/nels.png"].texture),
        atk: 15,
        def: 7,
        maxHP: 20,
        hp: 20,
        maxPP: 15,
        pp: 15,
        agl: 15,
        evd: 10,
        level: 1,
        xp: 23,
        actions: ["Fight", "Swordplay", "Swap", "Item"],
        status: [],
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
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0xEE402E, false, 0);
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
            },
            "Venegance": {
                pp: 3,
                dmgMult: function(target) { 
                    makeTxt("COUNTER", target.sprite);
                    nelsVenegance = true;
                },
                target: "none",
                actionSpeed: 99,
                animLen: 120,
                charAnim: function(char) {
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: [],
                        min: [],
                        max: [],
                        direction: "both",
                        speed: 50,
                        mode: 1,
                        destruct: 1,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0xF2DF0D, false, 10);
                                    part.vector = {x: 0, y: 3};
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                    });
                },
            },
            "Dynamis": {
                pp: 5,
                dmgMult: function(target) { 
                    makeTxt("VALOR", target.sprite);
                    newStatus("valor", 5, target);
                },
                target: "none",
                animLen: 120,
                charAnim: function(char) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0xEE402E, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                    });
                },
            },
            "Shield Breaker": {
                pp: 10,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= nels.agl + nels.atk * 2 * battleRandom) {
                        target.def = 0;
                        attack(nels.atk, nels, target);
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                    updateBattleRandom();
                },
                target: "one",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0xAEB5FB, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
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
                                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0)
                                                part.fadeSpeed = 0.025;
                                            }
                                        }
                                        if(anim.mode === -1) {
                                            for(var i = 0; i < 10; i++) {
                                                spawnParticle(anim.max[0], anim.max[1], 0xEE402E, direction(3,randNum(0,Math.PI*2)), 0).fadeSpeed = 0.01;
                                            }
                                        }
                                        console.log(anim.i,anim.speed);
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
                    animations.push({
                        type: "transform",
                        props: [],
                        min: [],
                        max: [],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            for(var i = 0; i < 5; i++) {
                                var part = spawnParticle(target.x + randInt(-200, 200), target.y + randInt(-200, 200), 0xEE402E, false, 10);
                                part.vector = normalize(target.x - part.x, target.y - part.y, 3);
                                part.fadeSpeed = 0.025;
                            }
                        },
                        i: 0,
                    });
                }
            },
            "Swath": {
                pp: 20,
                dmgMult: 1,
                target: "all",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0x0F3888, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["x", "y"],
                                    min: [char.x, char.y],
                                    max: [innerWidth/2,innerHeight/2],
                                    direction: "both",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    play: function(anim) {
                                        if(anim.i % 2 === 0||true) {
                                            for(var i = 0; i < 5; i++) {
                                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x0F3888, {x:Math.random()-0.5, y:3});
                                                part.fadeSpeed = 0.025;
                                            }
                                        }
                                        if(anim.mode === -1) {
                                            for(var i = 0; i < 100; i++) {
                                                spawnParticle(anim.max[0] + randInt(-100, 100), anim.max[1] + randInt(-100, 100), 0x0E1118, direction(13,randNum(-Math.PI/2.1,Math.PI/2.1)), 0).fadeSpeed = 0.01;
                                            }
                                        }
                                        console.log(anim.i,anim.speed);
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
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
                }
            },
            "Pentimone": {
                pp: 30,
                dmgMult: 1.25,
                target: "all",
                animLen: 40,
                repeater: 5,
                actionSpeed: 0.1,
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
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0xEE402E, false, 0);
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
    invisLevel(nels);
    nels.sprite.scale.set(0.75,0.75)
    nels.sprite.anchor.set(0.5,0.5);
    return nels;
}
function addCharSam() {
    var sam = {
        name: "Sam",
        sprite: new Sprite(resources["sprites/chars/sam.png"].texture),
        atk: 13,
        def: 11,
        maxHP: 25,
        hp: 25,
        maxPP: 15,
        pp: 15,
        agl: 9,
        evd: 9,
        level: 1,
        xp: 50,
        actions: ["Fight", "Twin", "Swap", "Item"],
        status: [],
        Twin: {
            "Bench Press": {
                pp: 3,
                dmgMult: 2,
                twin: true,
                name: "Bench Press",
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [target[0].sprite.x - 200, target[0].sprite.y],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["x", "y"],
                                    min: [char.x, char.y],
                                    max: [origX, origY],
                                    direction: "one",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    
                                    i: 0,
                                });
                            }, 90);
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
                            min: [target.x-50],
                            max: [target.x+50],
                            direction: "both",
                            speed: 10,
                            mode: 1,
                            destruct: 3,
                            i: 4,
                        });
                    },15);
                }
            },
            "Cross Bones": {
                pp: 7,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= (sam.agl + sam.atk + sam.myTwin.agl + sam.myTwin.atk)/1.75 * battleRandom) {
                        target.hp = -1;
                        deathFade(target.sprite);
                        makeTxt("MORTIS", target.sprite);
                    } else {
                        attack(sam.atk + sam.myTwin.atk, sam,  target);
                    }
                    updateBattleRandom();
                },
                twin: true,
                name: "Cross Bones",
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {
                    var bone = new Sprite(resources["sprites/bone.png"].texture);
                    bone.anchor.set(0.5,0.5);
                    foreground.addChild(bone);
                    animations.push({
                        sprite: bone,
                        type: "transform",
                        props: ["x", "y", "rotation"],
                        min: [char.x, char.y, 0],
                        max: [target[0].sprite.x, target[0].sprite.y, Math.PI*8.25],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            setFrameout(function() {
                                deathFade(bone);
                            }, 90);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
            "Ear Jets": {
                pp: 10,
                dmgMult: 1.5,
                twin: true,
                name: "Ear Jets",
                target: "all",
                animLen: 120,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [100, 100],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            animations.push({
                                sprite: char,
                                type: "transform",
                                props: ["x", "y"],
                                min: [char.x, char.y],
                                max: [innerWidth - 100, char.y],
                                direction: "one",
                                speed: 90,
                                mode: 1,
                                play: function(anim) {
                                    for(var i = 0; i < 5; i++) {
                                        var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), Math.random() < 0.5? 0xEE402E : 0xF06048, false, 10);
                                        part.vector = {x: 0, y: 3};
                                        part.fadeSpeed = 0.025;
                                    }
                                },
                                destruct: 1,
                                cb: function() {
                                    animations.push({
                                        sprite: char,
                                        type: "transform",
                                        props: ["x", "y"],
                                        min: [char.x, char.y],
                                        max: [origX, origY],
                                        direction: "one",
                                        speed: 15,
                                        mode: 1,
                                        destruct: 1,
                                        
                                        i: 0,
                                    });
                                },
                                i: 0,
                            });
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
        }
    }
    sam.sprite.scale.set(0.75,0.75)
    sam.sprite.anchor.set(0.5,0.5);
    return sam;
}
function addCharFlam() {
    var flam = {
        name: "Flam",
        sprite: new Sprite(resources["sprites/chars/flam.png"].texture),
        atk: 12,
        def: 10,
        maxHP: 23,
        hp: 23,
        maxPP: 25,
        pp: 25,
        agl: 12,
        evd: 12,
        level: 1,
        xp: 50,
        actions: ["Fight", "Twin", "Swap", "Item"],
        status: [],
        Twin: {
            "Bench Press": {
                pp: 3,
                dmgMult: 2,
                twin: true,
                name: "Bench Press",
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [target[0].sprite.x + 200, target[0].sprite.y],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["x", "y"],
                                    min: [char.x, char.y],
                                    max: [origX, origY],
                                    direction: "one",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    
                                    i: 0,
                                });
                            }, 90);
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
                            min: [target.x-50],
                            max: [target.x+50],
                            direction: "both",
                            speed: 10,
                            mode: 1,
                            destruct: 3,
                            i: 4,
                        });
                    },15);
                }
            },

            "Cross Bones": {
                pp: 7,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= (flam.agl + flam.atk + flam.myTwin.agl + flam.myTwin.atk)/1.75 * battleRandom) {
                        target.hp = -1;
                        deathFade(target.sprite);
                        makeTxt("MORTIS", target.sprite);
                    } else {
                        attack(flam.atk + flam.myTwin.atk, flam,  target);
                    }
                    updateBattleRandom();
                },
                twin: true,
                name: "Cross Bones",
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {
                    var bone = new Sprite(resources["sprites/bone.png"].texture);
                    bone.anchor.set(0.5,0.5);
                    foreground.addChild(bone);
                    animations.push({
                        sprite: bone,
                        type: "transform",
                        props: ["x", "y", "rotation"],
                        min: [char.x, char.y, 0],
                        max: [target[0].sprite.x, target[0].sprite.y, Math.PI*8.75],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            setFrameout(function() {
                                deathFade(bone);
                            }, 90);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
            "Ear Jets": {
                pp: 10,
                dmgMult: 1.5,
                twin: true,
                name: "Ear Jets",
                target: "all",
                animLen: 120,
                charAnim: function(char, target) {
                    var origX = char.x;
                    var origY = char.y;
                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [innerWidth - 100, 100],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        cb: function() {
                            animations.push({
                                sprite: char,
                                type: "transform",
                                props: ["x", "y"],
                                min: [char.x, char.y],
                                max: [100, char.y],
                                direction: "one",
                                speed: 90,
                                mode: 1,
                                play: function(anim) {
                                    for(var i = 0; i < 5; i++) {
                                        var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), Math.random() < 0.5? 0xEE402E : 0xF06048, false, 10);
                                        part.vector = {x: 0, y: 3};
                                        part.fadeSpeed = 0.025;
                                    }
                                },
                                destruct: 1,
                                cb: function() {
                                    animations.push({
                                        sprite: char,
                                        type: "transform",
                                        props: ["x", "y"],
                                        min: [char.x, char.y],
                                        max: [origX, origY],
                                        direction: "one",
                                        speed: 15,
                                        mode: 1,
                                        destruct: 1,
                                        
                                        i: 0,
                                    });
                                },
                                i: 0,
                            });
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
        }
    }
    invisLevel(flam);
    flam.sprite.scale.set(0.75,0.75)
    flam.sprite.anchor.set(0.5,0.5);
    return flam;
}
function addCharTux() {
    var tux = {
        name: "Tux",
        sprite: new Sprite(resources["sprites/chars/tux.png"].texture),
        atk: 13,
        def: 10,
        maxHP: 22,
        hp: 22,
        maxPP: 20,
        pp: 20,
        agl: 13,
        evd: 12,
        level: 1,
        xp: 0,
        actions: ["Fight", "Frost", "Swap", "Item"],
        status: [],
        Frost: {
            "Finis": {
                pp: 3,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= tux.agl + tux.atk * battleRandom) {
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
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0xEE402E, false, 0);
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
    invisLevel(tux);
    tux.sprite.scale.set(0.75,0.75)
    tux.sprite.anchor.set(0.5,0.5);
    return tux;
}
function addCharGoat() {
    var goat = {
        name: "Goat",
        sprite: new Sprite(resources["sprites/chars/goat.png"].texture),
        atk: 13,
        def: 13,
        maxHP: 25,
        hp: 25,
        maxPP: 15,
        pp: 15,
        agl: 13,
        evd: 12,
        level: 1,
        xp: 500,
        actions: ["Fight", "G.O.A.T", "Swap", "Item"],
        status: [],
        "G.O.A.T": {
            "Horn": {
                pp: 7,
                dmgMult: 2,
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
                        destruct: 3,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x3B3B3B, false, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            if(anim.i === anim.speed-1) {
                                spawnRandomParticles(anim.sprite.x,anim.sprite.y,0xB9B9B9, 30);
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },

            "Poison Flauta": {
                pp: 10,
                dmgMult: function(target) {

                    if(target.maxHP + target.def + target.evd <= goat.agl + goat.atk * battleRandom) {

                        attack(goat.atk* 0.09, goat, target);
                        if(target.hp>0) {
                            newStatus("poison", 3, target)
                        }
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                },
                target: "one",
                animLen: 80,
                charAnim: function(char, target) {
                    var flauta = {x: char.x,y:char.y}

                    animations.push({
                        sprite: flauta,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.x, char.y],
                        max: [target[0].sprite.x, target[0].sprite.y],
                        direction: "one",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        play: function(anim) {
                            for(var i = 0; i < 5; i++) {
                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x398712, randDir(1), 0);
                                part.fadeSpeed = 0.025;
                            }
                            if(anim.i === anim.speed-1) {
                                addEmitter(target[0].sprite.x - 100, target[0].sprite.x + 100, target[0].sprite.y - 150, target[0].sprite.y - 100, false, 0x398712, 5, 20);
                            }
                        },
                        i: 0,
                    });
                },
                targetAnim: function(target) {
                }
            },
            "Dynamis": {
                pp: 5,
                dmgMult: function(target) { 
                    makeTxt("VALOR", target.sprite);
                    newStatus("valor", 5, target);
                },
                target: "none",
                animLen: 120,
                charAnim: function(char) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0xEE402E, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                    });
                },
            },
            "Shield Breaker": {
                pp: 10,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= goat.agl + goat.atk * 2 * battleRandom) {
                        target.def = 0;
                        attack(goat.atk, goat, target);
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                    updateBattleRandom();
                },
                target: "one",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0xAEB5FB, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
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
                                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0)
                                                part.fadeSpeed = 0.025;
                                            }
                                        }
                                        if(anim.mode === -1) {
                                            for(var i = 0; i < 10; i++) {
                                                spawnParticle(anim.max[0], anim.max[1], 0xEE402E, direction(3,randNum(0,Math.PI*2)), 0).fadeSpeed = 0.01;
                                            }
                                        }
                                        console.log(anim.i,anim.speed);
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
                    animations.push({
                        type: "transform",
                        props: [],
                        min: [],
                        max: [],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            for(var i = 0; i < 5; i++) {
                                var part = spawnParticle(target.x + randInt(-200, 200), target.y + randInt(-200, 200), 0xEE402E, false, 10);
                                part.vector = normalize(target.x - part.x, target.y - part.y, 3);
                                part.fadeSpeed = 0.025;
                            }
                        },
                        i: 0,
                    });
                }
            },
            "Swath": {
                pp: 20,
                dmgMult: 1,
                target: "all",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0x0F3888, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["x", "y"],
                                    min: [char.x, char.y],
                                    max: [innerWidth/2,innerHeight/2],
                                    direction: "both",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    play: function(anim) {
                                        if(anim.i % 2 === 0||true) {
                                            for(var i = 0; i < 5; i++) {
                                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x0F3888, {x:Math.random()-0.5, y:3});
                                                part.fadeSpeed = 0.025;
                                            }
                                        }
                                        if(anim.mode === -1) {
                                            for(var i = 0; i < 100; i++) {
                                                spawnParticle(anim.max[0] + randInt(-100, 100), anim.max[1] + randInt(-100, 100), 0x0E1118, direction(13,randNum(-Math.PI/2.1,Math.PI/2.1)), 0).fadeSpeed = 0.01;
                                            }
                                        }
                                        console.log(anim.i,anim.speed);
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
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
                }
            },
            "Pentimone": {
                pp: 30,
                dmgMult: 1.25,
                target: "all",
                animLen: 40,
                repeater: 5,
                actionSpeed: 0.1,
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
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    spawnParticle(anim.max[0] + randInt(-150,150), anim.max[1] + randInt(-150,150), 0xEE402E, false, 0);
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
    invisLevel(goat);
    goat.sprite.scale.set(0.75,0.75)
    goat.sprite.anchor.set(0.5,0.5);
    return goat;
}
function addCharWill() {
    var will = {
        name: "Willoughby",
        sprite: new Sprite(resources["sprites/chars/will.png"].texture),
        atk: 14,
        def: 8,
        maxHP: 23,
        hp: 23,
        maxPP: 14,
        pp: 14,
        agl: 14,
        evd: 9,
        level: 1,
        xp: 1000,
        actions: ["Fight", "Swordmastery", "Swap", "Item"],
        status: [],
        Swordmastery: {
            "Finis": {
                pp: 3,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= will.agl + will.atk * battleRandom) {
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
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x77EF3D, function(){return randDir(3)}, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    var dir = randDir(200)
                                    spawnParticle(anim.max[0] + dir.x, anim.max[1] + dir.y, 0xEE402E, false, 0);
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
            },
            "Quicken": {
                pp: 7,
                dmgMult: function(target) { 
                },
                target: "none",
                actionSpeed: 99,
                allied: true,
                healing: true,
                animLen: 120,
                charAnim: function(char) {
                    var wind = {x:0, y: char.y};
                    animations.push({
                        sprite: wind,
                        type: "transform",
                        props: ["x"],
                        min: [0],
                        max: [innerWidth],
                        direction: "one",
                        speed: 60,
                        destruct: 1,
                        play: function() {
                            for(var i = 0; i < 10; i++) {
                                spawnParticle(wind.x + randInt(-150,150), wind.y + randInt(-150,150), 0xF2DF0D, randDir(3), 0).fadeSpeed = 0.025;
                            }
                        },
                        mode: 1,
                        i: 0,
                    });
                    setFrameout(function(){
                        activeParty.forEach(function(c){
                            if(c.hp > 0) {
                                makeTxt("SWIFTNESS", c.sprite);
                                newStatus("swift", 5, c);
                            }
                        });
                    },90);
                },
            },
            "Disarm": {
                pp: 10,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= will.agl + will.atk * 2 * battleRandom) {
                        target.atk /= 2;
                        attack(will.atk, will, target);
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                    updateBattleRandom();
                },
                target: "one",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0x2C6C0C, function(){return randDir(3)}, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
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
                                                var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0xAEB5FB, false, 0)
                                                part.fadeSpeed = 0.025;
                                            }
                                        }
                                        if(anim.mode === -1) {
                                            for(var i = 0; i < 10; i++) {
                                                spawnParticle(anim.max[0], anim.max[1], 0xEE402E, direction(3,randNum(0,Math.PI*2)), 0).fadeSpeed = 0.01;
                                            }
                                        }
                                        console.log(anim.i,anim.speed);
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
                }
            },
            "Semper Fi": {
                pp: 15,
                dmgMult: function(target) { 
                },
                target: "none",
                actionSpeed: 99,
                allied: true,
                healing: true,
                animLen: 120,
                charAnim: function(char) {
                    activeParty.forEach(function(c){
                        if(c.hp > 0) {
                            addEmitter(c.sprite.x - 100, c.sprite.x + 100, c.sprite.y - 100, c.sprite.y + 100, function(){return randDir(3)}, 0xD92662, 10, 60);
                            var dmg = Math.round(will.atk/5);
                            makeTxt(dmg, c.sprite);
                            c.hp = constrain(0, c.hp + dmg,c.maxHP);
                        } else {
                            makeTxt("Ecclesiastes 9:4");
                        }
                    });                  
                },
            },
            "Exeunt": {
                pp: 15,
                dmgMult: function(target) { 
                    if(target.maxHP + target.def + target.evd <= will.agl + will.atk * battleRandom) {
                        target.hp = -1;
                        deathFade(target.sprite);
                        makeTxt("MORTIS", target.sprite);
                    } else {
                        makeTxt("MISS", target.sprite);
                    }
                    updateBattleRandom();
                },
                target: "all",
                animLen: 150,
                charAnim: function(char, target) {
                    animations.push({
                        sprite: char.scale,
                        type: "transform",
                        props: ["x", "y"],
                        min: [char.scale.x, char.scale.y],
                        max: [char.scale.x + 0.05, char.scale.y + 0.05],
                        direction: "both",
                        speed: 7,
                        mode: 1,
                        destruct: 7,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(char.x + randInt(-200, 200), char.y + randInt(-200, 200), 0x77EF3D, false, 10);
                                    part.vector = normalize(char.x - part.x, char.y - part.y, 3);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            console.log(anim.i,anim.speed);
                        },
                        i: 0,
                        cb: function() {
                            setFrameout(function() {
                                animations.push({
                                    sprite: char,
                                    type: "transform",
                                    props: ["x", "y"],
                                    min: [char.x, char.y],
                                    max: [innerWidth/2,innerHeight/2],
                                    direction: "both",
                                    speed: 15,
                                    mode: 1,
                                    destruct: 1,
                                    play: function(anim) {
                                        if(anim.i === anim.speed-1) {
                                            fadeOut(10);
                                        }
                                    },
                                    i: 0,
                                });
                            },5);
                        }
                    });
                },
                targetAnim: function(target) {
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
                }
            },
            "Triforce": {
                pp: 25,
                dmgMult: 1.75,
                target: "all",
                animLen: 40,
                repeater: 3,
                actionSpeed: 0.3,
                charAnim: function(char, target) {

                    animations.push({
                        sprite: char,
                        type: "transform",
                        props: ["x", "y", "rotation"],
                        min: [char.x, char.y, 0],
                        max: [target[0].sprite.x, target[0].sprite.y, Math.PI*4],
                        direction: "both",
                        speed: 15,
                        mode: 1,
                        destruct: 1,
                        play: function(anim) {
                            if(anim.i % 2 === 0||true) {
                                for(var i = 0; i < 5; i++) {
                                    var part = spawnParticle(anim.sprite.x + randInt(-100, 100), anim.sprite.y + randInt(-100, 100), 0x77EF3D, {x:0,y:1}, 0);
                                    part.fadeSpeed = 0.025;
                                }
                            }
                            if(anim.i === anim.speed-1) {
                                for(var i = 0; i < 100; i++) {
                                    var dir = randDir(200)
                                    spawnParticle(anim.max[0] + dir.x, anim.max[1] + dir.y, 0xEE402E, {x:-dir.x/50,y:-dir.y/50}, 0);
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
    invisLevel(will);
    will.sprite.scale.set(0.75,0.75)
    will.sprite.anchor.set(0.5,0.5);
    return will;
}
function invisLevel(char) {
    while(levelUpReq(char.level) < char.xp) {
        char.level++;
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
}
