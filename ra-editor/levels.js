var editingLevel = {
    endY: -2300,
    speed: 5,
    seed: 2351,
    startingSeed: 2351,
    randInt: function(min, max) {
        var x = Math.sin(editingLevel.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    enemies: [
        
        {
            type: "enemy-1-1",
            level: 1,
            positions: [
            ]
        },
        {
            type: "enemy-1-2",
            level: 1,
            positions: [
            ]
        },
        {
            type: "enemy-1-3",
            level: 1,
            positions: [
            ]
        },
        {
            type: "asteroid-1",
            level: 1,
            positions: [
            ]
        },
        {
            type: "asteroid-2",
            level: 1,
            positions: [
            ]
        },
        {
            type: "asteroid-blue-plasma",
            level: 1,
            link: {nextSet: true},
            positions: [
            ]
        },
        {
            type: "asteroid-blue-plasma-2",
            level: 1,
            link: {nextSet: true},
            positions: [
            ]
        },
    ]
};