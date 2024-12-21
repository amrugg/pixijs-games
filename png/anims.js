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
function animRetreat(char) {
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
        i: 0,
    });
}
function deathFade(char) {
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
        cb: function() {
            foreground.removeChild(char);
        },
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