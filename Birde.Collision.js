var Collision =
{
	init : function(props)
	{

	},

	step : function(dt)
	{
		for (var key in EventRegistry.collision)
		{
			var a = EventRegistry.collision[key];
			//console.log("Checking " + a.target.id + " for collision.");
		}
	},

	isColliding : function(one, two)
	{
		if (one.type == "rectangle" && two.type == "rectangle")
		{
			return this.rectangleOnRectangle(one, two);
		}
		else if (one.type == "circle" && two.type == "circle")
		{
			return this.circleOnCircle(one, two);
		}
		else if (one.type == "polygon" && two.type == "polygon")
		{
			return this.polygonOnPolygon(one, two);
		}
	},

	circleOnCircle : function(one, two)
	{
		// not implemented
		return false;
	},

	rectangleOnRectangle : function(one, two)
	{
		if (one.x2 < two.x1)
			return false;
		if (one.y2 < two.y1)
			return false;
		if (one.x1 > two.x2)
			return false;
		if (one.y1 > two.y2)
			return false;

		return true;
	},

	polygonOnPolygon : function(one, two)
	{
		// not implemented
		return false;
	}
}