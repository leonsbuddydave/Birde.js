Point = function(x, y)
{
	this.x = x;
	this.y = y;
}

Collision =
{
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
			points :
			[
				new Point( -width / 2, -height / 2 ),
				new Point( width / 2, -height / 2 ),
				new Point( width / 2, height / 2 ),
				new Point( -width / 2, height / 2 )
			]
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