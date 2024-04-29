var powerupData = {
    orange: {
        maxEnergy: 15,
        tint: 0xFF7700,
        onFireHandle: function() {
            fireLaser(player.x - 10 * scalar, player.y - player.height/2, 0, 10, "blue", player.plasma.damage);
            fireLaser(player.x + 10 * scalar, player.y - player.height/2, 0, 10, "blue", player.plasma.damage);
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    green: {
        maxEnergy: 15,
        tint: 0x44DD44,
        onFireHandle: function() {
            if(player.activePowerup.loadedBullet) {
                player.plasma.lastTime = globalFrameCount;
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, 0, 10, "blue", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, 30, 10, "blue", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, -30, 10, "blue", player.plasma.damage)
                player.activePowerup.loadedBullet.kill = true;
                player.activePowerup.loadedBullet = false;
            } else {
                player.activePowerup.loadedBullet = fireLaser(player.x, player.y - player.height/2, 0, 7.5, "blue", player.plasma.damage);
                player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
                player.powerupEnergy -= 1;
                disableUserInput("fire");
            }
        }
    }
} 
