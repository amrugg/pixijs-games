var data = `Ruggabury|300
Draw a Card
Lost in Everglades Lose 1 turn
Bonus Pickle Collect $50 from bank
Vector|400
Warp Pipe|50
Baron|375
Hyrule Castle|350
Draw a Card
Watery Forest|320
Cavernous Cleft|310
Moldy Applesauce Lose 1 turn
Plains of Dimm Laite|290
ROAD TRIP
Greener View|300
Roll Again! Move backwards
Draw a Card
Toilet Clogs Lose 1 turn
Monty Crisco|250
Purple Village|240
Nobath|240
Draw a Card
Beach Resort|200
Steal a Card
Marvin Garvens|190
Dear Gabby Inc.|230
Airport
Public Property
Valyent Studios|300
Draw a Card
Reverse turn order
Forgot Pants Lose 1 turn 
Birds vs. Squirrels|170
Warp Pipe |50
Nintendo|150
Rugg Family Game Server|160
Draw a Card
KFC|130
IHOP|120
Go to Airport
Happy Tom’s F.A.R|110
Jail
Rugg Family Studios|300
Pay everyone $20
Garage Collapses Lose 1 turn
Draw a Card
The Regime|70
Clover Sites|80
Uncle Ben's|90
Charity
Hoffmanhouse Estates|60
Draw a Card
Mole Commando|70
Ice Mountain|50
Go to Jail
Home`
data = data.split("\n");
var truMap = [];
var shortcuts = [[],[],[],[]];
var shortcutNum = 4;
var shortcutCount = 0;
var propertyData = {};
for(var i = 0; i < data.length; i++) {
    var cur = data[i];
    if(cur.split("|")) {
        if(cur.split("|")[1] === "300") {
            shortcutCount = 3;
            --shortcutNum;
            shortcuts[shortcutNum].unshift(cur);
        } else if(shortcutCount) {
            --shortcutCount;
            shortcuts[shortcutNum].unshift(cur);
        } else {
            truMap.unshift(cur);
        }
        if(cur.split("|")[1]) {
            var dough = Number(cur.split("|")[1]);
            var prop = cur.split("|")[0]
            if(dough === 300) {
                propertyData[prop] = []
                var lin = 3.25;
                propertyData[prop] = to10([dough/lin, dough*4/lin, dough*12/lin, dough*16/lin, dough*20/lin]);

                // propertyData[prop] = to10([dough/lin, dough*3/lin, dough*7/lin, dough*10/lin, dough*20/lin]);
                propertyData[prop].unshift(dough);
            } else {
                var lin = linear(dough);
                if(dough === 200) {
                    lin = 6;
                }
                // console.log(lin);
                propertyData[prop] = to10([dough/lin, dough*4/lin, dough*12/lin, dough*16/lin, dough*20/lin]);
                propertyData[prop].unshift(dough);
            }
        }
    }
}
// console.log(truMap);
// console.log(shortcuts);
console.log(propertyData);
function to10(x) {
    if(typeof x === "object") {
        x.forEach(function(e,i) {
            var con = 1;
            if(e > 500) {
                con = 100;
            } else if(e > 300) {
                con = 50;
            } else if(e > 200) {
                con = 10;
            } else if (e > 100) {
                con = 5;
            }
            x[i] = Math.round(e/con)*con;
        });
        return x;
    }
    return Math.round(x/10)*10;
}
function linear(dough) {
    dough -= 50;
    dough /= 400-50;
    return Math.ceil(3 +(2*dough))
}