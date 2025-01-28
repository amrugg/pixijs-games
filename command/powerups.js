var powerupData = {
    orange: {
        maxEnergy: 15,
        time: 600,
        tint: 0xFF7700,
        onFireHandle: function(target) {
            fireLaser(target.x - 10*scalar, canvasLength, 0, 10, "orange", 1);
            fireLaser(target.x + 10*scalar, canvasLength, 0, 10, "orange", 1);
        }
    },
    green: {
        maxEnergy: 15,
        time: 600,
        tint: 0x44DD44,
        onFireHandle: function(target) {
            fireLaser(target.x, canvasLength, 0, 10, "green", 1);
            fireLaser(target.x, canvasLength, 30, 10, "green", 1);
            fireLaser(target.x, canvasLength, -30, 10, "green", 1);
        }
    },
    white: {
        maxEnergy: 5,
        time: 450,
        tint: 0xFFFFFF,
        onFireHandle: function(target) {
            fireLaser(target.x+target.width/2, canvasLength, -5, 11, "white", 1);
            fireLaser(target.x-target.width/2, canvasLength, 5, 11, "white", 1);
            fireLaser(target.x, canvasLength, 0, 10, "white", 1);
        }
    },
    purple: {
        maxEnergy: 10,
        time: 450,
        tint: 0xAA33AA,
        onFireHandle: function(target) {
            var i;
            var len = enemies.length;
            var max = 3;
            for(i = 0; i < len; i++) {
                var cur = enemies[i];
                if(cur.y > 0) {
                    fireLaser(canvasLength/2, canvasLength, -pointTowards(canvasLength/2,canvasLength,cur.x,cur.y), 10, "purple", 1, cur);
                    if(--max === 0) {
                        break;
                    }
                }
            }
            for(i = 0; i < max; i++) {
                fireLaser(canvasLength/2 + ((i-2) * 50*scalar), canvasLength, -pointTowards(canvasLength/2,canvasLength,target.x,target.y), 10, "purple", 1, target);
            }
        }
    },
    brown: {
        maxEnergy: 5,
        time: 300,
        tint: 0x884400,
        onFireHandle: function() {
            for(var i = -45; i <= 45; i+= 7.5) {
                fireLaser(canvasLength/2, canvasLength, i, 10, "brown", 1);
            }
        }
    },
    silver: {
        maxEnergy: 20,
        time: 250,
        tint: 0xAAAAAA,
        onFireHandle: function(target) {
            fireLaser(target.x, canvasLength, 0, 20, "silver", 2);
            fireLaser(target.x, canvasLength + 100*scalar, 0, 20, "silver", 2);
            fireLaser(target.x, canvasLength + 200*scalar, 0, 20, "silver", 2);
        }
    },
    gold: {
        maxEnergy: 10,
        time: 200,
        tint: 0xFAAA00,
        onFireHandle: function(target) {
            fireLaser(canvasLength/2, canvasLength, -pointTowards(canvasLength/2, canvasLength,target.x,target.y), 10, "gold", 1, target);
        }
    }
} 
