function animAdvance(char) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["y"],
        min: [char.y],
        max: [char.y - 20],
        direction: "one",
        speed: 5,
        destruct: 1,
        mode: 1,
        i: 0,
    });
}
function animSpin(char, rot, speed) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["rotation"],
        min: [0],
        max: [rot],
        direction: "one",
        speed: speed,
        destruct: 1,
        mode: 1,
        i: 0,
    });
}
function animMoveTo(char, x, y, speed, cb, dontActivate) {
    var anim = {
        sprite: char,
        type: "transform",
        props: ["x","y"],
        min: [char.x, char.y],
        max: [x, y],
        direction: "one",
        speed: speed,
        destruct: 1,
        cb: cb,
        mode: 1,
        i: 0,
    };
    if(!dontActivate) {
        animations.push(anim);
    }
    return anim;
}
function animMove(char, xChange, yChange, speed, cb, dontActivate) {
    var anim = {
        sprite: char,
        type: "transform",
        props: ["x","y"],
        min: [char.x, char.y],
        max: [char.x + xChange, char.y + yChange],
        direction: "one",
        speed: speed,
        destruct: 1,
        cb: cb,
        mode: 1,
        i: 0,
    };
    if(!dontActivate) {
        animations.push(anim);
    }
    return anim;
}
function animRetreat(char,cb) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["y"],
        min: [char.y],
        max: [char.y + 20],
        direction: "one",
        speed: 5,
        destruct: 1,
        mode: 1,
        cb: cb,
        i: 0,
    });
}
function deathFade(char, cb) {
    cb = cb || function() {
        foreground.removeChild(char);
    };
    animations.push({
        sprite: char,
        type: "transform",
        props: ["alpha"],
        min: [1],
        max: [0],
        direction: "one",
        speed: 40,
        destruct: 1,
        mode: 1,
        cb: cb,
        i: 0,
    });
}
function swapInFade(char,cb) {
    foreground.addChild(char);
    animations.push({
        sprite: char,
        type: "transform",
        props: ["alpha"],
        min: [0],
        max: [1],
        direction: "one",
        speed: 40,
        destruct: 1,
        mode: 1,
        cb: cb,
        i: 0,
    });
}
function alphaFade(char,min,max,speed,cb) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["alpha"],
        min: [min],
        max: [max],
        direction: "one",
        speed: speed || 10,
        destruct: 1,
        cb: cb||function(){},
        mode: 1,
        i: 0,
    });
}
function halfFade(char) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["alpha"],
        min: [1],
        max: [0.25],
        direction: "one",
        speed: 40,
        destruct: 1,
        mode: 1,
        i: 0,
    });
}
function healFade(char) {
    animations.push({
        sprite: char,
        type: "transform",
        props: ["alpha"],
        min: [0.25],
        max: [1],
        direction: "one",
        speed: 40,
        destruct: 1,
        mode: 1,
        i: 0,
    });
}