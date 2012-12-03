/**
* Birde.Geometry module
* Contains definitions for shapes - used primarily for collision.
*/

var Geometry =
{
	/**
	* Vague definition for a polygon of any number of points.
	*/
	Polygon : function()
	{
		// Arguments object should contain all points
		this.points = Array.prototype.slice.call(arguments);

		this.type = "polygon";
	},

	/*
	*	Rectangle, or a fancy version of a polygon
	*/
	Rectangle : function(x, y, w, h)
	{

		this.prototype = new Geometry.Polygon();

		this.points = new Geometry.Polygon(x, y, x + w, x + h).points;

		this.type = "rectangle";
	},

	/*
	* Circle object - used for extremely cheap but less accurate collision detection.
	*/
	Circle : function(radius)
	{
		this.prototype = new Geometry.Polygon();

		this.radius = radius;

		this.type = "circle";
	}
}