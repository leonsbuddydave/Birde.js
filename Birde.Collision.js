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
		if ( !(one instanceof Actor) || !(two instanceof Actor) )
		{
			b.log("Birde.Collision.js : Collision.isColliding : Invalid argument.");
			return false;
		}
		else if (one === two)
		{
			// make sure we aren't comparing an actor against itself.
			return false;
		}

		var shapeOne = one.collisionShape;
		var shapeTwo = two.collisionShape;

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

		/**
		* These two are conditional flops of each other
		*/
		else if (shapeOne instanceof Shape.Circle && shapeTwo instanceof Shape.Rectangle)
		{
			return this.circleOnRectangle(one, two);
		}
		else if (shapeOne instanceof Shape.Rectangle && shapeTwo instanceof Shape.Circle)
		{
			return this.circleOnRectangle(two, one);
		}


		else
		{
			// what
			return false;
		}
	},

	/**
	* Does circle-on-rectangle collisions if we need it
	*/
	circleOnRectangle : function(circleActor, rectangleActor)
	{
		if ( !(circleActor instanceof Actor) || !(rectangleActor instanceof Actor) )
		{
			b.log("Birde.Collision.js : Collision.circleOnRectangle : Invalid argument.");
			return false;
		}

		var circle = circleActor.collisionShape;
		var rectangle = rectangleActor.collisionShape;

		var pos = circleActor.getScreenPos();
		var testPoint = new Point( pos.x + circle.centerPoint.x, pos.y + circle.centerPoint.y );

		if (this.isPointInRectangle( rectangleActor, testPoint ))
			return true;
		else
		{
			return false;
		}
	},

	/**
	* Check out if some hot circle-on-circle action is going on
	* This method is as-of-yet untested, so, fuck it.
	*/
	circleOnCircle : function(one, two)
	{
		if (!(one instanceof Actor) || !(two instanceof Actor))
		{
			b.log("Birde.Collision.js : Collision.circleOnCircle : Invalid argument.");
			return false;
		}

		var shapeOne = one.collisionShape;
		var shapeTwo = two.collisionShape;

		return (shapeOne.radius + shapeTwo.radius < BMath.distanceBetween( shapeOne.centerPoint, shapeTwo.centerPoint ) )
	},

	/**
	* Check out if some distinctly less-than-hot rect-on-rect action is going on
	*/
	rectangleOnRectangle : function(one, two)
	{
		if (!(one instanceof Actor) || !(two instanceof Actor))
		{
			b.log("Birde.Collision.js : Collision.rectangleOnRectangle : Invalid argument.");
			return false;
		}

		var shapeOne = one.collisionShape;
		var shapeTwo = two.collisionShape;

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
	* SHIT
	*/
	polygonOnPolygon : function(one, two)
	{
		b.log("Birde.Collision.js : Collision.polygonOnPolygon : Not implemented.");
		return false;
	},


	/**
	* Checks to see if the provided point is inside this shape's collision box
	*/
	containsPoint : function(actor, point)
	{
		if (! (actor instanceof Actor) || ! (point instanceof Point))
		{
			b.log("Birde.Collision.js : Collision.containsPoint : Invalid argument.");
			return false;
		}

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
		if (! (actor instanceof Actor) || ! (point instanceof Point))
		{
			b.log("Birde.Collision.js : Collision.isPointInRectangle : Invalid argument.");
			return false;
		}

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
		if (! (actor instanceof Actor) || ! (point instanceof Point))
		{
			b.log("Birde.Collision.js : Collision.isPointInCircle : Invalid argument.");
			return false;
		}

		var shape = actor.collisionShape;

		if (shape == null)
			return false;

		var pos = actor.getScreenPos();

		return ( BMath.distanceBetween( shape.centerPoint, point ) < shape.radius );
	},

	/**
	* Returns true if the provided point is inside the provided polygon
	*/
	isPointInPolygon : function(actor, point)
	{
		/**
		* Not implemented yet
		*/

		b.log("Birde.Collision.js : Collision.isPointInPolygon : Not implemented.");

		return false;
	}
}