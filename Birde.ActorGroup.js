/**
* Array subclass that allows whole groups of actors to be easily queried and operated on as a whole.
*/
var ActorGroup = function()
{
	//this.prototype = new Array();
	for (var key in arguments)
	{
		this.push(arguments[key]);
	}
}
ActorGroup.prototype = new Array();

/**
* Iterator method that lets us apply a method to the entirety of the ActorGroup.
*/
ActorGroup.prototype.each = function(iterator)
{
	var i = 0;
	while ( i < this.length )
	{
		iterator(this[i], i);
		i++;
	}

	return this;
}

/**
* Applies a single attribute or literal of key/value pairs to an ActorGroup.
*/
ActorGroup.prototype.attr = function()
{
	if (arguments.length == 1)
	{
		var attrs = arguments[0];
		this.each(function(e)
		{
			for (key in attrs)
			{
				e[key] = attrs[key]
			}
		});
	}
	else if (arguments.length == 2)
	{
		var attr = arguments[0];
		var value = arguments[1];

		this.each(function(e)
		{
			e[attr] = value;
		});			
	}

	return this;
}

/**
* Binds an ActorGroup to receive a given event /and subevent.
*/
ActorGroup.prototype.bind = function(event, response)
{
	// Check if we also have a subevent class to deal with
	if (event.indexOf("[") != -1 && event.indexOf("]") != -1)
	{
		// We also have a subevent to use
		var subEventStart = event.indexOf("[");
		var subEventEnd = event.indexOf("]");

		var mainEvent = event.substr(0, subEventStart);
		var subEvent = event.substr(subEventStart + 1, subEventEnd - subEventStart - 1);

		// standard bind event
		if (typeof EventRegistry[mainEvent] == 'undefined')
			EventRegistry[mainEvent] = {};

		// Subevent container
		if (typeof SubEventRegistry[mainEvent] == 'undefined')
			SubEventRegistry[mainEvent] = {};

		if (typeof SubEventRegistry[mainEvent][subEvent] == 'undefined')
			SubEventRegistry[mainEvent][subEvent] = {};

		this.each(function(e)
		{
			SubEventRegistry[mainEvent][subEvent][e.id] =
			{
				target : e,
				response : response
			}
		});

	}
	else
	{
		// standard bind event
		if (typeof EventRegistry[event] == 'undefined')
			EventRegistry[event] = {};

		this.each(function(e)
		{
			EventRegistry[event][e.id] =
			{
				target : e,
				response : response
			}
		});
	}
	return this;
}

/**
* Moves an entire ActorGroup at <angle> at <speed>
*/
ActorGroup.prototype.move = function(speed, angle)
{
	var x, y;

	x = Math.cos( Birde.Math.degToRad(angle) ) * speed;
	y = Math.cos( Birde.Math.degToRad(angle) ) * speed;

	this.each(function(e)
	{
		e.x += x;
		e.y += y;
	});
}

/**
* Usability wrapper for binding simple key movement to an ActorGroup.
*/
ActorGroup.prototype.keyMovement = function(speed, keydir)
{
	for (var key in keydir)
	{
		if (isNaN(key))
			var keyCode = key.toUpperCase().charCodeAt();
		else
			var keyCode = key;

		var vx = speed * Math.cos( BMath.degToRad(keydir[key]) );
		var vy = speed * Math.sin( BMath.degToRad(keydir[key]) );

		(function(vx, vy, ag)
		{
			ag.bind("keydown[" + keyCode + "]", function()
			{
				this.move({
					x : vx,
					y : vy
				});
			});
		})(vx, vy, this);
	}
}

/**
* Sets the actor with the provided id as the parent of this ActorGroup.
*/
ActorGroup.prototype.setParent = function(parentID)
{
	if (parentID[0] != "#")
	{
		// not a proper id
		return this;
	}
	else
	{
		var parent = new Birde.fn.select(parentID)[0];

		this.each(function(e)
		{
			e.parent = parent;
		});

		return this;
	}
}

/**
* Sugar for adding the same component to multiple actors
*/
ActorGroup.prototype.addComponent = function(c)
{
	this.each(function(e)
	{
		e.addComponent(c);
	});

	return this;
}