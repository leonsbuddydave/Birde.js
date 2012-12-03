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
		if (this.Initialized)
			return new Birde.fn.step(0);
		else
			return null;
	}

	/**
	* Toggles canvas filling the whole visible body. (not fullscreen in the conventional sense)
	*/
	Birde.ToggleFullScreen = function()
	{
		Drawing.ToggleFullscreen();
	}


	////////////////////////////////////////////////////////
	w.Tick = 15;
	Birde.Initialized = false;
	var lastFrameTime = 0;

	var Defaults =
	{
		ClearColor : "#ccc",
		Canvas : null,
		Context : null
	}

	/**
	* Contains any third-party modules.
	*/
	Birde.mod = {}

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
			var Options = Birde.extend(props, Defaults);

			for (var key in Birde.mod)
			{
				Birde.mod[key].call(this);
			}

			Drawing.init(Options);
			Input.init(Options);

			Caches.init(Options);

			Birde.Initialized = true;

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

				var A = Birde.Scene.graph;

				for (var key in A)
				{
					result.push(A[key]);
				}

				return result;
			}
			else if (selector[0] == ".")
			{
				// Searches for all elements containing the provided class
				var classSelector = selector.replace(/\./g, "").split(' ');

				// Class selection
				var results = new ActorGroup();

				var A = Birde.Scene.graph;

				var i = 0;
				while (i < A.length)
				{
					var a = A[i];

					var matchedClasses = 0;

					var c = 0;
					while (c < a.class.length)
					{
						if (classSelector.indexOf( a.class[c] ) != -1)
							matchedClasses++;

						c++;
					}

					if (matchedClasses == classSelector.length)
						results.push(a);

					i++;
				}

				return results;
			}
			else if (selector[0] == "#")
			{
				var id = selector.replace("#", "");

				return Birde.Scene.SelectById(id);				
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

			Input.step(Tick);

			// Call the step method of every Actor that signed up for it
			for (key in EventRegistry.step)
			{
				var a = EventRegistry.step[key];
				a.response.call(a.target, Tick);

				// This last part might be a feature or need some reworking
				// updating components here ensures that components only occur on objects
				// that need to do processing anyway and have a step event
				// that way we avoid updating nonexistent components on static objects
				a.target.playComponents(Tick);
			}

			Drawing.Step();

			requestAnimFrame(Birde.fn.step);
		}
	}

	Birde.Scene = new Scene();

	/**
	* Top level alias for Scene.Add - used specifically for adding elements to the active scene.
	*/
	Birde.Add = function(actor)
	{
		return this.Scene.Add(actor);
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
			if (props[key] == null)
				props[key] = defaults[key];
		}
		return props;
	}

	/**
	* Attach Birde and B to the window object - long form and an alias, for the world to see.
	*/
	w.B = w.Birde = Birde;
	
})(window);