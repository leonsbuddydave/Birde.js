/**
* Represents any object in the world - versatile, general object.
*/
var Actor = function(id, props)
{

	this.id = id;

	// First extends the provided properties object with defaults
	Birde.extend(props, {
		x : 0,
		y : 0,
		w : 0,
		h : 0,

		class : [],

		// maintains a list of all the bindings this Actor is registered for
		// NOT IMPLEMENTED YET
		bindings : [],

		// all actors have no parent by default
		parent : null,
	});

	// then extends the actor object with those properties - there's probably a cheap way to reduce this to a one-step process
	Birde.extend(this, props);

	this.lastX = 0;
	this.lastY = 0;

	this.collisionShape = new Shape.Rectangle(0, 0, this.w, this.h);
}

/**
* Returns true if this Actor is part of a particular class.
*/
Actor.prototype.hasClass = function(c)
{
	if (this.class.indexOf(c) > -1)
		return true;

	return false;
}

/**
* Returns true if this actor is bound to the requested event
*/
Actor.prototype.isBoundTo = function(binding)
{
	// Not implemented yet
	return false;
}

/**
* Moves this object based on the provided delta object.
*/
Actor.prototype.move = function(speed, angle)
{
	this.backupCoords();

	var x, y;

	x = Math.cos( BMath.degToRad(angle) ) * speed * Tick;
	y = Math.sin( BMath.degToRad(angle) ) * speed * Tick;

	this.x += x;
	this.y += y;

	return this;
}

/**
* Moves the object until a collision occurs
*/
Actor.prototype.moveToCollision = function(speed, angle, accuracy)
{
	// default accuracy depth
	// number of times this will be called max
	// 2 should be enough for _most_ cases
	accuracy = accuracy || 2; 

	this.backupCoords();

	var x, y;

	x = Math.cos( BMath.degToRad(angle) ) * speed * Tick;
	y = Math.sin( BMath.degToRad(angle) ) * speed * Tick;

	this.predictCollision(new Point(x, y));

	if (this.collision_inevitable && accuracy--)
	{
		this.moveToCollision(speed >> 1, angle, accuracy);
	}
	else
	{
		this.move(speed, angle);
	}

	return this;
}

/**
* Returns the position that this object should be drawn on the screen in - takes into account the position of the world, its parent's position,
* and its own position within its parent's coordinate space. 
*/
Actor.prototype.getScreenPos = function()
{
	// Returns the coordinates of the object relative to the world and any parents
	var pos = {};
	pos.x = Birde.Scene.Position.x;
	pos.y = Birde.Scene.Position.y;

	if (this.parent != null)
	{
		var parentPos = this.parent.getScreenPos();
		pos.x += parentPos.x;
		pos.y += parentPos.y;
	}

	pos.x += this.x;
	pos.y += this.y;

	return pos;
}

/**
* Should be called by any method that modifies the actor's position
* this way we can revert to position or perform operations using deltas
*/
Actor.prototype.backupCoords = function()
{
	this.lastX = this.x;
	this.lastY = this.y;
}

/**
* Will try to reset element to its last known position
* will NOT work if the element's coordinates have been
* affected manually
*/
Actor.prototype.backpedal = function()
{
	this.x = this.lastX;
	this.y = this.lastY;
}

/**
* Will try to predict if the given actor will undergo a collision
* soon, given a new position
*/
Actor.prototype.predictCollision = function(vector)
{
	/**
	* Something to keep in mind - the conclusion of this method unbinds ALL
	* collision events tied to the actor. Probably an unwanted side-effect.
	* We need a better way to unbind things OR a better way to predict collisions.
	*/
	this.x += vector.x;
	this.y += vector.y;

	this.collision_inevitable = false;

	(function(r)
	{
		B(r).collision(function()
		{	
			r.collisionPredictionResponse.call(r);
		});
	})(this);

	Collision.step();

	B(this).unbind("collision");

	this.x -= vector.x;
	this.y -= vector.y;

	return this.collision_inevitable;
}

/**
* There's probably a much better way to do this with closures, but it's 6AM.
* So in the meantime, this is here to act as a response target for the temporary
* collision event registered by Actor.prototype.predictCollision
*/
Actor.prototype.collisionPredictionResponse = function()
{
	// collision probably
	this.collision_inevitable = true;
}

Actor.prototype.predictCollisionWith = function(actorid)
{
	// Possibly default to predictCollision if the actorid isn't provided,
	// but that may result in some serious undefined behavior
	if (typeof actorid == 'undefined')
		return false;
	// else
	
}