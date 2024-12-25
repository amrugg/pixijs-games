var itempedia = {
    "Barbecue Sauce": {
        target: "one",
        bonus: {
            hp: {val: 20}
        },
        tint: 0x6B220A
    },
    "Tuna-flavored Mint": {
        target: "one",
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
        bonus: {
            pp: {val: 50}
        },
        tint: 0xFDF1B4
    },
    "Paint": {
        target: "one",
        bonus: {
            pp: {val: 10}
        },
        tint: 0xF2F0EC
    },
    "Pancake": {
        target: "one",
        bonus: {
            hp: {val: 200}
        },
        tint: 0xFECC63
    },
}