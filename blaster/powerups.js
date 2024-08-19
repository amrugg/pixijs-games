var powerupData = {
    orange: {
        maxEnergy: 15,
        tint: 0xFF7700,
        onFireHandle: function() {
            fireLaser(player.x - 10 * scalar, player.y - player.height/2, 0, 10, "orange", player.plasma.damage);
            fireLaser(player.x + 10 * scalar, player.y - player.height/2, 0, 10, "orange", player.plasma.damage);
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
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, 0, 10, "green", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, 30, 10, "green", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, -30, 10, "green", player.plasma.damage)
                player.activePowerup.loadedBullet.kill = true;
                player.activePowerup.loadedBullet = false;
            } else {
                player.activePowerup.loadedBullet = fireLaser(player.x, player.y - player.height/2, 0, 7.5, "green", player.plasma.damage);
                player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
                player.powerupEnergy -= 1;
                disableUserInput("fire");
            }
        }
    },
    brown: {
        maxEnergy: 5,
        tint: 0x884400,
        onFireHandle: function() {
            for(var i = -45; i <= 45; i+= 10) {
                fireLaser(player.x, player.y - player.height/2, i, 10, "brown", player.plasma.damage);
            }
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    white: {
        maxEnergy: 5,
        tint: 0xFFFFFF,
        onFireHandle: function() {
            fireLaser(player.x+player.width/2, player.y, -5, 11, "white", player.plasma.damage);
            fireLaser(player.x-player.width/2, player.y, 5, 11, "white", player.plasma.damage);
            fireLaser(player.x, player.y - player.height/2, 0, 10, "white", player.plasma.damage);
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    silver: {
        maxEnergy: 20,
        tint: 0xAAAAAA,
        onFireHandle: function() {
            fireLaser(player.x, player.y - player.height/2, 0, 20, "silver", player.plasma.damage*3);
            player.plasma.lastTime = globalFrameCount - player.plasma.cooldown*0.66;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    }
} 
