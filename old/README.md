JS-Canvas-Game-Engine
=====================

Page Requirements:

-- HTML5 Canvas element
-- All scripts included

To start everything moving, call Game.Start("ID of your canvas"). That's it.

Scene elements are represented by the WorldObject class, instantiated as follows:

var SomeWorldElement = WorldObject.New();

Creating your own objects to use in the world is done by giving it a name and passing your new object
to WorldObject.Extend() as follows:

var Ball = WorldObject.Extend({
	// Overridden methods and other information goes here
	x : 20,
	y : 40
});

and those can in turn be instantiated and returned by calling the New method on Ball like before. Subclasses
of the WorldObject class also inherit its Extend method, allowing for classically inherited elements
that all work within the scene.

Methods and members that are passed inside the object being extended are considered to be overridden, and the
Extend method will leave them as is. If methods or members required for WorldObjects to work are not overridden,
they get the same values as their parent.

Any object following the paradigms of WorldObject can be added to the scene by calling World.Add(obj1, obj2, ...objn).

Methods and members of the WorldObject class are as follows:

-- Extend
(
	Object to be extended
)
- Imbues the provided object with properties and methods of the parent

-- New
()
- Returns a new instance of this object class

-- Init
(
	Reference to this object
)
- Called when the object is added to the scene (does nothing by default)

-- Class
- Object's class name - defaults to "Generic", used only for targeted collisions and modifying all instances of a class at once

-- x, y, z
- Object's position attributes

-- Children
[]
- Children of this object, used for grouping - this object is responsible for updating them on its own

-- Update
(
	Reference to this object,
	Time elapsed
)
- Called every world step, used for updating any of the object's attributes

-- Draw
(
	Reference to this object,
	Current drawing context,
	WorldPosition object
)
- Called every step and used for any needed object rendering

-- Collision
{}
- Contains an object containing points used for collision testing - objects come from the global Collision object

-- Events
{}
- Holds any events this object is registered to receive

-- Data
{}
- Object used for holding any miscellaneous instance data

-- AngleTo
(
	Object to compare this one against
)
- Used for finding the angle between this object and another one, relative to the horizon line