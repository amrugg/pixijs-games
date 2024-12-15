function targetRandomPlayer(players, char) {
    var living = [];
    for(var i = 0; i < players.length; i++) {
        if(players[i].hp > 0) {
            living.push(players[i]);
        }
    }
    return {
        char: char,
        targets: [living[randInt(0,living.length-1)]],
        action: "fight",
    }
}
var monsterpedia = {
    "Goblin": {
        atk: 10,
        def: 5,
        maxHP: 10,
        maxPP:  0,
        agl: 2,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 3,
        xp: 3
    },
    "Dark Goblin": {
        atk: 15,
        def: 5,
        maxHP: 13,
        maxPP:  0,
        agl: 5,
        evd: 5,
        ai: targetRandomPlayer,
        gold: 5,
        xp: 5
    }
}
var random1 = [["Goblin", "Goblin", "Goblin"], ["Goblin", "Goblin", "Goblin", "Goblin"], ["Goblin", "Goblin", "Goblin"]];
