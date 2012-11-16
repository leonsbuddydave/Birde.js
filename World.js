World =
{
	SceneGraph : [],
	
	x : 0,
	y : 0,
	
	GetClass : function(Class)
	{
		if (typeof Class == 'undefined' || Class == null || Class == "")
			return;
			
		var Matches = [];
		
		for (var obj in this.SceneGraph)
		{
			if (this.SceneGraph[obj].Class == Class)
				Matches.push( this.SceneGraph[obj] );
		}
		
		return Matches;
	},

	ApplyToClass : function(Class, Action)
	{
		// Action should be a method that takes a worldobject argument
		var i = 0;
		var Instances = this.GetClass(Class);
		while (i < Instances.length)
		{
			Action(Instances[i]);
			i++;
		}
	},
	
	Add : function()
	{
		if (arguments.length == 0)
			return this;

		for (var obj in arguments)
		{
			// Registers an object for events and then pushes it onto the scene graph
			//arguments[obj].Init( arguments[obj] );
			EventDelegate.RegisterObject( arguments[obj] );
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