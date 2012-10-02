Point = function(x, y)
{
	this.x = x;
	this.y = y;
}

Collision =
{
	/*
		Happened
		-- obj1 (first object)
		-- obj2 (second object)
		
		Checks if it's possible for a collision to happen between two objects using their bounding boxes.
	*/
	Happened : function(obj1, obj2)
	{
		// Returns true if the two provided objects trigger a collision
		
		// If either object doesn't have collision enabled, no collision can occur, return false
		if (typeof obj1.Collision == 'undefined' || obj1.Collision == null)
			return false;
		else if (typeof obj2.Collision == 'undefined' || obj2.Collision == null)
			return false;
		
		if (obj1.Collision.type == CollisionType.CIRCLE && obj2.Collision.type == CollisionType.CIRCLE)
		{
			if ( Math.distance(obj1.x, obj1.y, obj2.x, obj2.y) <= obj1.Collision.radius )
				return true;
		}
		else if (obj1.Collision.type == CollisionType.BOX && obj2.Collision.type == CollisionType.BOX)
		{
			if (obj1.x + obj1.Collision.origin.x + obj1.Collision.width < obj2.x + obj2.Collision.origin.x)
				return false;
			
			if (obj1.y + obj1.Collision.origin.y + obj1.Collision.height < obj2.y + obj2.Collision.origin.y)
				return false;
				
			if (obj1.x + obj1.Collision.origin.x > obj2.x + obj2.Collision.origin.x + obj2.Collision.width)
				return false;
				
			if (obj1.y + obj1.Collision.origin.y > obj2.y + obj2.Collision.origin.y + obj2.Collision.height)
				return false;
			
			return true;
		}
		
		return false;
	},

	Box : function()
	{
		var width, height;
		if (arguments.length == 1)
			width = height = arguments[0];
		else if (arguments.length == 2)
		{
			width = arguments[0];
			height = arguments[1];
		}
		else
			return [];
		
		return {
			type : CollisionType.BOX,
			origin : { x: -width / 2, y: -height / 2 },
			width : width,
			height : height
		};
	},
	
	Circle : function(radius)
	{
		return {
			type : CollisionType.CIRCLE,
			radius : radius
		};
	}
}