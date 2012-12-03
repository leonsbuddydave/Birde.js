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

	this.SelectById = function(id)
	{
		if (typeof this.id_map[id] !== 'undefined')
			return new ActorGroup( this.graph[ this.id_map[ id ] ] );

		return new ActorGroup();
	}

	// Maintains a cache of all queries performed on the scene
	// if we pass in a selector that we've used recently and the scene hasn't changed since then,
	// we can return the same result
	this.Cache.Queries = {}

	/**
	* Adds a completed query to the cache for future reference
	*/
	this.Cache.SaveQuery = function(selector, result)
	{
		this.Cache.Queries[selector] = result;
	}

	/**
	* Returns the cached query if it exists and the scene hasn't changed
	* Otherwise returns null  
	*/
	this.getCachedQuery = function(selector)
	{
		if (typeof this.Cache.Queries[selector] !== 'undefined' && !this.hasChanged())
			return this.Cache.Queries[selector];

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
			if (typeof this.class_map[classKey] == 'undefined')
				this.class_map[classKey] = [];

			this.class_map[classKey].push(ActorIndex);
		}

		Drawing.Cache.invalidate();

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