/**
* This is where core events are bound to and called from.
*/
var EventRegistry =
{
	draw : {},
	step : {},
	keydown : {},
	keyup : {},
	keypress : {},
	contentloadupdate : {},
	contentload : {}
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

/**
* Manually fires an event, without arguments.
*/
var FireEvent = function(event)
{
	for (var key in EventRegistry[event])
	{
		var a = EventRegistry[event][key];
		a.response.call(a.target);
	}
}