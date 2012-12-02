Point = function(x, y)
{
	this.x = x;
	this.y = y;
	
	this.Shift = function(point)
	{
		// Non-destructive shift, returns new point
		return new Point(this.x + point.x, this.y + point.y);
	}
}

PointKernel = [
	new Point(-1, -1),
	new Point(0, -1),
	new Point(1, -1),
	new Point(-1, 0),
	new Point(1, 0),
	new Point(-1, 1),
	new Point(0, 1),
	new Point(1, 1)
];

Collision =
{
	ContainsPoint : function(obj, p)
	{
		if (typeof obj.Collision == 'undefined' || obj.Collision == null)
			return false;

		// TODO : Take into account object scaling
		if (obj.Collision.type == CollisionType.BOX)
		{
			if (p.x > obj.x + obj.Collision.origin.x &&
				p.x < obj.x + obj.Collision.origin.x + obj.Collision.width &&
				p.y > obj.y + obj.Collision.origin.y &&
				p.y < obj.y + obj.Collision.origin.y + obj.Collision.height)
				return true;

			return false;
		}
		else
		{
			return false;
		}
	},
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
		
		// Circular collision is easy as balls - compares the distance between objects against the 
		// combined radii of both objects
		if (obj1.Collision.type == CollisionType.CIRCLE && obj2.Collision.type == CollisionType.CIRCLE)
		{
			if ( Math.distance(obj1.x, obj1.y, obj2.x, obj2.y) <= obj1.Collision.radius * obj1.Scale + obj2.Collision.radius * obj2.Scale)
				return true;
		}
		// Collision between box objects - checks the inverse and returns the negation of the result
		else if (obj1.Collision.type == CollisionType.BOX && obj2.Collision.type == CollisionType.BOX)
		{
			if (obj1.x + obj1.Collision.origin.x * obj1.Scale + obj1.Collision.width * obj1.Scale < obj2.x + obj2.Collision.origin.x * obj2.Scale)
				return false;
			
			if (obj1.y + obj1.Collision.origin.y * obj1.Scale + obj1.Collision.height * obj1.Scale < obj2.y + obj2.Collision.origin.y * obj2.Scale)
				return false;
				
			if (obj1.x + obj1.Collision.origin.x * obj1.Scale > obj2.x + obj2.Collision.origin.x * obj2.Scale + obj2.Collision.width * obj2.Scale)
				return false;
				
			if (obj1.y + obj1.Collision.origin.y * obj1.Scale > obj2.y + obj2.Collision.origin.y * obj2.Scale + obj2.Collision.height * obj2.Scale)
				return false;
			
			return true;
		}
		
		return false;
	},

	// Builds a collision box for an object
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
			return {};
		
		return {
			type : CollisionType.BOX,
			origin : { x: 0 , y: 0 },
			width : width,
			height : height
		};
	},
	
	// Builds and returns a collision circle for an object
	Circle : function(radius)
	{
		return {
			type : CollisionType.CIRCLE,
			radius : radius
		};
	},

	FromMask : function(MaskImage, MaskColor)
	{
		// MaskColor is the color we're _removing_ from the collision spectrum
		if (typeof MaskColor == 'undefined' || MaskColor == null)
			MaskColor = new ColorRGBA(0, 0, 0, 0);
		
		if (typeof MaskImage == 'string')
		{
			// We got the src
			var TempImage = new Image();
			TempImage.src = MaskImage;
			MaskImage = TempImage;
		}
		else if (typeof MaskImage != 'object')
		{
			// If it's not a string, and not an object, what?
			// Fail to do anything
			return {};
		}
		
		var width = MaskImage.width;
		var height = MaskImage.height;
		
		var MaskCanvas = document.createElement("canvas");
		MaskCanvas.width = width;
		MaskCanvas.height = height;
		
		var MCtx = MaskCanvas.getContext('2d');
		MCtx.drawImage( MaskImage, 0, 0 );
		
		var MaskData = MCtx.getImageData(0, 0, width, height);

		this.PolymapFromMaskData(MaskData, MaskColor);
	},
	
	PolymapFromMaskData : function(MaskData, MaskColor)
	{
		// MaskColor is the "background" of the mask
		console.log("Building polymap from mask data.");
		
		var PointMap = Array2D.New(MASK.BACKGROUND, MaskData.width, MaskData.height);
		
		var x = 0;
		var y = 0;
		while (y < MaskData.height)
		{
			while (x < MaskData.width)
			{
				
				var colorStart = y * MaskData.width * 4 + x * 4;
				var r = MaskData.data[ colorStart++ ];
				var g = MaskData.data[ colorStart++ ];
				var b = MaskData.data[ colorStart++ ];
				var a = MaskData.data[ colorStart ];
				
				var PointCol = new ColorRGBA( r, g, b, a );
				
				if (!PointCol.Equals(MaskColor))
				{
					// different colors, add to map
					// console.log("Adding to map!");
					PointMap[x][y] = MASK.FOREGROUND;
				}
				
				// return false;
				
				x++;
			}
			x = 0;
			y++;
		}

		x = 0, y = 0;
		
		var TempMap = Array2D.Copy(PointMap);
		
		while ( x < PointMap.length )
		{
			while ( y < PointMap[0].length )
			{
				// Perform surrounding check here, clear point if needed
				if (this.IsSurrounded(PointMap, new Point(x, y)))
					TempMap[x][y] = MASK.BACKGROUND;
				y++;
			}
			y = 0;
			x++;
		}
		
		var Points = this.RemoveExtraPoints( this.MaskArrayToPointArray( TempMap ) );
		
		console.log(Points);
		this.PrintMask(TempMap);
	},
	
	MaskArrayToPointArray : function(MaskArray)
	{
		var PointArray = [];
		
		var x = 0
		var y = 0;
		
		while ( x < MaskArray.length )
		{
			while ( y < MaskArray[0].length )
			{
				if ( MaskArray[x][y] == MASK.FOREGROUND )
					PointArray.push( new Point(x, y) );
					
				y++;
			}
			y = 0;
			x++;
		}
		
		return PointArray;
	},
	
	RemoveExtraPoints : function(PointArray)
	{
		// Removes unnecessary points from the polygon mask
		var CleanPointArray = [];
		var i = 0;
		while (i < PointArray.length)
		{
			var CurrentPoint = PointArray[i];
			var PreviousPoint, NextPoint;
			if (i == 0)
			{
				PreviousPoint = PointArray[ PointArray.length - 1 ];
				NextPoint = PointArray[1];
			}
			else if (i == PointArray.length - 1)
			{
				PreviousPoint = PointArray[ PointArray.length - 2 ];
				NextPoint = PointArray[0];
			}
			else
			{
				PreviousPoint = PointArray[ i - 1 ];
				NextPoint = PointArray[ i + 1 ];
			}
			
			if (
				PreviousPoint.x != CurrentPoint.x ||
				PreviousPoint.y != CurrentPoint.y ||
				NextPoint.x != CurrentPoint.x ||
				NextPoint.y != CurrentPoint.y
			)
			{
				CleanPointArray.push( CurrentPoint );
			}
			
			i++;
		}
		
		return CleanPointArray;
	},
	
	PrintMask : function(MaskArray)
	{
		var output = "";
		x = 0, y = 0;
		while (x < MaskArray.length)
		{
			while (y < MaskArray[0].length)
			{
				output += MaskArray[x][y];
				y++;
			}
			output += "\n";
			y = 0;
			x++;
		}
		console.log(output);
	},
	
	IsSurrounded : function(Map, MyPoint)
	{
		// Checks to see if a point is surrounded by 6 or more similar points
		if (Map[MyPoint.x][MyPoint.y] == MASK.BACKGROUND)
			return false;
			
		var count = 0;
		
		// Uses the PointKernel array to determine if a given point is surrounded by other points 
		var i = 0;
		while (i < PointKernel.length)
		{
			var p = MyPoint.Shift( PointKernel[i] );
			
			if (p.x < 0 || p.x >= Map.length || p.y < 0 || p.y >= Map[0].length)
			{
				i++;
			}
			else
			{
				if ( Map[p.x][p.y] == MASK.FOREGROUND )
				{
					count++;
					i++;
				}
				else
				{
					i++;
				}
			}
		}
		
		if (count > 6)
		{
			return true;
		}
		
		return false;
	}
}
