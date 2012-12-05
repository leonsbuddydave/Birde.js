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

	isColliding : function(one, two)
	{
		shapeOne = one.collisionShape;
		shapeTwo = two.collisionShape;

		if (shapeOne.type == "rectangle" && shapeTwo.type == "rectangle")
		{
			return this.rectangleOnRectangle(one, two);
		}
		else if (shapeOne.type == "circle" && shapeTwo.type == "circle")
		{
			return this.circleOnCircle(one, two);
		}
		else if (shapeOne.type == "polygon" && shapeTwo.type == "polygon")
		{
			return this.polygonOnPolygon(one, two);
		}
		else
		{
			// what
			return false;
		}
	},

	circleOnCircle : function(one, two)
	{
		// implemented, untested though
		shapeOne = one.collisionShape;
		shapeTwo = two.collisionShape;

		return (shapeOne.radius + shapeTwo.radius < BMath.distanceBetween( shapeOne.centerPoint, shapeTwo.centerPoint ) )
	},

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

	polygonOnPolygon : function(one, two)
	{
		// not implemented
		return false;
	}
}