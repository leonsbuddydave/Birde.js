Calls to the engine can be made using the "Birde" object or just "B".

Just actor creation and selection ported so far:

Birde.Init({
	canvas "CanvasID"
});

/* Or Birde.A / Birde.a */
Birde.Actor("ActorID", {
	x : 0,
	y : 0,
	w : 0,
	h : 0,
	class "ActorClassName"
});



// Supported selectors:
//
//	"*" // return all objects in graph
//  ".ActorClassName" // returns objects by class
//  "#ActorID" // returns object matching the unique id

Returns ActorGroup containing Actors matching the query

Birde(/* some selector, see above */)

// Applies group of attributes to set of actors
ActorGroup.attr({
	props : values
})

// Iterates over a group of actors applying the provided function
ActorGroup.each(function(element, index)
{
	// etc
})


// Binds an object or objects to a given event:
// draw
// step
// keydown
// keyup
// keypress
//
// Some events also have support for "subevents", where they can register for
// a particularly specific event, i.e:
//
// ActorGroup.bind("keydown[13]", function(){})
//
// Will cause the event to only be fired when a keydown of keycode 13 is pressed (Enter)
// Eventual support for easily concatenating multiple subevents of the same event planned. (i.e. "keydown[13,32]" to capture only Enter and Space)
ActorGroup.bind(event, function(eventObject)
{
	// Event happenings here
})

// Actor.move : defines a number of pixels in each direction to move per second
// (Arguments subject to change)
Actor.move({
	x : 10,
	y : 20
});