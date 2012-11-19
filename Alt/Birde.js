window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

(function(w)
{
	
	// Birde.Core
	var Birde = function(selector)
	{
		selector = selector || "*";
		return new Birde.fn.select(selector);
	}

	Birde.Init = function(props)
	{
		return Birde.fn.init(props);
	}

	Birde.Start = function()
	{
		if (Initialized)
			return new Birde.fn.step(0);
		else
			return null;
	}

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

	var Modules =
	{
		Drawing : null,
		Input : null
	}

	Birde.fn = Birde.prototype =
	{
		init : function(props)
		{
			Options = Birde.fn.Props.ExtendDefaults(props, Options);

			Modules.Drawing = new Drawing(Options);
			Modules.Input = new Input(Options);

			Initialized = true;

			return this;
		},

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

		draw : function()
		{

			Modules.Drawing.Clear();

			for (key in EventRegistry.draw)
			{
				var a = EventRegistry.draw[key];
				a.response.call(a.target, Modules.Drawing);
			}
		},
	}

	Birde.fn.Scene =
	{
		Actors : []
	}

	// Drawing object, high-level interface for canvas drawing
	var Drawing = function(props)
	{
		props.Canvas = document.getElementById( props.Canvas );
		this.Context = props.Context = props.Canvas.getContext('2d');
		this.ClearColor = props.ClearColor;
		this.Width = props.Canvas.width;
		this.Height = props.Canvas.height;

		this.Clear = function()
		{
			this.Context.fillStyle = this.ClearColor;
			this.Context.fillRect(0, 0, this.Width, this.Height);
			this.Context.fill();
		}

		this.DrawBounds = function(actor)
		{
			this.Context.fillStyle = "#f00";
			this.Context.fillRect(actor.x, actor.y, actor.w, actor.h);
			this.Context.fill();		
		}
	}

	// Input object, monitors and stores everything related to input
	var Input = function(props)
	{
		this.Keystates = [];

		var i = 0;
		while (i < 128)
		{
			this.Keystates[i] = false;
			i++;
		}

		document.body.onkeydown = function(e)
		{
			// Sets key-down state
			Modules.Input.Keystates[e.keyCode] = true;

			for (var key in EventRegistry.keydown)
			{
				var a = EventRegistry.keydown[key];
				a.response.call(a.target, e);
			}

			for (var key in SubEventRegistry.keydown[e.keyCode])
			{
				var a = SubEventRegistry.keydown[e.keyCode][key];
				a.response.call(a.target, e);
			}
		}

		document.body.onkeyup = function(e)
		{
			// Sets key-up state
			Modules.Input.Keystates[e.keyCode] = false;
		}
	}

	Birde.A = Birde.a = Birde.Actor = function(id, props)
	{
		props = Birde.fn.Props.ExtendDefaults(props, {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			class : ["default"]
		});

		Birde.fn.Scene.Actors[id] = new Actor(id, props);

		var a = new ActorGroup();
		a.push(Birde.fn.Scene.Actors[id]);

		return a;
	}

	Birde.fn.Props =
	{
		ExtendDefaults : function(props, defaults)
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
	}

	w.B = w.Birde = Birde;

	// Actor Group - used to apply methods to a selection of actors
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

			console.log(SubEventRegistry);
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

	ActorGroup.prototype.move = function(dir)
	{
		var x = dir.x * Tick;
		var y = dir.y * Tick;

		this.each(function(e)
		{
			e.x += x;
			e.y += y;
		});
	}

	ActorGroup.prototype.keyMovement = function(speed, keydir)
	{

	}

	// Actor class - everything on screen is an Actor
	var Actor = function(id, props)
	{

		Birde.fn.Props.ExtendDefaults(this, props);

		this.id = id;

		this.class = props.class.split(" ");

		this.destroy = function()
		{
			Birde.fn.Scene.Actors[this.id] = "";
		}

		this.move = function(dir)
		{
			var x = dir.x * Tick;
			var y = dir.y * Tick;

			this.x += x;
			this.y += y;
		}
	}

	// Used for maintaining bound/unbound actor events
	var EventRegistry =
	{
		draw : {},
		step : {},
		keydown : {},
		keyup : {},
		keypress : {}
	}

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