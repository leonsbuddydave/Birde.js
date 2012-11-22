/**
* @fileOverview Birde - Usable Web Game Engine
* @author Mitchell N. Thompson
* @version 0.1
* @see http://birde.mitchellthompson.net/
*/

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback )
              {
                window.setTimeout(callback, 1000 / 60);
              };
    })();

(function(w)
{
	/**
	* Absolute highest level of the function - returns an ActorGroup based on the provided selector.
	*/
	var Birde = function(selector)
	{
		selector = selector || "*";
		return new Birde.fn.select(selector);
	}

	/**
	* Initializes all the game systems, has both optional and required properties.
	* Canvas : id of the target canvas
	*/
	Birde.Init = function(props)
	{
		console.log("Initializing.");
		return Birde.fn.init(props);
	}

	/**
	* Launches the game loop if Birde.Init has already been called, otherwise does nothing.
	*/
	Birde.Start = function()
	{
		if (Initialized)
			return new Birde.fn.step(0);
		else
			return null;
	}

	/**
	* Toggles canvas filling the whole visible body. (not fullscreen in the conventional sense)
	*/
	Birde.ToggleFullScreen = function()
	{
		return new Birde.fn.fullscreen();
	}

	/**
	* Birde.Geometry module
	* Contains definitions for shapes - used primarily for collision.
	*/
	Birde.Geometry =
	{
		/**
		* Vague definition for a polygon of any number of points.
		*/
		Polygon : function()
		{
			// Arguments object should contain all points
			this.points = arguments;

			this.type = "polygon";
		},

		/*
		* Circle object - used for extremely cheap but less accurate collision detection.
		*/
		Circle : function(radius)
		{
			this.prototype = new Birde.Geometry.Polygon();

			this.radius = radius;

			this.type = "circle";
		}
	}
	

	////////////////////////////////////////////////////////
	var Tick = 15;
	var Initialized = false;
	var lastFrameTime = 0;

	var Options =
	{
		Capped : true,
		ClearColor : "#ccc",
		Canvas : null,
		Context : null
	}

	/**
	* Birde.Core
	* Contains important game methods.
	*/
	Birde.fn = Birde.prototype =
	{
		/**
		* Top-level initialization method - calls all other initialization methods
		* to kick off the engine's core systems. Marks the system as initialized upon completion.
		*/
		init : function(props)
		{
			Options = Birde.extend(props, Options);

			Birde.Drawing.init(Options);
			Birde.Input.init(Options);

			Caches.init(Options);

			Initialized = true;

			return this;
		},

		/**
		* Returns an ActorGroup containing actors matching the provided query.
		* @param (String) selector - CSS-style selector string
		*/
		select : function(selector, props)
		{
			if (selector == "*")
			{
				// Converts the scenegraph into an ActorGroup result
				var result = new ActorGroup();

				var A = Birde.fn.Scene.Actors;

				for (var key in A)
				{
					result.push(A[key]);
				}

				return result;
			}
			else if (selector[0] == ".")
			{
				// Searches for all elements containing the provided class
				var c = selector.replace(/\./g, "").split(' ');

				// Class selection
				var results = new ActorGroup();

				var A = Birde.fn.Scene.Actors;

				for (var id in A)
				{
					var matchedClasses = 0;

					for (var classIndex in A[id].class)
					{
						if (c.indexOf( A[id].class[classIndex] ) != -1)
							matchedClasses++;
					}

					if (matchedClasses == c.length)
					{
						results.push(A[id]);
					}
				}

				return results;
			}
			else if (selector[0] == "#")
			{
				var id = selector.replace("#", "");

				// ID Selection
				if (typeof Birde.fn.Scene.Actors[ id ] != 'undefined' )
				{	
					var a = new ActorGroup();
					a.push( Birde.fn.Scene.Actors[ id ] );
					return a;
				}
				else
					return new ActorGroup();
			}
			else
			{
				return new ActorGroup();
			}
		},

		/**
		* Updates the whole system at a set interval.
		* Once started, it will continue to call itself until otherwise stopped.
		*/
		step : function()
		{
			var newFrameTime = (new Date()).getTime();

			if (lastFrameTime == 0)
			{
				Tick = 0;
			}
			else
			{
				Tick = ( newFrameTime - lastFrameTime ) / 1000;
			}

			lastFrameTime = newFrameTime;

			Birde.Input.step(Tick);

			for (key in EventRegistry.step)
			{
				var a = EventRegistry.step[key];
				a.response.call(a.target, Tick);
			}

			Birde.fn.draw();

			if (Options.Capped)
				requestAnimFrame(Birde.fn.step)
			else
				Birde.fn.step();
		},

		/**
		* Called during the step method - calls the Draw method of all objects bound to the Draw event.
		*/
		draw : function()
		{

			Birde.Drawing.Clear();

			Caches.Drawing.updateIfInvalid();

			var i = 0;
			while (i < Caches.Drawing.length)
			{
				var a = Caches.Drawing[i];
				a.response.call(a.target, Birde.Drawing);
				i++;
			}
		},

		/**
		* Temporary prototype method used for "fullscreening" the canvas area.
		*/
		fullscreen : function()
		{
			var newWidth = document.body.scrollWidth;
			var newHeight = document.body.scrollHeight;

			if (newWidth == 0 || newHeight == 0)
				return;

			Options.Canvas.style.position = "absolute";
			Options.Canvas.style.top = "0";
			Options.Canvas.style.left = "0";
			Options.Canvas.width = newWidth;
			Options.Canvas.height = newHeight;
			Birde.Drawing.Width = Options.Canvas.width;
			Birde.Drawing.Height = Options.Canvas.height;
		}
	}

	/**
	* The currently loaded scene - name may change to reflect that more accurately. 
	* Stores the position of the world relative to the camera and a list of all the actors in the scene.
	*/
	Birde.fn.Scene =
	{
		Position :
		{
			x : 0,
			y : 0
		},
		Actors : []
	}

	/**
	* Bird math. Implements all general math functions that we need.
	*/
	Birde.Math =
	{
		/**
		* Converts radians to degrees.
		*/
		radToDeg : function(x)
		{
			return x * 180 / Math.PI;
		},

		/**
		* Converts degrees to radians.
		*/
		degToRad : function(x)
		{
			return x * Math.PI / 180;
		}
	}

	/**
	* Drawing module. Keeps an internal reference to the canvas and context currently in use, and provides a higher-level interface
	* to drawing things on the canvas to keep it simple. A reference to this module gets passed to every draw method.
	*/
	Birde.Drawing =
	{
		/**
		* Initializes the drawing area and stores some useful information about it - Width, Height, ClearColor, etc.
		*/
		init : function(props)
		{
			props.Canvas = document.getElementById( props.Canvas );
			this.Context = props.Context = props.Canvas.getContext('2d');
			this.ClearColor = props.ClearColor;
			this.Width = props.Canvas.Width;
			this.Height = props.Canvas.Height;
		},
		Context : null,
		ClearColor : "#fff",
		Width : 0,
		Height : 0,

		/**
		* Clears the visible canvas with the stored ClearColor.
		*/
		Clear : function()
		{
			this.Context.fillStyle = this.ClearColor;
			this.Context.fillRect(0, 0, this.Width, this.Height);
			this.Context.fill();
		},

		/**
		* Draws the default collision boundaries for an object using its x, y, w and h properties.
		* Currently does NOT support drawing custom collision polygons generated at runtime.
		*/
		DrawBounds : function(actor)
		{
			this.Context.fillStyle = actor.color || "#f00";

			var pos = actor.getScreenPos();

			this.Context.fillRect(pos.x, pos.y, actor.w, actor.h);
			this.Context.fill();		
		}
	}

	/**
	* Monitors events related to keyboard and mouse input. Internally stores the state of keys and mouse buttons, as well.
	* Is also tasked with delegating these events each step.
	*/
	Birde.Input =
	{
		/**
		* Stores the state of the individual mouse buttons - array should only contain three elements
		* but is left uncapped in case your mouse is fucking weird.
		*/
		Mousestates : [],

		/**
		* Mouse object stores everything else about the cursor - where it is, where it was last frame, and its deltas between this frame and the last.
		*/
		Mouse : 
		{
			lastX : 0,
			lastY : 0,
			x : 0,
			y : 0,
			deltaX : 0,
			deltaY : 0
		},

		/**
		* Initializes the input storage objects and attaches events to the document to capture input about the mouse and keyboard.
		*/
		init : function(props)
		{
			// Register mouse events
			Options.Canvas.onmousemove = function(e)
			{
				var Mouse = Birde.Input.Mouse;
				Mouse.lastX = Mouse.x;
				Mouse.lastY = Mouse.y;
				Mouse.x = e.offsetX;
				Mouse.y = e.offsetY;
				Mouse.deltaX = Mouse.x - Mouse.lastX;
				Mouse.deltaY = Mouse.y - Mouse.lastY;
			}

			// Initialize keystates
			var i = 0;
			while (i < 128)
			{
				this.Keystates[i] = false;
				i++;
			}

			document.body.onkeydown = function(e)
			{
				// Sets key-down state
				Birde.Input.Keystates[e.keyCode] = true;
			}

			document.body.onkeyup = function(e)
			{
				// Sets key-up state
				Birde.Input.Keystates[e.keyCode] = false;
			}
		},

		/**
		* Stores the state of each key (true for pressed, false for not pressed)
		*/
		Keystates : [],

		/**
		* Checks to see if literally any key is pressed down - this information is used for firing the generic keydown event.
		*/
		isKeyDown : function()
		{
			// Returns a non-false value if any key is pressed down
			var i = 0;
			while (i < this.Keystates.length)
			{
				if (this.Keystates[i] == true)
					return true;
				i++;
			}

			return false;
		},

		/**
		* Retrieves a shortlist of all the keys that are currently pressed down - used for firing keydown subevents.
		*/
		getAllKeysDown : function()
		{
			// Retrieves a list of all the keys currently pressed down
			var keysDown = [];

			var i = 0;
			while (i < this.Keystates.length)
			{
				if (this.Keystates[i] == true)
					keysDown.push(i);
				i++;
			}

			return keysDown;
		},

		/**
		* Fires every step and determines if any bound events need to be fired.
		*/
		step : function(dt)
		{
			// Fires all the generic key events
			for (var key in EventRegistry.keydown)
			{
				if (this.isKeyDown())
				{
					var a = EventRegistry.keydown[key];
					a.response.call(a.target);
				}
			}

			// Fires all the specific key events
			var keysDown = this.getAllKeysDown();
			var i = 0;
			while (i < keysDown.length)
			{
				for (var key in SubEventRegistry.keydown[keysDown[i]])
				{
					var a = SubEventRegistry.keydown[keysDown[i]][key];
					a.response.call(a.target);
				}
				i++;
			}
		}
	}

	/**
	* High level method for creating an actor and adding it to the scene in one go.
	*/
	Birde.A = Birde.a = Birde.Actor = function(id, props)
	{
		props = Birde.extend(props, {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			class : ["default"]
		});

		Birde.fn.Scene.Actors[id] = new Actor(id, props);

		// tell the drawing cache that we have a new
		// actor to take into account
		Caches.Drawing.invalidate();

		var a = new ActorGroup();
		a.push(Birde.fn.Scene.Actors[id]);
		return a;
	}

	/**
	* Used for extending object literals - mostly default property objects.
	*/
	Birde.extend = function(props, defaults)
	{
		if (typeof props == 'undefined' || props == null)
		{
			return defaults;
		}

		for (var key in defaults)
		{
			if (typeof props[key] == 'undefined')
				props[key] = defaults[key];
		}
		return props;
	}

	/**
	* Attach Birde and B to the window object - long form and an alias, for the world to see.
	*/
	w.B = w.Birde = Birde;

	/**
	* Array subclass that allows whole groups of actors to be easily queried and operated on as a whole.
	*/
	var ActorGroup = function()
	{
		//this.prototype = new Array();
		var i = 0;
		while (i < arguments.length)
		{
			this[i] = arguments[i];
			i++;
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
				var keyCode = key.toUpperCase().charCodeAt(0);
			else
				var keyCode = key;

			var vx = speed * Math.cos( Birde.Math.degToRad(keydir[key]) );
			var vy = speed * Math.sin( Birde.Math.degToRad(keydir[key]) );

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
	* Represents any object in the world - versatile, general object.
	*/
	var Actor = function(id, props)
	{
		this.id = id;

		this.class = props.class.split(" ");

		this.parent = null;

		/**
		* Returns the position that this object should be drawn on the screen in - takes into account the position of the world, its parent's position,
		* and its own position within its parent's coordinate space. 
		*/
		this.getScreenPos = function()
		{
			// Returns the coordinates of the object relative to the world and any parents
			var pos = {};
			pos.x = Birde.fn.Scene.Position.x;
			pos.y = Birde.fn.Scene.Position.y;

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
		* Returns true if this Actor is part of a particular class.
		*/
		this.hasClass = function(c)
		{
			if (this.class.indexOf(c) > -1)
				return true;

			return false;
		}

		/**
		* Removes this Actor from the scene entirely. Needs work to unbind everything the actor's done.
		*/
		this.destroy = function()
		{
			// Needs to unbind everything
			Birde.fn.Scene.Actors[this.id] = "";
		}

		/**
		* Moves this object based on the provided delta object.
		*/
		this.move = function(dir)
		{
			var x = dir.x * Tick;
			var y = dir.y * Tick;

			this.x += x;
			this.y += y;
		}

		Birde.extend(this, props);
	}

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

	/**
	* This is where core events are bound to and called from.
	*/
	var EventRegistry =
	{
		draw : {},
		step : {},
		keydown : {},
		keyup : {},
		keypress : {}
	}

	/**
	* This is where subevents (such as individual key presses) are bound to and called from.
	*/
	var SubEventRegistry =
	{
		draw : {},
		step : {},
		keydown : {},
		keyup : {},
		keypress : {},
		keyisdown : {}
	}
})(window);