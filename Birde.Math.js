/**
* Bird math. Implements all general math functions that we need.
*/
var BMath =
{
	/**
	* Converts radians to degrees.
	*/
	radToDeg : function(x)
	{
		return x * 180 / Math.PI;
	},

	/**
	* Converts degrees to radians.
	*/
	degToRad : function(x)
	{
		return x * Math.PI / 180;
	},

	/**
	* Finds the distance between two points
	*/
	distanceBetween : function(x1, y1, x2, y2)
	{
		if (arguments.length == 2)
		{
			// Points were passed as arguments, not individual coordinates
			x1 = arguments[0].x;
			y1 = arguments[0].y;
			x2 = arguments[1].x;
			y2 = arguments[1].y;
		}

		return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
	}
}