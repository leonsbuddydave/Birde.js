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
