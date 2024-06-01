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
    }
}
var enemyProperties = {
    "enemy-1-1": {
        healthRange: {min: 1, max: 3},
        scale: 2,
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
        colXPercent: 0.75,
        colYPercent: 0.9,
        dropChances: []
    },
    "enemy-1-2": {
        healthRange: {min: 3, max: 5},
        scale: 2,
        direction: 180,
        damage: 1,
        cooldown: 120,
        lastFire: -Infinity,
        colXPercent: 0.75,
        colYPercent: 0.9,
        dropChances: [100],
        possibleDrops: ["green"]
    }
}