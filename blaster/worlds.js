var world1 = {
    seed: 12445,
    startingSeed: 12445,
    randInt: function(min, max) {
        var x = Math.sin(world1.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
    points: [
        {x: 100, y: 400},
        {x: 200, y: 350}
    ]
}; 
