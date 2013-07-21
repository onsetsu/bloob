Bloob.MapBuilder = {
	"load": function(file) {
		Bloob.Loader.loadShape(file, function(json) {
			throw Error("TODO: to implement");
			
			Bloob.MapBuilder.__callback__();
		});
	},
	
	"onLoad": function(callBack) {
		Bloob.MapBuilder.__callback__ = callBack;
		return Bloob.MapBuilder;
	},
	"buildParticleAt": function(world, translate, rotate, scale) {
		return new Body(
			world,
			new ClosedShape()
				.begin()
				.addVertex(new Vector2(0.0, 0.0))
				.finish(),
			1,
			translate,
			rotate,
			scale,
			false
		);
	},
	"buildGroundRectangle": function(world, upperLeft, lowerRight, rotate) {
		var groundShape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(-1,-1))
			.addVertex(new Vector2(-1, 1))
			.addVertex(new Vector2( 1, 1))
			.addVertex(new Vector2( 1,-1))
			.finish();

		var groundBody = new SpringBody(
			world,
			groundShape,
			Utils.fillArray(
				0,
				groundShape.getVertices().length
			),
			upperLeft.add(lowerRight).mulFloat(0.5),
			rotate || 0,
			lowerRight.sub(upperLeft),
			false,
			300,
			20,
			150,
			15
		);
		groundBody.aName = "ground";

		return groundBody;
	},
	"generateRoundShape": function(m, r, startAngle, endAngle, step, context, callback) {
		var innerAddVertex = function(i) {
			callback.call(
				context,
				m.add(
					new Vector2(
						Math.cos(-i * (PI / 180)),
						Math.sin(-i * (PI / 180))
					).mulFloat(r)
				)
			);
		};
		step = step || 1;
		step = Math.abs(step);
		if(startAngle < endAngle)
			for(var i = startAngle; i <= endAngle; i += step)
				innerAddVertex(i);
		else
			for(var i = startAngle; i >= endAngle; i -= step)
				innerAddVertex(i);
	},
	"setUpTestMap": function(game) {
		Bloob.MapBuilder.buildGroundRectangle(
			game.world,
			new Vector2(-2,-4),
			new Vector2(2,4),
			PI/4
		);
		/*
		 *  GROUND SHAPE
		 */
		var groundShapeScale = new Vector2(9,1.5);
		
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 2; j++) {
				var middle = new Vector2(2*18*i, -15 + 36.5*j);
				var groundBody = Bloob.MapBuilder.buildGroundRectangle(
					game.world,
					middle.sub(groundShapeScale),
					middle.add(groundShapeScale)
				);

			};
		};
		
		var middle = new Vector2(-2, -25 + 36.5);
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			game.world,
			middle.sub(groundShapeScale),
			middle.add(groundShapeScale),
			3*PI/2
		);

		var middle = new Vector2(-2-10, -25 + 36.5+10);
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			game.world,
			middle.sub(groundShapeScale),
			middle.add(groundShapeScale),
			3*PI/4
		);

		/*
		 *  Moving Ground:
		 */
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			game.world,
			new Vector2(-60,-2),
			new Vector2(-45,2)
		);
		//groundBody.mIsStatic = true;
		groundBody.mKinematic = true;
		var movingGround = new Bloob.Entity();
		movingGround.update = function() {
			this.counter = this.counter + 1 || 0;
			if(this.counter == 10) {
				this.counter = 0;
				Scarlet.log(this.counter);
				this.body.setKinematicPosition(
					this.body.mDerivedPos.add(
					new Vector2(-0.0,0.1))
				);
				//this.body.setKinematicScale(new Vector2(0, 0));
			}
		};
		groundBody.setEntity(movingGround);
		game.logic.addEntity(movingGround);

		/*
		 *  Special Ground:
		 */
		var groundShape = new ClosedShape()
			.begin();
		Bloob.MapBuilder.generateRoundShape(new Vector2(0,0), 15.0, 270, 90, 20, groundShape, groundShape.addVertex);
		groundShape
			.addVertex(new Vector2(  0,-20))
			.addVertex(new Vector2(-20,-20))
			.addVertex(new Vector2(-20, 20))
			.addVertex(new Vector2(  0, 20))
			.finish();
		
		var groundBody = new Body(
			game.world,
			groundShape,
			Utils.fillArray(0, groundShape.getVertices().length),
			new Vector2(-25, 3), // translate
			0, // rotate
			Vector2.One.copy(), // scale
			false
		);
		groundBody.aName = "ground";
		
		/*
		var groundShape = new ClosedShape()
			.begin()
			// bottom Row
			for(var i = 1; i >= -1; i-= 0.25)
				groundShape.addVertex(new Vector2( i, -1));
			for(var i = -1; i <= 1; i+= 0.25)
				groundShape.addVertex(new Vector2( i,  1));
			groundShape.finish();

		var mass = 1 
		var groundBody = new SpringBody(
			game.world,
			groundShape,
			[
				0,0,0,0,0,0,0,0,0,
				mass,mass,mass,mass,mass,mass,mass,mass,mass,mass
			],
			//Utils.fillArray(0, //Number.POSITIVE_INFINITY
				//groundShape.getVertices().length),
			new Vector2(0, -16), // translate
			0, // rotate
			new Vector2(18, 3), // scale
			false,
					150.0, // float edgeSpringK,
					5.0, // float edgeSpringDamp,
					10.0, // float shapeSpringK,
					5.0 // float shapeSpringDamp,
		);
		groundBody.aName = "ground";
		var length = groundBody.mPointCount;
		var
			bottomMin = 0,
			bottomMax = length/2 - 1,
			topMin = length/2,
			topMax = length - 1;
		var
			indexBottom = bottomMin + 1,
			indexTop = topMax - 1;
		while(Math.abs(indexBottom - indexTop) >= 2)
			groundBody.addInternalSpring(indexBottom++, indexTop--, 300.0, 10.0);

		indexBottom = bottomMin + 1;
		indexTop = topMax;
		while(Math.abs(indexBottom - indexTop) >= 2)
			groundBody.addInternalSpring(indexBottom++, indexTop--, 300.0, 10.0);

		indexBottom = bottomMin;
		indexTop = topMax - 1;
		while(Math.abs(indexBottom - indexTop) >= 2)
			groundBody.addInternalSpring(indexBottom++, indexTop--, 300.0, 10.0);
		*/
		
		/*
		 *  jelly cubes
		 */
		
		var shape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(-1, -1))
			.addVertex(new Vector2(-1,  1))
			.addVertex(new Vector2( 1,  1))
			.addVertex(new Vector2( 1, -1))
			.finish();

		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				var body = new SpringBody(
					game.world,
					shape,
					1, // mass per point
					new Vector2(25+2*i, 2*j), // translate
					0, // rotate
					Vector2.One.copy().mulFloat(1.0), // scale
					false,
					
					// new:
					300.0, // float edgeSpringK,
					5.0, // float edgeSpringDamp,
					150.0, // float shapeSpringK,
					5.0 // float shapeSpringDamp,
				);
				body.aName = "Jelly";
								
				body.addInternalSpring(0, 2, 300, 10);
				body.addInternalSpring(1, 3, 300, 10);
			}
		};

		/*
		 *  material test
		 */
		var numberOfCubes = 4
		for(var i = 0; i < numberOfCubes; i++) {
			game.world.materialManager.addMaterial(i);
		};
		for(var i = 0; i < numberOfCubes; i++) {
			for(var j = 0; j < numberOfCubes; j++) {
				game.world.materialManager.setMaterialPairCollide(i, j, true);
				game.world.materialManager.setMaterialPairData(i, j, 
					1,//i/numberOfCubes,//i/(numberOfCubes-1)+0.2,
					i/numberOfCubes//j/(numberOfCubes-1)+0.2
				);
				game.world.materialManager.setMaterialPairFilterCallback(i, j, new CollisionCallback());
			};
		};

		var origin = new Vector2(50, 10);

		var shape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(-1, -1))
			.addVertex(new Vector2(-1,  1))
			.addVertex(new Vector2( 1,  1))
			.addVertex(new Vector2( 1, -1))
			.finish();
		var particleShape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(0, 0))
			.finish();

		for(var i = 0; i < numberOfCubes; i++) {
			// materialized ground
			var body = new Body(
				game.world,
				shape,
				Utils.fillArray(0, //Number.POSITIVE_INFINITY
					shape.getVertices().length),
				new Vector2(3*numberOfCubes*i + origin.x, -10+origin.y), // translate
				0, // rotate
				new Vector2(3*numberOfCubes/2, 1), // scale
				false
			);
			body.aName = "Jelly";
			body.setMaterial(i);
		
			for(var j = 0; j < numberOfCubes; j++) {
				// particle
				var body = new Body(
					game.world,
					particleShape,
					1, // mass per point
					new Vector2(3*numberOfCubes*i + 3*j - 4.25 + origin.x, 5+origin.y), // translate
					0, // rotate
					Vector2.One.copy().mulFloat(1.0), // scale
					false
				);
				body.aName = "Jelly";
				body.setMaterial(j);
			}
		};

		/*
		 *  TEST PINJOINT
		 */
		var origin = new Vector2(40, 20);
		var body = new SpringBody(
			game.world,
			shape,
			1, // mass per point
			new Vector2(-2, -9).add(origin), // translate
			0, // rotate
			Vector2.One.copy().mulFloat(1.0), // scale
			false,
			
			// new:
			300.0, // float edgeSpringK,
			5.0, // float edgeSpringDamp,
			150.0, // float shapeSpringK,
			5.0 // float shapeSpringDamp,
		);
		body.addInternalSpring(0, 2, 300, 10);
		body.addInternalSpring(1, 3, 300, 10);
		var body2 = new SpringBody(
			game.world,
			shape,
			1, // mass per point
			new Vector2(0, -9).add(origin), // translate
			0, // rotate
			Vector2.One.copy().mulFloat(1.0), // scale
			false,
			
			// new:
			300.0, // float edgeSpringK,
			5.0, // float edgeSpringDamp,
			150.0, // float shapeSpringK,
			5.0 // float shapeSpringDamp,
		);
		body2.addInternalSpring(0, 2, 300, 10);
		body2.addInternalSpring(1, 3, 300, 10);
		new PinJoint(
			game.world,
			body, 2,
			body2, 1
		);

		/*
		 *  (sticky) preasure balls:
		 */
		var ball = new ClosedShape();
		ball.begin();
		for (var i = 0; i < 360; i += 20) {
			ball.addVertex(
				new Vector2(
					Math.cos(-i * (PI / 180)),
					Math.sin(-i * (PI / 180))
				)
			);
		}
		ball.finish();
		
		var pb;
		for (x = 6; x <= 16; x+=10) {
			for (y = 17; y <= 17; y+=8) {
				pb = new PressureBody(
					game.world,
					ball,
					1.0,
					new Vector2(x, y),
					0,
					Vector2.One.copy().mulFloat(2.0),
					false,
					300.0,
					20.0,
					10.0,
					1.0,

					100.0 + 10 * x // gas pressure
				);
			pb.aName = "Sticky Blob";
			var blob = new Bloob.Entity();
			game.logic.addEntity(blob);
			pb.setEntity(blob);
			//blob.makeSticky();

			}
		}
		/*
		for (x = -20; x <= 0; x+=5) {
			for (y = -20; y <= 20; y+=5) {
				pb = new PressureBody(
					game.world,
					ball,
					1.0,
					new Vector2(x, y),
					0,
					Vector2.One.copy().mulFloat(2.0),
					false,
					300.0,
					20.0,
					10.0,
					1.0,

					100.0 //+ 20 // gas pressure
				);
			pb.aName = "Sticky Blob";
			}
		}
		*/

		/*
		 *  controllable blob:
		 */
		var ball = new ClosedShape();
		ball.begin();
		for (var i = 0; i < 360; i += 20) {
			ball.addVertex(
				new Vector2(
					Math.cos(-i * (PI / 180)),
					Math.sin(-i * (PI / 180))
				)
			);
		}
		ball.finish();
		
		var pb = new PressureBody(
			game.world,
			ball,
			1.0,
			new Vector2(-25, 15),
			0,
			Vector2.One.copy().mulFloat(2.0),
			false,

			300.0,
			20.0,
			150.0,
			1.0,

			100.0
		);
		
		pb.aName = "Player";
		var input = new Scarlet.Input(game.renderer.canvasId);
		input.initKeyboard();
		input.bind(Scarlet.KEY.LEFT_ARROW, "left");
		input.bind(Scarlet.KEY.RIGHT_ARROW, "right");
		input.bind(Scarlet.KEY.UP_ARROW, "up");
		input.bind(Scarlet.KEY.DOWN_ARROW, "down");
		input.bind(Scarlet.KEY.DOWN_ARROW, "compress");

		var blob = new Bloob.Entity();
		blob.update = function(x) {
			if(input.state("left")) {
				//this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(-3, 0));
				this.body.addGlobalRotationForce(10);
			} else if(input.state("right")) {
				//this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(3, 0));
				this.body.addGlobalRotationForce(-10);
			} else if(input.state("up")) {
				this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(0, 3));
			} else if(input.state("down")) {
				this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(0, -3));
			};
			if(input.pressed("compress")) {
				this.body.setGasPressure(this.body.getGasPressure() / 10);
				this.body.setShapeMatchingConstants(250, 5);
			} else if(input.released("compress")) {
				this.body.setGasPressure(this.body.getGasPressure() * 10);
				this.body.setShapeMatchingConstants(150, 1);
			};
			input.clearPressed();

		};
		game.logic.addEntity(blob);
		pb.setEntity(blob);
		blob.makeSticky();

		// track camera focus on blob
		game.camera.bodyToTrack = pb;

		/*
		 *  round grounds:
		 */
		/*var groundShape = new ClosedShape();
		groundShape.begin();
		Bloob.MapBuilder.generateRoundShape(Vector2.Zero.copy(), 1.0, 0, 180, 20, groundShape, groundShape.addVertex);
		groundShape.finish();
		
		var pb = new PressureBody(
			game.world,
			groundShape,
			Utils.fillArray(
				0,
				groundShape.getVertices().length
			),
			new Vector2(-20, 5),
			0,
			Vector2.One.copy().mulFloat(2.0),
			false,

			300.0,
			20.0,
			150.0,
			1.0,

			100.0
		);

		/*
		 *  secrets/collectibles:
		 *  highly depend on contacts
		 */
		for(var i = 0; i < 360; i += 20) {
			var diamondShape = new ClosedShape()
				.begin()
				.addVertex(new Vector2( 0.5, 0.0))
				.addVertex(new Vector2( 0.0,-1.0))
				.addVertex(new Vector2(-0.5, 0.0))
				.addVertex(new Vector2( 0.0, 1.0))
				.finish();
			
			var radius = 12;
			var diamond = new Body(
				game.world,
				diamondShape,
				[0,0,0,0],
				new Vector2(
					radius * Math.cos(-i * (PI / 180)),
					radius * Math.sin(-i * (PI / 180))
				).add(new Vector2(-15,4)),
				-i * (PI / 180) + PI/2,
				Vector2.One.copy().mulFloat(1.0),
				false,

				300.0,
				20.0,
				150.0,
				1.0,

				100.0
			);

			var diamondHandler = new Bloob.Entity();
			diamondHandler.onStartContact = function(otherBody, contact) {
				if(typeof otherBody.entity !== "undefined")
					 game.world.queue().removeBody(this.body);
			};
			game.logic.addEntity(diamondHandler);
			diamond.setEntity(diamondHandler);
		};

		/*
		 *  I:
		 */
		var shape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(-1.5, 2.0))
			.addVertex(new Vector2(-0.5, 2.0))
			.addVertex(new Vector2(0.5, 2.0))
			.addVertex(new Vector2(1.5, 2.0))
			.addVertex(new Vector2(1.5, 1.0))
			.addVertex(new Vector2(0.5, 1.0))
			.addVertex(new Vector2(0.5, -1.0))
			.addVertex(new Vector2(1.5, -1.0))
			.addVertex(new Vector2(1.5, -2.0))
			.addVertex(new Vector2(0.5, -2.0))
			.addVertex(new Vector2(-0.5, -2.0))
			.addVertex(new Vector2(-1.5, -2.0))
			.addVertex(new Vector2(-1.5, -1.0))
			.addVertex(new Vector2(-0.5, -1.0))
			.addVertex(new Vector2(-0.5, 1.0))
			.addVertex(new Vector2(-1.5, 1.0))
			.finish();
		
		for (i = -5; i <= 25; i+=15) {

			var body = new SpringBody(
				game.world,
				shape,
				1,
				new Vector2(20, i),
				0.0,
				Vector2.One.copy().mulFloat(2),
				false,
				150.0,
				5.0,
				300.0,
				15.0
			);
			
			//new SpringBuilder(shape, body, 300.0, 15.).buildInternalSprings();
			//continue;

			body.addInternalSpring(0, 14, 300.0, 10.0);
			body.addInternalSpring(1, 14, 300.0, 10.0);
			body.addInternalSpring(1, 15, 300.0, 10.0);
			body.addInternalSpring(1, 5, 300.0, 10.0);
			body.addInternalSpring(2, 14, 300.0, 10.0);
			body.addInternalSpring(2, 5, 300.0, 10.0);
			body.addInternalSpring(1, 5, 300.0, 10.0);
			body.addInternalSpring(14, 5, 300.0, 10.0);
			body.addInternalSpring(2, 4, 300.0, 10.0);
			body.addInternalSpring(3, 5, 300.0, 10.0);
			body.addInternalSpring(14, 6, 300.0, 10.0);
			body.addInternalSpring(5, 13, 300.0, 10.0);
			body.addInternalSpring(13, 6, 300.0, 10.0);
			body.addInternalSpring(12, 10, 300.0, 10.0);
			body.addInternalSpring(13, 11, 300.0, 10.0);
			body.addInternalSpring(13, 10, 300.0, 10.0);
			body.addInternalSpring(13, 9, 300.0, 10.0);
			body.addInternalSpring(6, 10, 300.0, 10.0);
			body.addInternalSpring(6, 9, 300.0, 10.0);
			body.addInternalSpring(6, 8, 300.0, 10.0);
			body.addInternalSpring(7, 9, 300.0, 10.0);
		}

		/*
		 *  Test: Particles
		 */
		var shape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(0.0, 0.0))
			.finish();
		
		var particle;
		for (i = 0; i <= 2; i++) {
			for (j = 0; j <= 3; j++) {
				particle = Bloob.MapBuilder.buildParticleAt(
					game.world,
					new Vector2(0 + i, 15 + j),
					0.0,
					Vector2.One.copy().mulFloat(3)
				);
			}
		}
				
		/*
		 *  Rays
		 */
		var ray = new Ray(game.world, new Vector2(-10, -5), new Vector2(1, 0.5));

		/*
		 *  InterpolationJoint Test
		 */
		var lastParticle = particle;
		particle = Bloob.MapBuilder.buildParticleAt(
			game.world,
			new Vector2(0 + 1 * i, 8),
			0.0,
			Vector2.One.copy().mulFloat(3)
		);
		new InterpolationJoint(
			game.world,
			body, 0,
			lastParticle, 0,
			particle, 0,
			0.8
		);

		/*
		 *  Particle Chain
		 */
		var particle1, particle2
		for(var i = 0; i < 10; i++) {
			particle2 = Bloob.MapBuilder.buildParticleAt(
				game.world,
				new Vector2(0 + 1 * i, 8),
				0.0,
				Vector2.One.copy().mulFloat(3)
			);
			
			if(typeof particle1 === "undefined") {
				particle2.pointMasses[0].Mass = 0;
			} else {
				new DistanceJoint(
					game.world,
					particle1, 0,
					particle2, 0,
					0.0,
					1050.0,
					15.0
				);
			}
			particle1 = particle2;
		};
		particle2.pointMasses[0].Mass = 0;

		/*
		 *  Chain of Sticks HACK
		 */
		var stickShape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(1.0, 0.0))
			.addVertex(new Vector2(1.0, 0.3))
			.addVertex(new Vector2(0.0, 0.3))
			.finish();
		
		var stick = new SpringBody(
			game.world,
			stickShape,
			1,
			new Vector2(0+30, 12),
			0.0,
			Vector2.One.copy().mulFloat(2),
			false,
			150.0,
			5.0,
			300.0,
			15.0
		);
		stick.pointMasses[0].Mass = 0;
		for (i = 1; i <= 5; i++) {
			var stick2 = new SpringBody(
				game.world,
				stickShape,
				1,
				new Vector2(2*i+30, 12),
				0.0,
				Vector2.One.copy().mulFloat(2),
				false,
				150.0,
				5.0,
				300.0,
				15.0
			);
			new PinJoint(
				game.world,
				stick, 1,
				stick2, 0
			);
			new PinJoint(
				game.world,
				stick, 3,
				stick2, 2
			);
			stick = stick2;
		};
		stick2.pointMasses[1].Mass = 0;
		
		/*
		 *  Chain of Sticks 2
		 */
		var stickShape = new ClosedShape()
			.begin()
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(0.0, 0.1))
			.addVertex(new Vector2(0.0, 0.1))
			.finish();
		
		var stick = new SpringBody(
			game.world,
			stickShape,
			1,
			new Vector2(0-30, -15),
			0.0,
			Vector2.One.copy().mulFloat(2),
			false,
			450.0,
			5.0,
			300.0,
			15.0
		);
		stick.pointMasses[0].Mass = 0;
		stick.pointMasses[3].Mass = 0;
		for (i = 1; i <= 10; i++) {
			var stick2 = new SpringBody(
				game.world,
				stickShape,
				1,
				new Vector2(3*i-30, -15),
				0.0,
				Vector2.One.copy().mulFloat(3),
				false,
				450.0,
				5.0,
				300.0,
				15.0
			);
			new PinJoint(
				game.world,
				stick, 1,
				stick2, 0
			);
			new PinJoint(
				game.world,
				stick, 2,
				stick2, 3
			);
			stick = stick2;
		};
		stick2.pointMasses[1].Mass = 0;
		stick2.pointMasses[2].Mass = 0;
		
		
		/*
		 *  END OF OBJECTS
		 */

		Bloob.MapBuilder.__callback__();
	}
};
