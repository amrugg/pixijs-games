var powerupData = {
    orange: {
        maxEnergy: 15,
        tint: 0xFF7700,
        onFireHandle: function() {
            fireLaser(player.x - 10 * scalar + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "orange", player.plasma.damage);
            fireLaser(player.x + 10 * scalar + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "orange", player.plasma.damage);
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
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, player.activePowerup.loadedBullet.direction, 10, "green", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, player.activePowerup.loadedBullet.direction + Math.PI/2, 10, "green", player.plasma.damage)
                fireLaser(player.activePowerup.loadedBullet.x, player.activePowerup.loadedBullet.y, player.activePowerup.loadedBullet.direction - Math.PI/2, 10, "green", player.plasma.damage)
                player.activePowerup.loadedBullet.kill = true;
                player.activePowerup.loadedBullet = false;
            } else {
                player.activePowerup.loadedBullet = fireLaser(player.x, player.y - player.height/2, player.rotation, 7.5, "green", player.plasma.damage);
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
            for(var i = -0.7853981633974483; i <= 0.7853981633974483; i+= 0.17453292519943295) {
                fireLaser(player.x, player.y - player.height/2, player.rotation + i, 10, "brown", player.plasma.damage);
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
            var tilt1 = direction(player.height/2, 1.9 + player.rotation);
            var tilt2 = direction(player.height/2, -1.9 + player.rotation);
            fireLaser(player.x + tilt1.x, player.y + tilt1.y, -0.08 + player.rotation, 11, "white", player.plasma.damage);
            fireLaser(player.x + tilt2.x, player.y + tilt2.y, 0.08 + player.rotation, 11, "white", player.plasma.damage);
            fireLaser(player.x  + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "white", player.plasma.damage);
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    silver: {
        maxEnergy: 20,
        tint: 0xAAAAAA,
        onFireHandle: function() {
            fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 20, "silver", player.plasma.damage*3);
            player.plasma.lastTime = globalFrameCount - player.plasma.cooldown*0.66;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    purple: {
        maxEnergy: 10,
        tint: 0xAA33AA,
        onFireHandle: function() {
            var target = getClosestEnemy(player);
            if(target) {
                fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, -pointTowards(player.x,player.y-player.height-2,target.x,target.y), 10, "purple", player.plasma.damage, target);
            } else {
                fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "purple", player.plasma.damage);
            }
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    },
    gold: {
        maxEnergy: 10,
        tint: 0xFAAA00,
        onFireHandle: function() {
            var target = getClosestEnemy(player);
            if(target) {
                fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, -pointTowards(player.x,player.y-player.height-2,target.x,target.y), 10, "gold", player.plasma.damage, target);
            } else {
                fireLaser(player.x + player.firePoint.x, player.y + player.firePoint.y, player.rotation, 10, "gold", player.plasma.damage);
            }
            player.plasma.lastTime = globalFrameCount;
            player.energy -= player.plasma.damage * 5 / player.plasma.efficiencyScore;
            player.powerupEnergy -= 1;
        }
    }
} 
