var level1 = {
    "endY": -3300,
    "speed": 2.5,
    "seed": 23512,
    "startingSeed": 23512,
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
                {"x":200,"y":-400},
                {"x":700,"y":-400},
                {"x":500,"y":-600},
                {"x":300,"y":-1200},
                {"x":600,"y":-1200},
                {"x":200,"y":-2000},
                {"x":700,"y":-2000},
                {"x":500,"y":-1800},
                {"x":100,"y":-2300},
            ]
        },
    ]
};
var level2 = {
	endY: -4000,
	speed: 7.5,
	seed: 2351,
	startingSeed: 2351,
    randInt: function(min, max) {
        /// UPDATE (use this??)
        var x = Math.sin(level2.seed++) * 100000;
        x = x - Math.floor(x);
        return Math.floor(x * (max - min + 1)) + min;
    },
	enemies: [
		{
			type: "enemy-1-1",
			level: 1,
			positions: [
				{
					x: 800,
					y: -2700
				},
				{
					x: 200,
					y: -2700
				},
				{
					x: 700,
					y: -2400
				},
				{
					x: 300,
					y: -2400
				}
			]
		},
		{
			type: "enemy-1-2",
			level: 1,
			positions: [
				{
					x: 800,
					y: -1700
				},
				{
					x: 200,
					y: -1700
				},
				{
					x: 800,
					y: -1400
				},
				{
					x: 200,
					y: -1400
				},
				{
					x: 500,
					y: -2200
				},
				{
					x: 500,
					y: -1900
				}
			]
		},
		{
			type: "enemy-1-3",
			level: 1,
			positions: [
				{
					x: 600,
					y: -700
				},
				{
					x: 400,
					y: -600
				},
				{
					x: 200,
					y: -800
				},
				{
					x: 600,
					y: -2900
				},
				{
					x: 400,
					y: -3100
				},
				{
					x: 800,
					y: -3100
				},
				{
					x: 300,
					y: -2900
				},
				{
					x: 100,
					y: -3100
				},
				{
					x: 500,
					y: -3300
				}
			]
		},
		{
			type: "asteroid-1",
			level: 1,
			positions: []
		},
		{
			type: "asteroid-2",
			level: 1,
			positions: [
				{
					x: 700,
					y: -100
				},
				{
					x: 600,
					y: -100
				},
				{
					x: 500,
					y: -100
				},
				{
					x: 400,
					y: -200
				},
				{
					x: 300,
					y: -300
				},
				{
					x: 100,
					y: -400
				},
				{
					x: 200,
					y: -400
				},
				{
					x: 800,
					y: -400
				},
				{
					x: 900,
					y: -400
				}
			]
		},
		{
			type: "asteroid-1",
			level: 1,
			link: {
				nextSet: true
			},
			positions: [
				{
					x: 800,
					y: -900
				},
				{
					x: 800,
					y: -1000
				},
				{
					x: 600,
					y: -1000
				},
				{
					x: 300,
					y: -900
				},
				{
					x: 100,
					y: -1000
				}
			]
		},
		{
			type: "plasma-base",
			level: 1,
			link: {nextSet: true, thisSet: true},
			positions: [
				{
					x: 800,
					y: -900
				},
				{
					x: 800,
					y: -1000
				},
				{
					x: 600,
					y: -1000
				},
				{
					x: 300,
					y: -900
				},
				{
					x: 100,
					y: -1000
				}
			]
		},
		{
			type: "plasma-top",
			level: 1,
			link: {thisSet: true},
			positions: [
				{
					x: 800,
					y: -900
				},
				{
					x: 800,
					y: -1000
				},
				{
					x: 600,
					y: -1000
				},
				{
					x: 300,
					y: -900
				},
				{
					x: 100,
					y: -1000
				}
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