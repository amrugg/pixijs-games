function inside(point, vs) {

    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
function isInside(polygon,n,p)
{
    let INF = 10000;
    class Point
    {
        constructor(x,y)
        {
            this.x = x;
            this.y = y;
        }
    }
    // There must be at least 3 vertices in polygon[]
    if (n < 3)
    {
        return false;
    }

    // Create a point for line segment from p to infinite
    let extreme = new Point(INF, p.y);

    // Count intersections of the above line
    // with sides of polygon
    let count = 0, i = 0;
    do
    {
        let next = (i + 1) % n;

        // Check if the line segment from 'p' to
        // 'extreme' intersects with the line
        // segment from 'polygon[i]' to 'polygon[next]'
        if (doIntersect(polygon[i], polygon[next], p, extreme))
        {
            // If the point 'p' is colinear with line
            // segment 'i-next', then check if it lies
            // on segment. If it lies, return true, otherwise false
            if (orientation(polygon[i], p, polygon[next]) == 0)
            {
                return onSegment(polygon[i], p,
                                polygon[next]);
            }

            count++;
        }
        i = next;
    } while (i != 0);

    // Return true if count is odd, false otherwise
    return (count % 2 == 1); // Same as (count%2 == 1)
}
function getDistance(x1,y1,x2,y2) {
    /// Mine
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}
Math.probability = function(percent,oneoneHundred){
    if(oneoneHundred) {
        return percent > Math.random();
    } else {
        return percent > Math.random() * 100;
    }
}
function generalCommonDenominator(a,b) {
    if(a == 0) {
        return b;
    }
    if(b == 0) {
        return a;
    }
    var r = a%b;
    return generalCommonDenominator(b,r)
}
function findVectorFromImpulse(x,y) {
    var distance = Math.sqrt(x**2+y**2);
    var direction = Math.atan(y/x) * 180/Math.PI;
    if(x < 0 && y >= 0) {
        direction += 180;
    }
    if(x < 0 && y < 0) {
        direction += 180;
    }
    if(y < 0 && x >= 0) {
        direction += 360;
    }
    return {force:distance,direction:direction};
}
function rotatePoint(pointX, pointY, originX, originY, angle, degrees) {
    /// https://stackoverflow.com/questions/4465931/rotate-rectangle-around-a-point
    if(degrees) {
        angle = angle * Math.PI / 180.0;
    }
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}
function lineCollide(a, b, circle, radius, nearest) {
    /// https://github.com/mattdesl/line-circle-collision/blob/master/index.js
    var tmp = [0, 0];
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
function pointCircleCollide(point, circle, r) {
    /// https://github.com/mattdesl/point-circle-collision/blob/master/index.js
    if (r===0) return false
    var dx = circle[0] - point[0]
    var dy = circle[1] - point[1]
    return dx * dx + dy * dy <= r * r
}
function circleInTriangle(triangle, circle, radius) {
    /// https://github.com/mattdesl/triangle-circle-collision/blob/master/index.js
    if (lineCollide(triangle[0], triangle[1], circle, radius))
        return true
    if (lineCollide(triangle[1], triangle[2], circle, radius))
        return true
    if (lineCollide(triangle[2], triangle[0], circle, radius))
        return true
    return false
}
function circleInRectangle(rectangle, circle, radius){
    /// Adapted
    if (lineCollide(rectangle[0], rectangle[1], circle, radius))
        return true
    if (lineCollide(rectangle[1], rectangle[2], circle, radius))
        return true
    if (lineCollide(rectangle[2], rectangle[3], circle, radius))
        return true
    if(lineCollide(rectangle[3], rectangle[0], circle, radius))
        return true;    
    return false
}
function pointTowards(x1,y1,x2,y2) {
    /// Mine
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
function randNum(min, max) {
    if(max === undefined) {
        max = min;
        min = 1;
    }
    var num = (Math.random() * (max - min)) + min;
    return num;
}
function direction(distance,angle) {
    angle = (angle * Math.PI) / 180;
    var x = 0;
    var y = 0;
    x = Math.sin(angle) * distance;
    y = Math.cos(angle) * distance
    var radianRotation = (angle * Math.PI) / 180;
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
function lineDirection(a,b,c){
    var val = (b.y-a.y)*(c.x-b.x)-(b.x-a.x)*(c.y-b.y);
    if(val == 0) {
        return 0;
    } else if(val < 0) {
        return 2;
    }
    return 1;
}
function pointOnLine(l1, p) {   //check whether p is on the line or not
    if(p.x <= Math.max(l1.p1.x, l1.p2.x) && p.x <= Math.min(l1.p1.x, l1.p2.x) && (p.y <= Math.max(l1.p1.y, l1.p2.y) && p.y <= Math.min(l1.p1.y, l1.p2.y)))
       return true;
    return false;
 }
 function lineCollideLine(l1,l2){
    var dir1 = lineDirection(l1.p1, l1.p2, l2.p1);
    var dir2 = lineDirection(l1.p1, l1.p2, l2.p2);
    var dir3 = lineDirection(l2.p1, l2.p2, l1.p1);
    var dir4 = lineDirection(l2.p1, l2.p2, l1.p2);
    if(dir1 != dir2 && dir3 != dir4) {
        return true;
    }
    if(dir1 != dir2 && dir3 != dir4)
        return true; //they are intersecting
    if(dir1==0 && pointOnLine(l1, l2.p1)) //when p2 of line2 are on the line1
        return true;
    if(dir2==0 && pointOnLine(l1, l2.p2)) //when p1 of line2 are on the line1
        return true;
    if(dir3==0 && pointOnLine(l2, l1.p1)) //when p2 of line1 are on the line2
        return true;
    if(dir4==0 && pointOnLine(l2, l1.p2)) //when p1 of line1 are on the line2
        return true;
    return false;
}
/*var line1, line2;
line1 = {p1:{x:0,y:0},p2:{x:5,y:5}};
line2 = {p1:{x:2,y:-10},p2:{x:3,y:10}};
line1 = {p1:{x:0,y:0},p2:{x:1,y:0}}
line2 = {p1:{x:1,y:1},p2:{x:1,y:-1}}
var test = randNum;
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(test(-0.5,0.5));
console.log(gcd(270,192))*/