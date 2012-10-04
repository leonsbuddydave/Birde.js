WorldObject = 
{
	/*
		The WorldObject class is by default defined as a simple object, with the Update event undefined.
		If a WorldObject is instantiated and drawn on the screen without first overriding the Draw method,
		it will load a default sprite into memory and draw it on the screen at the object's (x, y) coordinates.
	*/
	
	/*
		Extend
		-- Child (new object that will extend this one)
		
		Creates a child class based on this one.
	*/
	Extend : function(Child)
	{
		for (var prop in this)
		{
			if (typeof Child[prop] == 'undefined')
				Child[prop] = this[prop];
		}
		return Child;
	},
	
	/*
		New
		
		Returns a new instance of this object.
	*/
	New : function()
	{
		return DeepCopy(this);
	},
	
	/*
		Init
		
		Basically a constructor for this object. Not often useful, but available if needed.
		Called when the object is added to the scene graph.
	*/
	Init : function(Me){},
	
	/*
		Class identifier. Used for checking the type of an object during collision,
		or for grabbing all objects of a given class.
	*/
	Class: "Generic",

	/*
		Coordinates (x, y, z)
		
		Refer to the objects position in the world.
	*/
	x : 0,
	y : 0,
	z : 0, // Used for object layering
	
	/*
		Children
		
		Contains any and all children of this object. Children of the object move and are drawn
		relative to its coordinate space by default.
	*/
	Children : [],
	
	/*
		Update
		-- Me (reference to this object)
		-- dt (time step)
		Called every frame step, used for updating the internal components of this object.
		Objects don't do anything unless this is overriden.
		
		May be responsible for updating the children of this object - not sure yet.
	*/
	Update: function(Me, dt)
	{
		console.log("Update method not overridden - what the fuck do you think you'll get done with this?");
	},
	
	/*
		Draw
		-- Me (reference to this object)
		-- Context (drawing context)
		-- WorldPosition (the current position of the world, in case it needs to be used for relative drawing)
		
		Draw event, by default, loads a sprite if it hasn't been overriden by a child object.
		This behavior is subject to change to prevent control objects needing Draw overrides.
	*/
	Draw: function(Me, Context, WorldPosition)
	{
		if (typeof Me.Data.Sprite == 'undefined')
		{
			Me.Data.Sprite = new Image();
			Me.Data.Sprite.src = 'assets/red_ball.png';
		}
		Context.drawImage(Me.Data.Sprite, Me.x - Me.Data.Sprite.width / 2, Me.y - Me.Data.Sprite.height / 2);
	},
	
	/*
		Collision object
		
		Holds information about this object's collision box, if it has one
	*/
	Collision : {},
	
	/*
		Events object
		
		Holds references to all the events this object reacts to
	*/
	Events: {},
	
	/*
		Data object
		
		Generic object used to store information about this object;
		prevents the root of the object from being cluttered with storage
	*/
	Data: {},
	
	/*
		AngleTo
		-- obj (another instance of WorldObject or a subclass of such)
		
		Returns the angle of this object to another
	*/
	AngleTo : function(obj)
	{
		return Math.fullAngleBetween(this.x, this.y, obj.x, obj.y);
	}
}