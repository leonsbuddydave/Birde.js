/**
* Birde.Shape module
* Contains definitions for shapes - used primarily for collision.
*/

var Shape =
{
	/**
	* Vague definition for a polygon of any number of points.
	*/
	Polygon : function()
	{
		// Arguments object should contain all points
		this.points = Array.prototype.slice.call(arguments);
	},

	/*
	*	Rectangle, or a fancy version of a polygon
	*/
	Rectangle : function(x, y, w, h)
	{

		this.prototype = new Shape.Polygon();

		this.x1 = x;
		this.y1 = y;
		this.x2 = x + w;
		this.y2 = y + h;
		
		this.w = w;
		this.h = h;
	},

	/*
	* Circle object - used for extremely cheap but less accurate collision detection.
	*/
	Circle : function(radius)
	{
		this.prototype = new Shape.Polygon();
		this.radius = radius;

		this.centerPoint = new Point(radius, radius);
	}
}