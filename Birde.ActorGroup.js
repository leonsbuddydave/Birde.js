/**
* Array subclass that allows whole groups of actors to be easily queried and operated on as a whole.
*/
var ActorGroup = function()
{
	if (arguments.length == 1 && arguments[0].type == "ActorGroup")
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
ActorGroup.prototype.type = "ActorGroup";

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

	x = Math.cos( Birde.Math.degToRad(angle) ) * speed * Tick;
	y = Math.cos( Birde.Math.degToRad(angle) ) * speed * Tick;

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

/**
* Finds anything inside here
*/
ActorGroup.prototype.find = function(selector)
{
	var OriginalSet = new ActorGroup(this);

	var WorkingGroup = new ActorGroup(this);

	var selector = new Selector(selector);

	var result = new ActorGroup();

	var s;
	while (s = selector.Next())
	{
		if (s[0] == "*")
		{
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