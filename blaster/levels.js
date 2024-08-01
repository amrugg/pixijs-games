var level1 = {
    endY: -2400,
    speed: 5,
    seed: 37164,
    startingSeed: 37164,
    randInt: function(min, max) {
        var x = Math.sin(level1.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        {
            type: "enemy-1-3",
            level: 1,
            positions: [
                {x: "random", y: -100},
                {x: 100, y: -300},
                {x: 700, y: -300},
                {x: 400, y: -300},
                {x: 800*0.33, y: -500},
                {x: 800*0.66, y: -500},
                {x: "random", y: -700},
                {x: "random", y: -800},

                {x: 100, y: -1000},
                {x: 700, y: -1000},
                {x: 400, y: -1000},

                {x: "random", y: -1300},
                {x: "random", y: -1300},
                {x: 400, y: -1400},
                {x: 100, y: -1500},
                {x: 700, y: -1500},
            ]
        },
        {
            type: "enemy-1-1",
            level: 1,
            positions: [
                {x: 400, y: -800, dropChances: [100], possibleDrops: ["orange"]},
            ]
        }
    ]
};
var level2 = {
    endY: -2400,
    speed: 5,
    seed: 3000,
    startingSeed: 3000,
    randInt: function(min, max) {
        var x = Math.sin(level1.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        {
            type: "asteroid-1",
            level: 1,
            positions: [
                {x: "random", y: -100},
                {x: 100, y: -300},
                {x: 700, y: -300},
                {x: 400, y: -300},
                {x: 800*0.33, y: -500},
                {x: 800*0.66, y: -500},
                {x: "random", y: -700},
                {x: "random", y: -800},

                {x: 100, y: -1000},
                {x: 700, y: -1000},
                {x: 400, y: -1000},

                {x: "random", y: -1300},
                {x: "random", y: -1300},
                {x: 400, y: -1400},
                {x: 100, y: -1500},
                {x: 700, y: -1500},
            ]
        },
    ]
};