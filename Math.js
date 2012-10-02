/*
	Math.slope
	
	Returns the slope between two points as an object. (unsimplified)
*/
Math.slope = function(x1, y1, x2, y2)
{
	var SlopeX = x2 - x1;
	var SlopeY = y2 - y1;
	return { x: SlopeX, y: SlopeY }
}

/*
	Math.distance
	
	Returns the hypotenuse of a right triangle formed by two points
*/
Math.distance = function(x1, y1, x2, y2)
{
	var a = x2 - x1;
	var b = y2 - y1;
	
	return this.sqrt( this.pow(a, 2) + this.pow(b, 2) );
}