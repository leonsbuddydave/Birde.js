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