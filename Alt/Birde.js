(function(w)
{
	
	// Birde.Core
	var Birde = function(selector)
	{
		return new Birde.fn.select(selector);
	}

	Birde.Init = function(props)
	{
		return Birde.fn.init(props);
	}

	Birde.fn = Birde.prototype =
	{
		options : {},
		init : function(props)
		{
			Birde.fn.options = Birde.fn.Props.ExtendDefaults(props,
			{
				canvas : null
			});

			return this;
		},

		select : function(selector, props)
		{
			if (selector === "*")
				return Birde.fn.Scene.Actors;
			else if (selector[0] == ".")
			{
				var c = selector.replace(".", "");

				// Class selection
				var results = new ActorGroup();

				var A = Birde.fn.Scene.Actors;

				for (var id in A)
				{
					if (A[id].class == c)
						results.push(A[id]);
				}

				return results;
			}
			else if (selector[0] == "#")
			{
				var id = selector.replace("#", "");

				// ID Selection
				if (typeof Birde.fn.Scene.Actors[ id ] != 'undefined' )
				{
					console.log("Match found.");
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

		step : function(lastTime)
		{

		}
	}

	Birde.fn.Scene =
	{
		Actors : []
	}

	Birde.A = Birde.a = Birde.Actor = function(id, props)
	{
		props = Birde.fn.Props.ExtendDefaults(props, {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			class : "default"
		});

		Birde.fn.Scene.Actors[id] = new Actor(id, props);
		return Birde.fn.Scene.Actors[id];
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

			console.log(arguments[1]);

			this.each(function(e)
			{
				e[attr] = value;
			});			
		}

		return this;
	}


	// Actor
	var Actor = function(id, props)
	{

		Birde.fn.Props.ExtendDefaults(this, props);

		this.id = id;

		this.destroy = function()
		{
			Birde.fn.Scene.Actors[this.id] = "";
		}
	}
})(window);