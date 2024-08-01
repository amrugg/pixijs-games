var handleEnemyBehaviors = {
    "enemy-1-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        if(enemy.combo.active) {
            if(enemy.combo.lastFire + enemy.combo.fireCooldown < globalFrameCount) {
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 180, 10, "red", enemy.damage);
                enemy.combo.lastFire = globalFrameCount;
                if(--enemy.combo.curTicks < 1) {
                    enemy.combo.active = false;
                    enemy.combo.lastCombo = globalFrameCount;
                }
            }
        } else if(Math.abs(enemy.x - player.x) * scalar < player.width*1.5 && enemy.y > 0) {
            if(enemy.combo.lastCombo + enemy.combo.comboCooldown < globalFrameCount) {
                enemy.combo.active = true;
                enemy.combo.curTicks = enemy.combo.maxTicks;
            }
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
        if(Math.abs(enemy.x - player.x) * scalar < enemy.width && enemy.y > 0) {
            if((player.x > enemy.x || (canvasLength - player.x < enemy.width)) && player.x >= enemy.width) {
                enemy.x -= 2 * scalar;
            } else {
                enemy.x += 2 * scalar;
            }
            if(globalFrameCount - enemy.cooldown > enemy.lastFire) {
                enemy.lastFire = globalFrameCount;
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 180, 10, "red", enemy.damage);
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 202.5, 10, "red", enemy.damage);
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 157.5, 10, "red", enemy.damage);
            }
        }

        /// Return false; the ship should not be removed from the array
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
        if(enemy.y > 0) {
            if(Math.abs(player.x - enemy.x) > 10 * scalar && (Math.abs(player.x-enemy.origX)) < 150*scalar) {
                if(player.x > enemy.x) {
                    enemy.x += 1 * scalar;
                } else if(player.x < enemy.x) {
                    enemy.x -= 1 * scalar;
                }
            } else if(globalFrameCount - enemy.cooldown > enemy.lastFire && Math.abs(player.x - enemy.x) <= player.width/2) {
                enemy.lastFire = globalFrameCount;
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 180, 7.5, "red", enemy.damage);
            } else if(Math.abs(enemy.x - enemy.origX) > 10*scalar && Math.abs(player.x - enemy.x) > player.width/2) {
                if(enemy.origX > enemy.x) {
                    enemy.x += 1 * scalar;
                } else if(enemy.origX < enemy.x) {
                    enemy.x -= 1 * scalar;
                }
            }
        }

        /// Return false; the ship should not be removed from the array
        return false;
    },
    "asteroid-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }

        var playerRect = {
            x: player.x,
            y: player.y,
            width: player.colRect.width,
            height: player.colRect.height
        }
        if(enemy.y < player.y) {
            playerRect.y += Math.abs(enemy.x-player.x)
        }
        if(hitTestRectangle(playerRect, enemy)) {
            player.health -= enemy.damage;
            updateHealthBar();
            explode(20,{x:(enemy.x+player.x)/2, y: (enemy.y+player.y)/2}, 50);
            app.stage.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
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

        dropChances: [],
        possibleDrops: []
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
        dropChances: [100],
        possibleDrops: ["green"]
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

        dropChances: [],
        possibleDrops: [],
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

        dropChances: [],
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

        dropChances: [],
        possibleDrops: [],
    },
    "plasma-top": {
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

        dropChances: [],
        possibleDrops: [],
    },
}