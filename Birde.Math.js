/**
* Bird math. Implements all general math functions that we need.
* Bird-style.
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


/**
* It holds coordinates
* that's the whole Point
*
* Considering moving Point to its own file just for cleanliness' sake.
*/
var Point =  function(x, y)
{
	if (arguments[0] instanceof Point)
	{
		this[0] = arguments[0].x;
		this[1] = arguments[1].y;
	}
	else
	{
		this[0] = x;
		this[1] = y;
	}
	
	this.x = this[0];
	this.y = this[1];
}

Point.prototype = new Array();

/**
* Method for translating a point
*/
Point.prototype.translate = function(x, y)
{
	// also except other Points as an argument
	if (arguments[0] instanceof Point)
	{
		x = arguments[0].x;
		y = arguments[1].y;
	}

	this.setX(this.x + x);
	this.setY(this.y + y);

	return this;
}

/**
* Method for setting the X value of the point - using a setter
* so we can affect both the explicit x value and the indexed version
*/
Point.prototype.setX = function(x)
{
	this.x = x;
	this[0] = x;

	return this;
}

/**
* See the comment for Point.prototype.setX
*/
Point.prototype.setY = function(y)
{
	this.y = y;
	this[1] = y;

	return this;
}