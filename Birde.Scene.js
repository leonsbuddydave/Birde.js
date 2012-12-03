var Scene = function()
{
	this.Position =
	{
		x : 0,
		y : 0
	}

	this.graph = [];

	this.id_map = {};

	this.class_map = {};

	this.changed = false;

	this.Cache = new Cache();

	/**
	* Returns the first actor in the scene with the given id. Since IDs are supposed to be unique, we're not going
	* to be checking that they are and just assume the first one we find is the only one and return.
	*/
	this.SelectById = function(id)
	{
		// it doesn't make any sense to cache ID requests - they're supposed to be unique and will be
		// "cached" in id_map when it's added to the graph
		if (typeof this.id_map[id] !== 'undefined')
			return new ActorGroup( this.graph[ this.id_map[ id ] ] );

		return new ActorGroup();
	}

	/**
	* Returns all elements matching a given class.
	*/
	this.SelectByClass = function(c)
	{
		if (!this.hasChanged())
			return this.getCachedQuery(c);

		var result = new ActorGroup();

		if (typeof this.class_map[c] == 'undefined' || this.class_map[c].length == 0)
			return result;
		else
		{
			var i = 0;
			while (i < this.class_map[c].length)
			{
				result.push( this.graph[ this.class_map[c][i] ] );
				i++;
			}

			this.Cache.SaveQuery(c, result);

			return result;
		}
	}

	/** 
	* Maintains a cache of all queries performed on the scene
	* if we pass in a selector that we've used recently and the scene hasn't changed since then,
	* we can return the same result
	*/
	this.Cache.Queries = {}

	/**
	* Adds a completed query to the cache for future reference
	*/
	this.Cache.SaveQuery = function(selector, result)
	{
		this.Queries[selector] = result;
	}

	/**
	* Returns the cached query if it exists and the scene hasn't changed
	* Otherwise returns null  
	*/
	this.getCachedQuery = function(selector)
	{
		if (typeof this.Cache.Queries[selector] !== 'undefined' && !this.hasChanged())
		{
			console.log("Hell yeah, returning cached query.");
			return this.Cache.Queries[selector];
		}

		return null;
	}

	/**
	* Adds an actor to this Scene
	*/
	this.Add = function(actor)
	{
		var ActorIndex = this.graph.push(actor) - 1;
		this.id_map[actor.id] = ActorIndex;

		for (var classKey in actor.class)
		{
			var currentClass = actor.class[classKey];
			if (typeof this.class_map[currentClass] == 'undefined')
				this.class_map[currentClass] = [];

			this.class_map[currentClass].push(ActorIndex);
		}

		Drawing.Cache.invalidate();

		this.changed = true;

		return new ActorGroup( this.graph[ActorIndex] );
	}

	/**
	* Returns whether or not the scene has changed since we last checked
	*/
	this.hasChanged = function()
	{
		var hasChanged = this.changed;
		this.changed = false;
		return hasChanged;
	}
}