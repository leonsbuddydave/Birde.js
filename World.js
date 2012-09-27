World =
{
	SceneGraph : [],
	ClassIndex :
	{
		GENERIC : []
	},
	Position :
	{
		// X and Y world positions determine the world's position relative to the canvas
		// in turn, elements in SceneGraph will be affected
		x : 0,
		y : 0
	},
	RegisterClass : function(Obj)
	{
		if (typeof this.ClassIndex[Obj.Class] == 'undefined' || this.ClassIndex[Obj.Class] == null)
			this.ClassIndex[Obj.Class] = [];
			
		this.ClassIndex[Obj.Class].push( Obj );
	},
	Add : function()
	{
		if (arguments.length == 0)
			return this;
		for (var obj in arguments)
		{
			// Registers an object for events and then pushes it onto the scene graph
			EventDelegate.RegisterObject( arguments[obj] );
			this.RegisterClass( arguments[obj] );
			this.SceneGraph.push( arguments[obj] );
			this.SceneGraph.sort(this.ZCompare);
		}
		return this;
	},
	ZCompare : function(a, b)
	{
		if (a.z > b.z)
			return -1;
		else if (a.z < b.z)
			return 1;
		return 0;
	}
}