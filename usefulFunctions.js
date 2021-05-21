function getDistance(x1,y1,x2,y2) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}
function pointInTriangle(point, triangle) {
    //compute vectors & dot products
    var cx = point[0], cy = point[1],
        t0 = triangle[0], t1 = triangle[1], t2 = triangle[2],
        v0x = t2[0]-t0[0], v0y = t2[1]-t0[1],
        v1x = t1[0]-t0[0], v1y = t1[1]-t0[1],
        v2x = cx-t0[0], v2y = cy-t0[1],
        dot00 = v0x*v0x + v0y*v0y,
        dot01 = v0x*v1x + v0y*v1y,
        dot02 = v0x*v2x + v0y*v2y,
        dot11 = v1x*v1x + v1y*v1y,
        dot12 = v1x*v2x + v1y*v2y

    // Compute barycentric coordinates
    var b = (dot00 * dot11 - dot01 * dot01),
        inv = b === 0 ? 0 : (1 / b),
        u = (dot11*dot02 - dot01*dot12) * inv,
        v = (dot00*dot12 - dot01*dot02) * inv
    return u>=0 && v>=0 && (u+v < 1)
}
function pointCircleCollision(point, circle, r) {
    if (r===0) return false
    var dx = circle[0] - point[0]
    var dy = circle[1] - point[1]
    return dx * dx + dy * dy <= r * r
}
function lineCircleCollide(a, b, circle, radius, nearest) {
    //check to see if start or end points lie within circle 
    if (pointCircleCollide(a, circle, radius)) {
        if (nearest) {
            nearest[0] = a[0]
            nearest[1] = a[1]
        }
        return true
    } if (pointCircleCollide(b, circle, radius)) {
        if (nearest) {
            nearest[0] = b[0]
            nearest[1] = b[1]
        }
        return true
    }
    
    var x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1],
        cx = circle[0],
        cy = circle[1]

    //vector d
    var dx = x2 - x1
    var dy = y2 - y1
    
    //vector lc
    var lcx = cx - x1
    var lcy = cy - y1
    
    //project lc onto d, resulting in vector p
    var dLen2 = dx * dx + dy * dy //len2 of d
    var px = dx
    var py = dy
    if (dLen2 > 0) {
        var dp = (lcx * dx + lcy * dy) / dLen2
        px *= dp
        py *= dp
    }
    
    if (!nearest)
        nearest = tmp
    nearest[0] = x1 + px
    nearest[1] = y1 + py
    
    //len2 of p
    var pLen2 = px * px + py * py
    
    //check collision
    return pointCircleCollide(nearest, circle, radius)
            && pLen2 <= dLen2 && (px * dx + py * dy) >= 0
}
function circleInTriangle(){
    if (pointInTriangle(circle, triangle))
        return true
    if (lineCollide(triangle[0], triangle[1], circle, radius))
        return true
    if (lineCollide(triangle[1], triangle[2], circle, radius))
        return true
    if (lineCollide(triangle[2], triangle[0], circle, radius))
        return true
    return false
}
function pointTowards(x1,y1,x2,y2) {
    var xDiff = x1 - x2;
    var yDiff = y1 - y2;
    var degree = Math.atan(yDiff/xDiff) * (-180/Math.PI);
    if(xDiff > 0 && yDiff > 0) {
        degree *= -1*-1;
        degree += 90;
    } else if(xDiff < 0 && yDiff > 0) {
        degree -= 90;
    } else if(xDiff >= 0 && yDiff < 0) {
        degree += 90;
    } else if(xDiff < 0 && yDiff < 0) {
        degree += 270;
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