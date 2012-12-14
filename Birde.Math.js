/**
* Bird math. Implements all general math functions that we need.
* Bird-style.
*/
var BMath =
{
	/**
	* BMath constants
	*/
	TAU : Math.PI * 2,

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
			y2 = y1.y;
			x2 = y1.x;
			y1 = x1.y;
			x1 = x1.x;
		}

		return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
	},

	/**
	* Returns the provided number constrained to bounds
	*/
	clamp : function(num, min, max)
	{
		if (num < min)
			return min;
		if (num > max)
			return max;

		return num;
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
		this.x = arguments[0].x;
		this.y = arguments[1].y;
	}
	else
	{
		this.x = x;
		this.y = y;
	}	
}

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
	return this;
}

/**
* See the comment for Point.prototype.setX
*/
Point.prototype.setY = function(y)
{
	this.y = y;
	return this;
}

/**
* Vector class
*/
var Vector2 = function(x, y)
{
	x = x || 0;
	y = y || 0;

	this.x = x;
	this.y = y;
}

/**
* Adds another vector to this one
*/
Vector2.prototype.add = function(v)
{
	if (arguments.length == 2)
		v = new Vector2(arguments[0], arguments[1]);

	if ( !(v instanceof Vector2) )
	{
		b.log("Not a vector.");
		return this;
	}

	return ( new Vector2( this.x + v.x, this.y + v.y ) );
}