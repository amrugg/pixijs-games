function addCharNels() {
    var nels = {
        name: "Nels",
        sprite: new Sprite(resources["sprites/chars/nels.png"].texture),
        atk: 15,
        def: 7,
        maxHP: 20,
        hp: 20,
        maxPP: 105,
        pp: 105,
        agl: 17,
        evd: 10,
        level: 91,
        xp: 0,
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
                    newStatus("valor", 1, target);
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
        pp: 105,
        agl: 9,
        evd: 9,
        level: 91,
        xp: 0,
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
        level: 91,
        xp: 0,
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
    tux.sprite.scale.set(0.75,0.75)
    tux.sprite.anchor.set(0.5,0.5);
    return tux;
}