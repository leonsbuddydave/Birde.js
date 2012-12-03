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

	/**
	* Adds an actor to this Scene
	*/
	this.Add = function(actor)
	{
		var ActorIndex = this.graph.push(actor) - 1;
		this.id_map[actor.id] = ActorIndex;

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