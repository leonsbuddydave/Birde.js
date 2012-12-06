/**
* Array subclass that allows whole groups of actors to be easily queried and operated on as a whole.
*/
var ActorGroup = function()
{
	if (arguments.length == 1 && arguments[0] instanceof ActorGroup)
	{
		// Lets us easily clone an ActorGroup
		var i = 0;
		while ( i < arguments[0].length )
		{
			this.push( arguments[0][i] );
			i++;
		}
	}
	else
	{
		// Creates an entirely new ActorGroup
		for (var key in arguments)
		{
			this.push(arguments[key]);
		}
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
	var events = event.split(' ');

	var i = 0;
	while (i < events.length)
	{
		var ev = events[i];

		if (typeof EventRegistry[ev] == 'undefined')
			EventRegistry[ev] = [];

		this.each(function(e)
		{
			EventRegistry[ev].push({
				target : e,
				response : response
			});
		});

		i++;
	}


	return this;
}

/**
* Moves an entire ActorGroup at <angle> at <speed>
*/
ActorGroup.prototype.move = function(speed, angle)
{
	var x, y;

	x = Math.cos( BMath.degToRad(angle) ) * speed * Tick;
	y = Math.cos( BMath.degToRad(angle) ) * speed * Tick;

	this.each(function(e)
	{
		e.x += x;
		e.y += y;
	});
}

/**
* Usability wrapper for binding simple key movement to an ActorGroup.
* we might see this method moved into an ease-of-use lib with other
* methods that aren't necessary to core
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

		(function(vx, vy, ag, keyCode)
		{
			ag.bind("keydown", function(evt)
			{
				if (evt.keyCode == keyCode)
				{
					this.move({
						x : vx,
						y : vy
					});
				}
			});
		})(vx, vy, this, keyCode);
	}

	return this;
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
		var parent = Birde.Select(parentID)[0];

		this.each(function(e)
		{
			e.parent = parent;
		});

		return this;
	}
}

/**
* Finds anything inside here
*/
ActorGroup.prototype.find = function(selector)
{
	var OriginalSet = new ActorGroup(this);

	// WorkingGroup is the set currently being operated on
	var WorkingGroup = new ActorGroup(this);

	// Parses the selector into a selector object
	var selector = new Selector(selector);

	// Creates a blank actorgroup for us to fill
	var result = new ActorGroup();

	// Starts iterating through the parsed selector - selector iterates back to front, lowest scope to highest
	var s;
	while (s = selector.Next())
	{
		if (s[0] == "*")
		{
			// Returns the entirety of the WorkingGroup (wildcard selector)
			result = new ActorGroup( WorkingGroup );
		}
		else if (s[0] == ".")
		{
			// class selector
			result = WorkingGroup.findByClass( s.substr(1) );
		}
		else if (s[0] == "#")
		{
			// id selector
			result = WorkingGroup.findById( s.substr(1) );
		}
		else if (s[0] == "[")
		{
			// attribute selector
			var attrSelector = selector.ParseAttributeSelector(s);

			if (attrSelector != null)
			{
				if (attrSelector.attr && attrSelector.value)
					result = WorkingGroup.findByAttributeValue(attrSelector.attr, attrSelector.value);
				else if (attrSelector.attr && !attrSelector.value)
					result = WorkingGroup.findByHasAttribute(attrSelector.attr);
			}
		}
		else if (s[0] == ">")
		{
			// direct-child selector
			var parent = selector.Next();

			if (parent)
			{
				if (parent[0] == "#")
					result = WorkingGroup.findByParent( parent.substr(1) );
				else if (parent[0] == ".")
					result = WorkingGroup.findByParentClass( parent.substr(1) );
			}
			else
			{
				console.log("Selector error in ActorGroup.find(): Attempted immediate descendent selector with no parent.");
			}
		}
		else if (s[0] == ":")
		{
			// pseudo-class selector
		}
		else
		{
			// what the hell is this
			console.log("Selector error in ActorGroup.find(): Unknown identifier \"" + s + "\".");
		}

		WorkingGroup = new ActorGroup(result);
	}
	return result;
}

/**
* Finds objects that carry the attribute - no value checks
*/
ActorGroup.prototype.findByHasAttribute = function(attr)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < this.length )
	{
		if (typeof this[i][attr] !== 'undefined')
			result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Finds objects that carry the attribute and have it set to a particular value
*/
ActorGroup.prototype.findByAttributeValue = function(attr, value)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < this.length )
	{
		if (typeof this[i][attr] !== 'undefined' && this[i][attr] == value)
			result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Returns objects whose parents share a common class
*/
ActorGroup.prototype.findByParentClass = function(c)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < this.length )
	{
		if (this[i].parent !== null && this[i].parent.class.indexOf(c) > -1)
			result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Returns objects that share a common parent
*/
ActorGroup.prototype.findByParent = function(parentID)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < this.length )
	{
		if ( this[i].parent !== null && this[i].parent.id == parentID )
			result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Isolates an actor by id
*/
ActorGroup.prototype.findById = function(id)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < this.length )
	{
		if ( this[i].id == id )
			result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Isolates a single class
*/
ActorGroup.prototype.findByClass = function(c)
{
	var result = new ActorGroup();

	var i = 0;
	while (i < this.length)
	{
		if (this[i].class.indexOf(c) != -1)
			result.push( this[i] );
		i++;
	}
	return result;
}

/**
* Combines this ActorGroup with the provided one, returns a new ActorGroup
* ( does NOT modify this one )
*/
ActorGroup.prototype.combineWith = function(ag)
{
	var result = new ActorGroup();

	var i = 0;
	while ( i < ag.length )
	{
		result.push( ag[i] );
		i++;
	}

	i = 0;
	while ( i < this.length )
	{
		result.push( this[i] );
		i++;
	}

	return result;
}

/**
* Passes a new collision shape to all the actors in this group - 
* note that the shape is _copied by reference_ - any modifications 
* made to one will affect all. Food for thought.
*/
ActorGroup.prototype.setCollisionShape = function(shape)
{
	var i = 0;
	while ( i < this.length )
	{
		this[i].collisionShape = shape;
		i++;
	}

	return this;
}

/**
* Adds a class
*/
ActorGroup.prototype.addClass = function(c)
{
	var i = 0;
	while (i < this.length)
	{
		if (this[i].class.indexOf(c) == -1)
		{
			this[i].class.push(c);
		}
		i++;
	}

	return this;
}

/**
* Removes a class
*/
ActorGroup.prototype.removeClass = function(c)
{
	var i = 0;
	while (i < this.length)
	{
		this[i].class.splice(this[i].class.indexOf(c), 1);
		i++
	}

	return this;
}

//////////////////////////////////////////////////////////////////////
// Beyond this point we'll be setting a bunch of "bind" aliases for ease-of-use
// Nothing much down here is going to be engaging or useful in any meaningful way
//////////////////////////////////////////////////////////////////////

ActorGroup.prototype.step = function(callback)
{
	return this.bind("step", callback);
}

ActorGroup.prototype.draw = function(callback)
{
	return this.bind("draw", callback);
}

ActorGroup.prototype.keydown = function(callback)
{
	return this.bind("keydown", callback);
}

ActorGroup.prototype.keyup = function(callback)
{
	return this.bind("keyup", callback);
}

ActorGroup.prototype.keypress = function(callback)
{
	return this.bind("keypress", callback);
}

ActorGroup.prototype.collision = function(callback)
{
	return this.bind("collision", callback);
}