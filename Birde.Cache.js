/**
* Cache interface - stores general methods for caches, will be used for drawing caches and selector caching
*/
var Cache = function()
{
	this.valid = false;
}
Cache.prototype = new Array();

/**
* Sugar method - indicates that this cache no longer reflects engine state and needs to be rebuilt
*/
Cache.prototype.invalidate = function()
{
	this.valid = false;
}

/**
* Called before the cache is used - checks if the cache is marked invalid, and if it is, calls the rebuild method.
*/
Cache.prototype.updateIfInvalid = function()
{
	if (!this.valid)
		this.rebuild();
}

/**
* Rebuild method - does absolutely nothing in the cache interface. Any subclasses of Cache need to implement this method in some way in
* order for the cache to do anything at all.
*/
Cache.prototype.rebuild = function()
{
	// does nothing here
}

/**
* Implements the Cache interface - becomes invalidated when an Actor is added to the scene (or removed) and rebuilds in order to keep proper draw order.
*/
var DrawCache = new Function();
DrawCache.prototype = new Cache();

/**
* Implementatino of rebuild - in this case, just calls the proper gather/sort method.
*/
DrawCache.prototype.rebuild = function()
{
	this.gatherAndSortScene();
}

/**
* Grabs the entire scenegraph from the Draw event object, sorts them by z-index, and stores them to be drawn in the proper order.
*/
DrawCache.prototype.gatherAndSortScene = function()
{
	this.length = 0;
	for (var key in EventRegistry.draw)
	{
		this.push(EventRegistry.draw[key]);
	}

	this.sort(function(a, b)
	{
		return a.target.z - b.target.z;
	});
}

/**
* Maintains a registry of active caches and their uses.
*/
var Caches =
{
	init : function(props)
	{
		this.Drawing = new DrawCache();
	}
};