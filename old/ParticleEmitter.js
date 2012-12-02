ParticleEmitter = WorldObject.Extend({
	// Acknowledged props
	// x
	// y
	// density
	// type

	x: 500,
	y: 500,
	density : 0,
	enabled : 0,
	Particles : [],
	Type : "simple",

	Class : "ParticleEmitter",

	Init : function(Me, props)
	{
		props = props || {};
		Me.x = props.x || 0;
		Me.y = props.y || 0;
		Me.density = props.density || 0;
		Me.enabled = props.enabled || 0;

		Me.Particles = [];

		Me.Type = props.type.toLowerCase() || "simple";
	},

	AddParticle : function(Me, type)
	{
		Me.Particles.push( new Particle[type](Me.x, Me.y) );
	},

	Update : function(Me, dt)
	{
		// Add new particles Me second
		var NumParticlesToCreate = dt * Me.density;
		var i = 0;
		while (i < NumParticlesToCreate)
		{
			Me.AddParticle(Me, Me.Type);
			i++;
		}

		// Now update all the particles that are there
		i = 0;
		var NewParticles = [];
		while (i < Me.Particles.length)
		{
			var p = Me.Particles[i];
			p.update(dt);
			if (!p.lifetime || p.lifetime >= 0)
			{
				if (!p.kill)
					NewParticles.push(p);
			}
			i++;
		}

		Me.Particles = NewParticles;
	},

	Draw : function(Me, c)
	{
		var i = 0;
		while (i < Me.Particles.length)
		{
			var p = Me.Particles[i];
			c.save();
			p.draw(c);
			c.restore();
			i++;
		}
	}
});