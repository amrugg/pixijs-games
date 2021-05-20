function pointTowards(x1,y1,x2,y2) {
    var xDiff = x1 - x2;
    var yDiff = y1 - y2;
    var degree = Math.atan(yDiff/xDiff) * (-180/Math.PI);
    console.log(xDiff,yDiff);
    if(xDiff > 0 && yDiff > 0) {
        console.log("To the Upper Left");
        degree *= -1*-1;
        degree += 90;
    } else if(xDiff < 0 && yDiff > 0) {
        degree -= 90;
        console.log("To the Upper Right");
    } else if(xDiff >= 0 && yDiff < 0) {
        degree += 90;
        console.log("To The Bottom Left");
    } else if(xDiff < 0 && yDiff < 0) {
        degree += 270;
        console.log("To the Bottom Right");
    }
    return degree;
}
function randInt(min, max) {
    if(max === undefined) {
      max = min
      min = 1
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function direction(distance,angle) {
    angle = (angle * Math.PI) / 180;
    var x = 0;
    var y = 0;
    x = Math.sin(angle) * distance;
    y = Math.cos(angle) * distance
    var radianRotation = (angle * Math.PI) / 180
    return({r:x, u:y});
}
function pointInDirection(degrees) {
    return (((degrees) * Math.PI * -1) / 180)
}
function hitTestRectangle(r1, r2, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx + offsetX) < combinedHalfWidths) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy +offsetY) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
        } else {

        //There's no collision on the y axis
        hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};
console.log(pointTowards(0,0,1,-1));