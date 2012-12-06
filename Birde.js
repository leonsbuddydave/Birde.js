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
                window.setTimeout(callback, 1000 / 100);
              };
    })();

(function(w)
{
	/**
	* Absolute highest level of the function - returns an ActorGroup based on the provided selector.
	*/
	var Birde = function(selector)
	{
		if (selector instanceof Actor)
			return new ActorGroup(selector);

		return Birde.Select(selector);
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

	/**
	* Start of advanced selector engine
	*/
	Birde.Select = function(selector)
	{
		selector = selector || "*";
		// also testing some shit
		var result = new ActorGroup();
		
		var selectors = selector.split(',');

		var i = 0;
		while ( i < selectors.length )
		{
			result = result.combineWith( this.Scene.graph.find(selectors[i]) );
			i++;
		}

		return result;
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

			Drawing.init(Options);
			Input.init(Options);

			Caches.init(Options);

			Birde.Initialized = true;

			return this;
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

			Collision.step(Tick);

			Input.step(Tick);

			FireEvent("step");

			Drawing.step();

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