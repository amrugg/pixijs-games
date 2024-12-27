var itempedia = {
    "Barbecue Sauce": {
        target: "one",
        desc: "Restore 20 HP",
        bonus: {
            hp: {val: 20}
        },
        tint: 0x6B220A
    },
    "Tuna-flavored Mint": {
        target: "one",
        desc: "Revive the fallen",
        bonus: {
            hp: function(target) {
                if(target.hp <= 0) {
                    target.hp = Math.round(target.maxHP/5);
                    healFade(target.sprite);
                    makeTxt(target.hp,target.sprite);
                } else {
                    makeTxt("Luke 5:31", target.sprite);
                }
            }
        },
        tint: 0x39F1A6
    },
    "Mayonnaise": {
        target: "one",
        desc: "Restore 50 PP",
        bonus: {
            pp: {val: 50}
        },
        tint: 0xFDF1B4
    },
    "Paint": {
        target: "one",
        desc: "Restore 10 PP",
        bonus: {
            pp: {val: 10}
        },
        tint: 0xF2F0EC
    },
    "Pancake": {
        target: "one",
        desc: "Restore 200 HP",
        bonus: {
            hp: {val: 200}
        },
        tint: 0xFECC63
    },
    "Hot Sauce": {
        target: "one",
        desc: "Increase attack",
        bonus: {
            hp: function(target) {
                newStatus("valor",2,target);
            }
        },
        tint: 0x39F1A6
    },
    "Turtle Soup": {
        target: "one",
        desc: "Increase defense",
        bonus: {
            hp: function(target) {
                newStatus("shell",2,target);
            }
        },
        tint: 0x39F1A6
    },
    "Poison Beaker": {
        target: "one",
        desc: "Poisons target",
        bonus: {
            hp: function(target) {
                newStatus("poison",2,target);
            }
        },
        tint: 0x39F1A6
    },
}