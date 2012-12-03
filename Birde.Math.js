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
	}
}