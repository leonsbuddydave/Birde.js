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

/*
	Math.simpleAngleBetween
	
	Returns the angle between two objects (between 0 and PI / 2)
*/
Math.simpleAngleBetween = function(x1, y1, x2, y2)
{
	return this.atan( (y2 - y1) / (x2 - x1) );
}

/*
	Math.fullAngleBetween
	
	Returns the full circle angle between the two objects (between 0 and 2PI)
*/
Math.fullAngleBetween = function(x1, y1, x2, y2)
{
	var slopeX = x2 - x1;
	var slopeY = y2 - y1;
	
	// Quadrant numbers are offset -1 from their usual
	var quadrant = 0;
	
	if (slopeX < 0)
	{
		if (slopeY < 0)
			quadrant = 0;
		else //(slopeY > 0)
			quadrant = 3;
	}
	else if (slopeX > 0)
	{
		if (slopeY < 0)
			quadrant = 1;
		else // slopeY > 0
			quadrant = 2;
	}
	
	console.log("Quadrant:" + quadrant);
	
	return this.atan( this.abs(y2 - y1) / this.abs(x2 - x1) ) + quadrant * this.PI / 2;
}