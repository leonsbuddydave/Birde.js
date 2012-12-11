var Collision =
{
	init : function(props)
	{

	},

	step : function(dt)
	{
		// Here we'll check through everything registered in EventRegistry.collision
		var i = 0;
		while (i < EventRegistry.collision.length)
		{
			var j = i + 1;
			while (j < EventRegistry.collision.length)
			{
				if (this.isColliding( EventRegistry.collision[i].target, EventRegistry.collision[j].target ))
				{
					FireEventOnActor("collision", i, EventRegistry.collision[j].target);
					FireEventOnActor("collision", j, EventRegistry.collision[i].target);
				}
				j++;
			}
			i++;
		}
	},

	/**
	* Checks whether or not the two objects
	*/
	isColliding : function(one, two)
	{
		shapeOne = one.collisionShape;
		shapeTwo = two.collisionShape;

		if (shapeOne instanceof Shape.Rectangle && shapeTwo instanceof Shape.Rectangle)
		{
			return this.rectangleOnRectangle(one, two);
		}
		else if (shapeOne instanceof Shape.Circle && shapeTwo instanceof Shape.Circle)
		{
			return this.circleOnCircle(one, two);
		}
		else if (shapeOne instanceof Shape.Polygon && shapeTwo instanceof Shape.Polygon)
		{
			return this.polygonOnPolygon(one, two);
		}
		else
		{
			// what
			return false;
		}
	},

	/**
	* Check out if some hot circle-on-circle action is going on
	*/
	circleOnCircle : function(one, two)
	{
		// implemented, untested though
		shapeOne = one.collisionShape;
		shapeTwo = two.collisionShape;

		return (shapeOne.radius + shapeTwo.radius < BMath.distanceBetween( shapeOne.centerPoint, shapeTwo.centerPoint ) )
	},

	/**
	* Check out if some distinctly less-than-hot rect-on-rect action is going on
	*/
	rectangleOnRectangle : function(one, two)
	{
		shapeOne = one.collisionShape;
		shapeTwo = two.collisionShape;

		var posOne = one.getScreenPos();
		var r1 = new Shape.Rectangle( posOne.x + shapeOne.x1, posOne.y + shapeOne.y1, shapeOne.w, shapeOne.h );

		var posTwo = two.getScreenPos();
		var r2 = new Shape.Rectangle( posTwo.x + shapeTwo.x1, posTwo.y + shapeTwo.y1, shapeTwo.w, shapeTwo.h );

		// check the opposite, return the negation - much faster/simpler
		return !(
			r1.x1 > r2.x2 ||
			r1.y1 > r2.y2 ||
			r1.x2 < r2.x1 ||
			r1.y2 < r2.y1 );
	},

	/**
	* I don't give a TENTH OF A SHIT ABOUT THIS YET
	* NOT A FUCKING TENTH
	*/
	polygonOnPolygon : function(one, two)
	{
		// not implemented
		return false;
	},


	/**
	* Checks to see if the provided point is inside this shape's collision box
	*/
	containsPoint : function(actor, point)
	{
		var shape = actor.collisionShape;

		if (shape == null)
			return false;

		if (shape instanceof Shape.Rectangle)
		{
			return this.isPointInRectangle(actor, point);
		}
		else if (shape instanceof Shape.Circle)
		{
			return this.isPointInCircle(actor, point);
		}
		else if (shape instanceof Shape.Polygon)
		{
			return this.isPointInPolygon(actor, point);
		}
		else
		{
			// haha okay
			return false;
		}
	},

	/**
	* Returns true if the provided point is inside the provided rectangle
	*/
	isPointInRectangle : function(actor, point)
	{
		var shape = actor.collisionShape;

		if (shape == null)
			return false;

		var pos = actor.getScreenPos();
		var r = new Shape.Rectangle( pos.x + shape.x1, pos.y + shape.y1, shape.w, shape.h );

		return (r.x1 < point.x && r.x2 > point.x && r.y1 < point.y && r.y2 > point.y);
	},

	/**
	* Returns true if the provided poitn is inside the provided circle
	*/
	isPointInCircle : function(actor, point)
	{
		var shape = actor.collisionShape;

		if (shape == null)
			return false;

		var pos = actor.getScreenPos();

		return ( BMath.distanceBetween( shape.centerPoint, point ) < shape.radius );
	},

	/**
	* Returns true if the provided point is inside the provided polygon
	*/
	isShapeInPolygon : function(actor, point)
	{
		/**
		* Not implemented yet
		*/
		return false;
	}
}