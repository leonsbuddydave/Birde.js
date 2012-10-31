WorldObject = 
{
	/*
		The WorldObject class is by default defined as a simple object, with the Update event undefined.
		If a WorldObject is instantiated and drawn on the screen without first overriding the Draw method,
		it will load a default sprite into memory and draw it on the screen at the object's (x, y) coordinates.
	*/

	Call : function(Me, MethodName)
	{
		var arguments = Array.prototype.slice.call(arguments).slice(2);

		Me[MethodName](arguments);
	},
	
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
	
	// Scale of object
	// Used for collision checking and is available to the Draw method
	Scale : 1.0,
	
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
	Update: function(Me, dt) {},
	
	/*
		Draw
		-- Me (reference to this object)
		-- Context (drawing context)
		-- WorldPosition (the current position of the world, in case it needs to be used for relative drawing)
		
		Draw event, by default, loads a sprite if it hasn't been overriden by a child object.
		This behavior is subject to change to prevent control objects needing Draw overrides.
	*/
	Draw: function(Me, Context)
	{
		if (typeof Me.Data.Sprite == 'undefined')
		{
			Me.Data.Sprite = new Image();
			Me.Data.Sprite.src = 'assets/red_ball.png';
		}
		Context.drawImage(
			Me.Data.Sprite,
			Me.x - Me.Data.Sprite.width / 2 * Me.Scale,
			Me.y - Me.Data.Sprite.height / 2 * Me.Scale,
			Me.Data.Sprite.width * Me.Scale,
			Me.Data.Sprite.height * Me.Scale
		);
	},
	
	/*
		Collision object
		
		Holds information about this object's collision box, if it has one
	*/
	Collision : {},
	
	Sprites : {},
	
	UpdateSprites : function(Me, dt)
	{
		/*
		console.log( Assets.AssetCache[Me.Sprites[Me.SpriteData.CurSprite]] );
		if (Me.SpriteData.CurSprite == "" || !dt || typeof Assets.AssetCache[Me.Sprites[Me.SpriteData.CurSprite]] == 'undefined')
			return;
		*/

		var TimePerFrame = 1 / Me.SpriteData.Speed;
		
		Me.SpriteData.TimeLine += dt;
		
		if (Me.SpriteData.TimeLine >= 1)
		{	
			Me.SpriteData.TimeLine -= 1;
		}
		
		Me.SpriteData.CurFrame = Math.floor( Me.SpriteData.TimeLine * (Assets.AssetCache[Me.Sprites[Me.SpriteData.CurSprite]].Frames.length - 1) );

		if (isNaN(Me.SpriteData.CurFrame))
			Exception.Throw(EXCEPTION.FRAMEINDEXEXCEPTION, "WorldObject.UpdateSprites");
		//console.log( Me.SpriteData.CurFrame );
	},
	
	AddSprite : function(Me, name, spr)
	{
		// add new sprite
		Me.Sprites[name] = spr;
	},

	
	// Changes the current sprite
	ChangeSprite : function(Me, name, frame)
	{
		if (typeof frame == 'undefined')
			frame = 0;

		Me.SpriteData.CurSprite = name;
	},
	
	SpriteData :
	{
		CurFrame : 0,
		CurSprite : 0,
		Speed : 22,
		TimeLine : 0,
		TimelineEnd : 0
	},
	
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
	Data:
	{

	},
	
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