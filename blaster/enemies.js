var handleEnemyBehaviors = {
    "enemy-1-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            foreground.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        if(enemy.combo.active) {
            if(enemy.combo.lastFire + enemy.combo.fireCooldown < globalFrameCount) {
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, Math.PI, 10, "red", enemy.damage);
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
            foreground.removeChild(enemy);
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
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, Math.PI, 10, "red", enemy.damage);
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 3.534291735288517, 10, "red", enemy.damage);
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 2.748893571891069, 10, "red", enemy.damage);
            }
        }

        /// Return false; the ship should not be removed from the array
        return false;
    },
    "enemy-1-3": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            foreground.removeChild(enemy);
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
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, Math.PI, 7.5, "red", enemy.damage);
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
            foreground.removeChild(enemy);
            if(enemy.link) {
                enemy.link.health = 0;
            }
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
            if(enemy.link) {
                enemy.link.health = 0;
            }
            updateHealthBar();
            explode(20,{x:(enemy.x+player.x)/2, y: (enemy.y+player.y)/2}, 50);
            foreground.removeChild(enemy);
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
            foreground.removeChild(enemy);
            if(enemy.link) {
                enemy.link.health = 0;
            }
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
            if(enemy.link) {
                enemy.link.health = 0;
            }
            updateHealthBar();
            explode(20,{x:(enemy.x+player.x)/2, y: (enemy.y+player.y)/2}, 50);
            foreground.removeChild(enemy);
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
            foreground.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }

        var playerRect = {
            x: player.x,
            y: player.y,
            width: player.colRect.width,
            height: player.colRect.height
        }
        animate(enemy.animation)
        if(enemy.y < player.y) {
            playerRect.y += Math.abs(enemy.x-player.x)
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
        if(enemy.health <= 0) {
            explode(20,enemy, 50);
            foreground.removeChild(enemy);
            /// Return true; the ship was destroyed and should be removed from the array
            return true;
        }
        enemy.rotation = -pointTowards(enemy.x,enemy.y,player.x,player.y);
        if(globalFrameCount - enemy.cooldown > enemy.lastFire) {
            enemy.lastFire = globalFrameCount;
            fireLaser(enemy.x, enemy.y, -pointTowards(enemy.x,enemy.y,player.x,player.y), 7.5, "red", enemy.damage);
        }
        /// Return false; the ship should not be removed from the array
        return false;
    },
}
var enemyProperties = {
    "enemy-1-1": {
        healthRange: {min: 1, max: 3},
        scale: 1.75,
        direction: Math.PI,
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
        direction: Math.PI,
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
        direction: Math.PI,
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
        dropWeights: [99, 33, 34],
        possibleDrops: ["gold", "5coin", "orange"],
        init: function(enemy) {
            enemy.origX = enemy.x;
        }
    },
    "asteroid-1": {
        healthRange: {min: 3, max: 5},
        scale: 1.75,
        direction: Math.PI,
        damage: 2,
        cooldown: 120,
        lastFire: -Infinity,
        noTarget: true,
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
        direction: Math.PI,
        damage: 1,
        cooldown: 120,
        lastFire: -Infinity,
        noTarget: true,
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
        direction: Math.PI,
        damage: 2,
        cooldown: 120,
        lastFire: -Infinity,
        noTarget: true,
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
        direction: Math.PI,
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