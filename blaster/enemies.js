var handleEnemyBehaviors = {
    "enemy-1-1": function(enemy) {
        enemy.y = enemy.myY - globalY;
        if(enemy.combo.active) {
            if(enemy.combo.lastFire + enemy.combo.fireCooldown < globalFrameCount) {
                fireLaser(enemy.x, enemy.y + enemy.height/2 - 10 * scalar, 180, 10, "red");
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
    }
}
var enemyProperties = {
    "enemy-1-1": {
        health: 5,
        scale: 2,
        direction: 180,
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
        colYPercent: 0.9
    }
}