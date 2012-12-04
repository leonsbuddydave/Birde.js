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

var FireEvent = function(event, args)
{
	for (var key in EventRegistry[event])
	{
		var a = EventRegistry[event][key];
		a.response.call(a.target, args);
	}
}