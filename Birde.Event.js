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
	if (!event || !index)
		return 0;

	var a = EventRegistry[event][index];
	a.response.call(a.target, arguments[2]);
}

function Event(overrides)
{
	this.keyCode = overrides.keyCode || 0;
}