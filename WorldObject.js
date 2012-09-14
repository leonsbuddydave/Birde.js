POSITION_TYPE = 
{
	WORLD : 0, // Object is drawn relative to the world's coordinate space
	FIXED : 1 // Object is drawn relative to the canvas space (used for HUD and alerts)
}

// Utility function - enables classical inheritance
Object.make = function make (proto) {
	var o = Object.create(proto);
	var args = [].slice.call(arguments, 1);
	args.forEach(function (obj) {
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			o[key] = obj[key];
		});
	});
	return o;
}

function NewWorldObject()
{
	return {
		/*
			The WorldObject class is by default defined as a simple object, with the Update event undefined.
			If a WorldObject is instantiated and drawn on the screen without first overriding the Draw method,
			it will load a default sprite into memory and draw it on the screen at the object's (x, y) coordinates.
		*/
		Position :
		{
			type: POSITION_TYPE.World,
			x : 0,
			y : 0,
			z : 0 // Not Z-Value in the traditional sense - used for object layering
		},
		Children : [], // Children of this node are tied to it and will die when it does
		/*
			Update event is undefined for a blank world object - must be overridden by subclasses
			The update function is also responsible for updating its children - the world will not do that on its own
		*/
		Update : function(dt) {
			// Called every step
		},
		Draw : function(ContextCache, WorldPosition)
		{
			if (typeof this.Data.Sprite == 'undefined')
			{
				this.Data.Sprite = new Image();
				this.Data.Sprite.src = 'assets/red_ball.png';
			}	
			ContextCache[this.Position.z].drawImage(this.Data.Sprite, this.Position.x, this.Position.y);
		},
		Events : {
			me : this
		},
		Data : {} // Data object is used for any miscellaneous data storage
	};
}