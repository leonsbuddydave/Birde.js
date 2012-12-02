/*
	EVENT
	
	Enumeration containing the names of all the supported events.
*/
EVENT = {
	CLICK : "click",
	MOUSEDOWN : "mousedown",
	MOUSEUP : "mouseup",
	MOUSEOVER : "mouseover",
	MOUSEOUT : "mouseout",
	MOUSEMOVE : "mousemove",
	KEYUP : "keyup",
	KEYDOWN : "keydown",
	KEYPRESS : "keypress",
	BLUR : "blur",
	FOCUS : "focus"
}

/*
	CollisionType
	
	BOX: Simple box collision
	CIRCLE: Purely distance (radius-based) collision
*/
CollisionType =
{
	BOX : 0,
	CIRCLE : 1
}

MASK = 
{
	FOREGROUND : 0,
	BACKGROUND : 1
}

POSITION =
{
	WORLD : 0,
	SCREEN : 1
}