var handleEnemyBehaviors = {
    "enemy-1-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        

        /// Return false; the ship should not be removed from the array
        return false;
    },
    "enemy-1-2": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        return false;
    },
    "enemy-1-3": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
                /// Return false; the ship should not be removed from the array
        return false;
    },
    "asteroid-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            if(enemy.link) {
                enemy.link.health = 0;
            }
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        /// Return false; the ship should not be removed from the array
        return false;
    },
    "asteroid-2": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            if(enemy.link) {
                enemy.link.health = 0;
            }
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        /// Return false; the ship should not be removed from the array
        return false;
    },
    "plasma-base": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            enemy.link.health = 0;
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        /// Return false; the ship should not be removed from the array
        return false;
    },
    "plasma-top": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.y > 0 && !enemy.randomized) {
            enemy.lastFire = globalFrameCount + curLevel.randInt(60,160);
            enemy.randomized = true;
        }
        /// Return false; the ship should not be removed from the array
        return false;
    },
}
var enemyProperties = {
    "enemy-1-1": {
        healthRange: {min: 1, max: 3},
        scale: 1.75,
        direction: 180,
        damage: 1,
        combo: {
            active: false,
            curTicks: 0,
            maxTicks: 3,
            fireCooldown: 9,
            lastFire: 0,
            comboCooldown: 120,
            lastCombo: -Infinity
        },
        colRects: [
            {
                colXPercent: 0.5,
                colYPercent: 0.9,
                dmgMult: 1,
            }
        ],
        dropChance: 100,
        dropWeights: [33,33,34],
        possibleDrops: ["silver","brown","gold"]
    },
    "enemy-1-2": {
        healthRange: {min: 3, max: 5},
        scale: 1.75,
        direction: 180,
        damage: 1,
        cooldown: 200,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.5,
                dmgMult: 1,
            },
            {
                colXPercent: 0.25,
                colYPercent: 0.9,
                dmgMult: 3,
            }
        ],
        dropChance: 100,
        dropWeights: [33,33,34],
        possibleDrops: ["green", "brown", "purple"]
    },
    "enemy-1-3": {
        healthRange: {min: 1, max: 2},
        scale: 1.75,
        direction: 180,
        damage: 1,
        cooldown: 120,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.9,
                dmgMult: 1,
                /// Shifting Slope is for ships with diagonal lines. If shiftingSlope exists, it determines the slope of the diagonal.
                shiftingSlope: 1
            }
        ],
        dropChance: 100,
        dropWeights: [33, 33, 34],
        possibleDrops: ["coin", "5coin", "orange"],
        init: function(enemy) {
            enemy.origX = enemy.x;
        }
    },
    "asteroid-1": {
        healthRange: {min: 3, max: 5},
        scale: 1.75,
        direction: 180,
        damage: 2,
        cooldown: 120,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.9,
                dmgMult: 1,
            }
        ],
        dropChance: 0,
        dropWeights: [],
        possibleDrops: [],
    },
    "asteroid-2": {
        healthRange: {min: 1, max: 3},
        scale: 1.75,
        direction: 180,
        damage: 1,
        cooldown: 120,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.9,
                dmgMult: 1,
            }
        ],
        dropChance: 0,
        dropWeights: [],
        possibleDrops: [],
    },
    
    "plasma-base": {
        healthRange: {min: 3, max: 5},
        scale: 1.75,
        direction: 180,
        damage: 2,
        cooldown: 120,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.9,
                dmgMult: 1,
            }
        ],
        dropChance: 0,
        dropWeights: [],
        possibleDrops: [],
        init: function(enemy) {
            enemy.textureRect = new PIXI.Rectangle(0,0,23,23);
            enemy.texture.frame = enemy.textureRect;
            enemy.animation = {y: 0, x: 0, length: 4, speed: 20, frameCount: 0, texture: enemy.texture, rectangle: enemy.textureRect, size: 23, bouncy: true, direction: 1};
        }
    },
    "plasma-top": {
        healthRange: {min: 3, max: 5},
        scale: 1.75,
        direction: 180,
        damage: 0.5,
        cooldown: 120,
        lastFire: -Infinity,
        colRects: [
            {
                colXPercent: 1,
                colYPercent: 0.9,
                dmgMult: 1,
            }
        ],
        dropChance: 0,
        dropWeights: [],
        possibleDrops: [],
    },
}