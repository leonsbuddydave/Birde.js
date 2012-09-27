WorldObject = 
{
	/*
		The WorldObject class is by default defined as a simple object, with the Update event undefined.
		If a WorldObject is instantiated and drawn on the screen without first overriding the Draw method,
		it will load a default sprite into memory and draw it on the screen at the object's (x, y) coordinates.
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
	
	New : function()
	{
		return DeepCopy(this);
	},
	
	Class: "GENERIC",
	
	Position:
	{
		type: POSITION_TYPE.World,
		x : 0,
		y : 0,
		z : 0 // Used for object layering
	},
	
	Children : [], // Children of this node are tied to it and will die when it does
	
	/*
		Update event is undefined for a blank world object - must be overridden by subclasses
		The update function is also responsible for updating its children - the world will not do that on its own
	*/
	Update: function(Me, dt) {
		// Called every step
		console.log("WorldObject's update method.");
	},
	
	
	/*
		Draw event, by default, loads a sprite if it hasn't been overriden by a child object.
		This behavior is subject to change to prevent control objects needing Draw overrides.
	*/
	Draw: function(Me, Context, WorldPosition)
	{
		if (typeof this.Data.Sprite == 'undefined')
		{
			this.Data.Sprite = new Image();
			this.Data.Sprite.src = 'assets/red_ball.png';
		}
		
		Context.drawImage(this.Data.Sprite, this.Position.x, this.Position.y);
	},
	
	AddEvent: function(EventName, EventActions)
	{
		this.Events[EventName] = EventActions;
	},
	
	Events:
	{
		me : this
	},
	
	Reactions:
	{
		me : this
	},
	
	Data: {} // Data object is used for any miscellaneous data storage
}