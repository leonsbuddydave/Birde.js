/**
* This is where core events are bound to and called from.
*/
var EventRegistry =
{
	draw : [],
	step : [],
	keydown : [],
	keyup : [],
	keypress : [],
	click : [],
	mousedown : [],
	mouseup : [],
	contentloadupdate : [],
	contentload : [],
	collision : []
}

/**
* Manually fires an event with up to one argument
*/
var FireEvent = function(event)
{
	var i = 0;
	while (i < EventRegistry[event].length)
	{
		var a = EventRegistry[event][i];
		a.response.call(a.target, arguments[1]);
		i++;
	}
}

/**
* Manually fires an event, one argument, on a single object
*/
var FireEventOnActor = function(event, index)
{
	if (typeof event == 'undefined' || typeof index == 'undefined')
		return 0;

	var a = EventRegistry[event][index];
	a.response.call(a.target, arguments[2]);
}

/**
* Fires a mouse event for all relevant objects
*/
var FireMouseEvent = function(eventName, e)
{
	var evt = new Event({
		mouseButton : e.button
	});

	var mousePoint = new Point(Input.Mouse.x, Input.Mouse.y);

	var Bound = EventRegistry[eventName];

	var i = 0;
	while (i < Bound.length)
	{
		if ( Collision.containsPoint( Bound[i].target, mousePoint ) )
		{
			FireEventOnActor( eventName, i, evt );
		}
		i++;
	}
}

/**
* Birde Event Object
*/
function Event(overrides)
{
	this.keyCode = overrides.keyCode || 0;
	this.mouseButton = overrides.button || 0;
}