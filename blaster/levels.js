var level1 = {
    "endY":-3300,
    "speed":5,
    "seed":23512,
    "startingSeed":23512,
    randInt: function(min, max) {
        /// UPDATE (use this??)
        var x = Math.sin(level1.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    "enemies":[
        {
            "type":"enemy-1-1",
            "level":1,
            "positions":[
                {"x":900,"y":-2100},
                {"x":100,"y":-2100}
            ]
        },
        {
            "type":"enemy-1-2",
            "level":1,
            "positions":[
                {"x":500,"y":-1000}
            ]
        },
        {
            "type":"enemy-1-3",
            "level":1,
            "positions":[
                {"x":100,"y":-200},
                {"x":900,"y":-200},
                {"x":200,"y":-400},
                {"x":800,"y":-400},
                {"x":500,"y":-600},
                {"x":300,"y":-1200},
                {"x":700,"y":-1200},
                {"x":200,"y":-2000},
                {"x":800,"y":-2000},
                {"x":500,"y":-1800},
                {"x":100,"y":-2300},
                {"x":900,"y":-2300}
            ]
        },
    ]
};
var level2 = {
    endY: -3000,
    speed: 5,
    seed: 3000,
    startingSeed: 3000,
    randInt: function(min, max) {
        /// UPDATE (use this??)
        var x = Math.sin(level2.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        {
            type: "enemy-1-3",
            level: 1,
            positions: [
                {x: "random", y: -100},
                {x: 800*0.33, y: -500},
                {x: 800*0.66, y: -500},
                {x: "random", y: -700},
                {x: "random", y: -700},
                {x: "random", y: -800},
                {x: "random", y: -800},
                {x: 100, y: -1300},
                {x: 700, y: -1300},
                {x: 400, y: -1300},

                {x: 400, y: -1400},
                {x: 100, y: -1500},
                {x: 700, y: -1500},
            ]
        },
        {
            type: "asteroid-1",
            level: 1,
            link: {nextSet: true},
            positions: [
                {x: 100, y: -300},
                {x: 400, y: -1000},
                {x: 700, y: -2000},
            ]
        },
        {
            type: "plasma-base",
            level: 1,
            link: {nextSet: true, thisSet: true},
            positions: [
                {x: 100, y: -300},
                {x: 400, y: -1000},
                {x: 700, y: -2000},
            ]
        },
        {
            type: "plasma-top",
            level: 1,
            link: {thisSet: true},
            positions: [
                {x: 100, y: -300},
                {x: 400, y: -1000},
                {x: 700, y: -2000},
            ]
        },
    ]
};
var level3 = {
    endY: -3000,
    speed: 2.5,
    seed: 3000,
    startingSeed: 3000,
    randInt: function(min, max) {
        /// UPDATE (use this??)
        var x = Math.sin(level3.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        {
            type: "enemy-1-1",
            level: 1,
            positions: [
                {x: "random", y: -350},
                {x: "random", y: -350},
                {x: "random", y: -350},
                {x: "random", y: -850},
                {x: "random", y: -850},
                {x: "random", y: -850},
                {x: "random", y: -1350},
                {x: "random", y: -1350},
                {x: "random", y: -1350},
                {x: "random", y: -1850},
                {x: "random", y: -1850},
                {x: "random", y: -1850},
                {x: "random", y: -2350},
                {x: "random", y: -2350},
                {x: "random", y: -2350},
                {x: "random", y: -2850},
                {x: "random", y: -2850},
                {x: "random", y: -2850},
            ]
        },
        {
            type: "enemy-1-2",
            level: 1,
            positions: [
                {x: "random", y: -175},
                {x: "random", y: -175},
                {x: "random", y: -175},
                {x: "random", y: -675},
                {x: "random", y: -675},
                {x: "random", y: -675},
                {x: "random", y: -1175},
                {x: "random", y: -1175},
                {x: "random", y: -1175},
                {x: "random", y: -1675},
                {x: "random", y: -1675},
                {x: "random", y: -1675},
                {x: "random", y: -2175},
                {x: "random", y: -2175},
                {x: "random", y: -2175},
                {x: "random", y: -2675},
                {x: "random", y: -2675},
                {x: "random", y: -2675},
            ]
        },
        {
            type: "enemy-1-3",
            level: 1,
            positions: [
                {x: "random", y: -0},
                {x: "random", y: -0},
                {x: "random", y: -0},
                {x: "random", y: -500},
                {x: "random", y: -500},
                {x: "random", y: -500},
                {x: "random", y: -1000},
                {x: "random", y: -1000},
                {x: "random", y: -1000},
                {x: "random", y: -1500},
                {x: "random", y: -1500},
                {x: "random", y: -1500},
                {x: "random", y: -2000},
                {x: "random", y: -2000},
                {x: "random", y: -2000},
                {x: "random", y: -2500},
                {x: "random", y: -2500},
                {x: "random", y: -2500},
            ]
        },
    ]
};
var levels = [level1, level2, level3];
var levelOn = -1;