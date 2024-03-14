var level1 = {
    endY: -2000,
    seed: 37164,
    randInt: function(min, max) {
        var x = Math.sin(level1.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        {
            type: "enemy-1-1",
            level: 1,
            positions: [
                {x: "random", y: -100},
                {x: 10, y: -300},
                {x: 790, y: -300},
                {x: 400, y: -300},
                {x: "random", y: -500},
                {x: "random", y: -600},
                {x: "random", y: -700},
                {x: "random", y: -800},

                {x: 10, y: -1000},
                {x: 790, y: -1000},
                {x: 400, y: -1000},


                {x: 10, y: -1500},
                {x: 790, y: -1500},
                {x: 400, y: -1500},
                {x: 200, y: -1500},
                {x: 600, y: -1500},
                {x: "random", y: -1700},
            ]
        }
    ]
};