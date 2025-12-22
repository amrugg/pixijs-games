var vals = {
  Ruggabury: [ 300, 92, 350, 1100, 1500, 1800 ],
  Vector: [ 400, 80, 300, 1000, 1300, 1600 ],
  Baron: [ 375, 75, 300, 900, 1200, 1500 ],
  'Hyrule Castle': [ 350, 70, 280, 800, 1100, 1400 ],
  'Watery Forest': [ 320, 64, 260, 800, 1000, 1300 ],
  'Cavernous Cleft': [ 310, 62, 250, 700, 1000, 1200 ],
  'Plains of Dimm Laite': [ 290, 58, 230, 700, 900, 1200 ],
  'Greener View': [ 300, 92, 350, 1100, 1500, 1800 ],
  'Monty Crisco': [ 250, 50, 200, 600, 800, 1000 ],
  'Purple Village': [ 240, 48, 190, 600, 800, 1000 ],
  Nobath: [ 240, 48, 190, 600, 800, 1000 ],
  'Beach Resort': [ 200, 33, 135, 400, 500, 700 ],
  'Marvin Garvens': [ 190, 48, 190, 600, 800, 1000 ],
  'Dear Gabby Inc.': [ 230, 46, 185, 600, 700, 900 ],
  'Valyent Studios': [ 300, 92, 350, 1100, 1500, 1800 ],
  'Birds vs. Squirrels': [ 170, 43, 170, 500, 700, 900 ],
  Nintendo: [ 150, 38, 150, 450, 600, 800 ],
  'Rugg Family Game Server': [ 160, 40, 160, 500, 600, 800 ],
  KFC: [ 130, 33, 130, 400, 500, 700 ],
  IHOP: [ 120, 30, 120, 350, 500, 600 ],
  'Happy Tom’s F.A.R': [ 110, 28, 110, 350, 450, 600 ],
  'Rugg Family Studios': [ 300, 92, 350, 1100, 1500, 1800 ],
  'The Regime': [ 70, 18, 70, 210, 280, 350 ],
  'Clover Sites': [ 80, 20, 80, 240, 300, 400 ],
  "Uncle Ben's": [ 90, 23, 90, 270, 350, 450 ],
  'Hoffmanhouse Estates': [ 60, 15, 60, 180, 240, 300 ],
  'Mole Commando': [ 70, 18, 70, 210, 280, 350 ],
  'Ice Mountain': [ 50, 17, 67, 200, 270, 350 ]
}
var exps = {
    Ruggabury: "Probably where the pilgrims were travelling in The Ruggabury Tales.",
    'Watery Forest': "From The Romance of Four Kingdoms: \"The second tribe, called Natan Yu, dominated the heights of Watery Forest.\"",
    'Warp Pipe': "Special property. Rent is paid for both properties if applicable.",
    'Warp Pipe ': "Special property. Rent is paid for both properties if applicable.",
    'Cavernous Cleft': "From The Romance of Four Kingdoms: \"The tribe of Liu Benn dwelt in the Cavernous Cleft beyond the arctic sea of Tiles.\"",
    'Plains of Dimm Laite': "From The Romance of Four Kingdoms: \"Finally, the plains of Dimm Laite were inhabited by the Kao Kaos.\"",
    'Hyrule Castle': "From the Link series.",
    Baron: "From Final Fantasy II.",
    Vector: "From Final Fantasy III.",
    'Greener View': "One of the four elite properties.",
    'Monty Crisco': "From The Count of Monty Crisco.",
    'Purple Village': "From The Romance of Four Kingdoms: \"Another tribe, who lived in the Purple Village, were called Liz Yung Fhang.\"",
    Nobath: "In The Ruggabury Tales, Uncle Caleb starred as The Boy of Nobath.",
    'Beach Resort': "Throwback from the original Oligarchy. Can be reached by landing on it, by landing on Airport, or by landing on Go to Airport (which takes you to Airport.)",
    "Marvin Garvens": "Misspelled property name from Monopoly. Featured in the original Oligarchy.",
    'Dear Gabby Inc.': "A RFT classic.",
    'Valyent Studios': "One of the four elite properties.",
    'Birds vs. Squirrels': "From a game we made where birds and squirrels fight.",
    Nintendo: "Mario!",
    'Rugg Family Game Server': "Better than Nintendo cause it has rewind.",
    KFC: "Part of the classic restaurant series.",
    IHOP: "This made it into a Police Diamonds story somehow.",
    'Happy Tom’s F.A.R': "The famous American restaurant.",
    'Rugg Family Studios': "One of the four elite properties.",
    'The Regime': "The Regime.",
    'Clover Sites': "Clover!",
    "Uncle Ben's": "Hey it has my name on it!",
    'Hoffmanhouse Estates': "Butler arrested for indecent exposure near Hoffmanhouse estates.",
    'Mole Commando': "Title of an article by Geoff Ruggario.",
    'Ice Mountain': "Ice Mountain!",
    'Milton Edgerton\'s Cubes of Fortune': "Player receives 10x the amount shown on dice from the bank. If it's doubles, receive 20x."
}
var printed = `Ruggabury

Rent	$92
With 1 House:  	$350
With 2 Houses:  	$1100
With 3 Houses:  	$1500
With Hotel:        	$1800

Probably where the pilgrims were traveling in The Ruggabury Tales.
Vector

Rent	$80
With 1 House:  	$300
With 2 Houses:  	$1000
With 3 Houses:  	$1300
With Hotel:        	$1600

From Final Fantasy III. Vector is the seat of the Emperor Gestahl’s power.
Baron

Rent	$75
With 1 House:  	$300
With 2 Houses:  	$900
With 3 Houses:  	$1200
With Hotel:        	$1500

From Final Fantasy II. Baron, a nation slowly changing its ways...
Hyrule Castle

Rent	$70
With 1 House:  	$280
With 2 Houses:  	$800
With 3 Houses:  	$1100
With Hotel:        	$1400

From the Link series. Home of Princess Zelda.
Watery Forest

Rent	$64
With 1 House:  	$260
With 2 Houses:  	$800
With 3 Houses:  	$1000
With Hotel:        	$1300

"The second tribe, called Natan Yu, dominated the heights of Watery Forest."
Cavernous Cleft

Rent	$62
With 1 House:  	$250
With 2 Houses:  	$700
With 3 Houses:  	$1000
With Hotel:        	$1200

"The tribe of Liu Benn dwelt in the Cavernous Cleft beyond the arctic sea of Tiles."
Plains of Dimm Laite

Rent	$58
With 1 House:  	$230
With 2 Houses:  	$700
With 3 Houses:  	$900
With Hotel:        	$1200

"Finally, the plains of Dimm Laite were inhabited by the Kao Kaos."
Greener View

Rent	$92
With 1 House:  	$350
With 2 Houses:  	$1100
With 3 Houses:  	$1500
With Hotel:        	$1800

One of the four elite properties.
Monty Crisco

Rent	$50
With 1 House:  	$200
With 2 Houses:  	$600
With 3 Houses:  	$800
With Hotel:        	$1000

From The Count of Monty Crisco.
Purple Village

Rent	$48
With 1 House:  	$190
With 2 Houses:  	$600
With 3 Houses:  	$800
With Hotel:        	$1000

"Another tribe, who lived in the Purple Village, were called Liz Yung Fhang."
Nobath

Rent	$48
With 1 House:  	$190
With 2 Houses:  	$600
With 3 Houses:  	$800
With Hotel:        	$1000

In The Ruggabury Tales, Uncle Caleb starred as The Boy of Nobath.
Beach Resort

Rent	$33
With 1 House:  	$135
With 2 Houses:  	$400
With 3 Houses:  	$500
With Hotel:        	$700

Can be reached by landing on it, by landing on Airport, or by landing on Go to Airport (which takes you to Airport.)
Marvins Garvens

Rent	$48
With 1 House:  	$190
With 2 Houses:  	$600
With 3 Houses:  	$800
With Hotel:        	$1000

Misspelled property name from Monopoly. Featured in the original Oligarchy.
Dear Gabby Inc.

Rent	$46
With 1 House:  	$185
With 2 Houses:  	$600
With 3 Houses:  	$700
With Hotel:        	$900

An RFT classic.
Valyent Studios

Rent	$92
With 1 House:  	$350
With 2 Houses:  	$1100
With 3 Houses:  	$1500
With Hotel:        	$1800

One of the four elite properties.
Birds vs. Squirrels

Rent	$43
With 1 House:  	$170
With 2 Houses:  	$500
With 3 Houses:  	$700
With Hotel:        	$900

From a game we made where birds and squirrels fight.
Nintendo

Rent	$38
With 1 House:  	$150
With 2 Houses:  	$450
With 3 Houses:  	$600
With Hotel:        	$800

Mario!
Rugg Family Game Server

Rent	$40
With 1 House:  	$160
With 2 Houses:  	$500
With 3 Houses:  	$600
With Hotel:        	$800

Better than Nintendo cause it has rewind.
KFC

Rent	$33
With 1 House:  	$130
With 2 Houses:  	$400
With 3 Houses:  	$500
With Hotel:        	$700

Part of the classic restaurant series.
IHOP

Rent	$30
With 1 House:  	$120
With 2 Houses:  	$350
With 3 Houses:  	$500
With Hotel:        	$600

This made it into a Police Diamonds story somehow.
Happy Tom’s F.A.R

Rent	$28
With 1 House:  	$110
With 2 Houses:  	$350
With 3 Houses:  	$450
With Hotel:        	$600

The “Famous American Restaurant”.
Rugg Family Studios

Rent	$92
With 1 House:  	$350
With 2 Houses:  	$1100
With 3 Houses:  	$1500
With Hotel:        	$1800

One of the four elite properties.
The Regime

Rent	$70
With 1 House:  	$18
With 2 Houses:  	$210
With 3 Houses:  	$280
With Hotel:        	$350

The Regime.
Clover Sites

Rent	$20
With 1 House:  	$80
With 2 Houses:  	$240
With 3 Houses:  	$300
With Hotel:        	$400

Clover!
Uncle Ben’s

Rent	$23
With 1 House:  	$90
With 2 Houses:  	$270
With 3 Houses:  	$350
With Hotel:        	$450

"Hey it has my name on it!"
Hoffman House Estates

Rent	$15
With 1 House:  	$60
With 2 Houses:  	$180
With 3 Houses:  	$240
With Hotel:        	$300

There once was a butler arrested for indecent exposure near Hoffmanhouse estates.
Mole Commando

Rent	$18
With 1 House:  	$70
With 2 Houses:  	$210
With 3 Houses:  	$280
With Hotel:        	$350

Title of an article by Geoff Ruggario. There is a poison will kill the mole the different animal and must do the dog.
Ice Mountain

Rent	$17
With 1 House:  	$67
With 2 Houses:  	$200
With 3 Houses:  	$270
With Hotel:        	$350

While the cheapest property in the game, any player who lands on it has to make an Ice Mountain face as well as paying rent.`
printed = printed.split("\n");
var keys = Object.keys(vals);
for(var i = 0; i < keys.length; i++) {
    var cur = keys[i];
    
}