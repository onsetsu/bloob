Bloob.MapBuilder = {
	"onLoad": function(callBack) {
		Bloob.MapBuilder.__callback__ = callBack;
		return Bloob.MapBuilder;
	},
	"buildParticleAt": function(world, translate, rotate, scale) {
		return Jello.BodyFactory.createBluePrint(Jello.Body)
			.world(world)
			.shape(Bloob.ShapeBuilder.Shapes.Particle)
			.pointMasses(1)
			.translate(translate)
			.rotate(rotate)
			.scale(scale)
			.isKinematic(false)
			.build();
	},
	"buildGroundRectangle": function(world, upperLeft, lowerRight, rotate) {
		var groundShape = Bloob.ShapeBuilder.Shapes.Cube;

		var groundBody = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
			.world(world)
			.shape(groundShape)
			.pointMasses(Bloob.Utils.fillArray(0, groundShape.getVertices().length))
			.translate(upperLeft.add(lowerRight).mulFloat(0.5))
			.rotate(rotate || 0)
			.scale(lowerRight.sub(upperLeft))
			.isKinematic(false)
			.edgeSpringK(300)
			.edgeSpringDamp(20)
			.shapeSpringK(150)
			.shapeSpringDamp(15)
			.build();
		groundBody.aName = "ground";

		return groundBody;
	},
	"generateRoundShape": function(m, r, startAngle, endAngle, step, context, callback) {
		var innerAddVertex = function(i) {
			callback.call(
				context,
				m.add(
					new Vector2(
						Math.cos(-i * (Math.PI / 180)),
						Math.sin(-i * (Math.PI / 180))
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
	"setUpTestMap": function(scene) {
		var particleBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
			.world(scene.world)
			.shape(Bloob.ShapeBuilder.Shapes.Particle)
			.pointMasses(1);
			
		/*
		 *  GROUND SHAPE
		 */
		var groundShapeScale = new Vector2(9,1.5);
		
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 2; j++) {
				var middle = new Vector2(2*18*i, -15 + 36.5*j);
				var groundBody = Bloob.MapBuilder.buildGroundRectangle(
					scene.world,
					middle.sub(groundShapeScale),
					middle.add(groundShapeScale)
				);

			};
		};
		
		var middle = new Vector2(-2, -25 + 36.5);
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			scene.world,
			middle.sub(groundShapeScale),
			middle.add(groundShapeScale),
			3*Math.PI/2
		);

		var middle = new Vector2(-2-10, -25 + 36.5+10);
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			scene.world,
			middle.sub(groundShapeScale),
			middle.add(groundShapeScale),
			3*Math.PI/4
		);

		/*
		 *  Moving Ground:
		 */
		var groundBody = Bloob.MapBuilder.buildGroundRectangle(
			scene.world,
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
				this.body.setKinematicPosition(
					this.body.mDerivedPos.add(
					new Vector2(-0.0,0.1))
				);
				//this.body.setKinematicScale(new Vector2(0, 0));
			}
		};
		groundBody.setEntity(movingGround);
		scene.logic.addEntity(movingGround);

		/*
		 *  Special (Round) Ground:
		 */
		var groundShape = new Jello.ClosedShape()
			.begin();
		Bloob.MapBuilder.generateRoundShape(new Vector2(0,0), 15.0, 270, 90, 20, groundShape, groundShape.addVertex);
		groundShape
			.addVertex(new Vector2(  0,-20))
			.addVertex(new Vector2(-20,-20))
			.addVertex(new Vector2(-20, 20))
			.addVertex(new Vector2(  0, 20))
			.finish();
		
		var loftBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
			.world(scene.world)
			.shape(groundShape)
			.pointMasses(Bloob.Utils.fillArray(0, groundShape.getVertices().length))
			.translate(new Vector2(-75, 23))
			.rotate(Math.PI/2)
			.scale(Vector2.One.copy())
			.isKinematic(false);
		var groundBody = loftBluePrint.build();
		groundBody.aName = "ground";
		
		/*
		 *  Fuzzy Ellipse:
		 */
		function fuzzyEllipseGround(world, translate, rotate, scale) {
			var groundShape = new Jello.ClosedShape().begin();
			for(var i = 0; i <= 360; i += Math.floor(Math.random() * 60))
				groundShape.addVertex(new Vector2(
					Math.cos(-i * (Math.PI / 180)),
					Math.sin(-i * (Math.PI / 180))
				));
			groundShape.finish();
			
			return Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(groundShape)
				.pointMasses(Bloob.Utils.fillArray(0, groundShape.getVertices().length))
				.translate(translate)
				.rotate(rotate)
				.scale(scale)
				.isKinematic(false)
				.build();
		};
		
		for(var i = 0; i < 10; i++)
			fuzzyEllipseGround(
				scene.world,
				new Vector2(Math.floor(Math.random() * -100) - 30, Math.floor(Math.random() * -100) - 30),
				0,
				new Vector2(Math.floor(Math.random() * 60), Math.floor(Math.random() * 20))
			);
		
		/*
		 *  Jelly Ground:
		 */
		var groundShape = new Jello.ClosedShape()
			.begin();
			// bottom Row
			for(var i = 1; i >= -1; i-= 0.25)
				groundShape.addVertex(new Vector2( i, -1));
			for(var i = -1; i <= 1; i+= 0.25)
				groundShape.addVertex(new Vector2( i,  1));
			groundShape.finish();

		var mass = 1 ;
		var groundBody = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
			.world(scene.world)
			.shape(groundShape)
			.pointMasses([
				0,0,0,0,0,0,0,0,0,
				mass,mass,mass,mass,mass,mass,mass,mass,mass,mass
			])
			.translate(new Vector2(-50, -16)) // translate
			.rotate(0) // rotate
			.scale(new Vector2(18, 3)) // scale
			.isKinematic(false)
			.edgeSpringK(150.0) // float ,
			.edgeSpringDamp(5.0) // float ,
			.shapeSpringK(10.0) // float ,
			.shapeSpringDamp(5.0) // float ,
			.build();

		groundBody.aName = "ground";
		
		// add springs
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
		
		/*
		 *  jelly cubes
		 */
		var center = new Vector2(50, 50);
		loftBluePrint.translate(center).build();
		
		var jellyCubeBluePrint = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
			.world(scene.world)
			.shape(Bloob.ShapeBuilder.Shapes.Cube)
			.pointMasses(1)
			.rotate(0)
			.scale(Vector2.One.copy())
			.isKinematic(false)
			.edgeSpringK(300.0)
			.edgeSpringDamp(5.0)
			.shapeSpringK(150.0)
			.shapeSpringDamp(5.0)
			
			.addInternalSpring(0, 2, 300, 10)
			.addInternalSpring(1, 3, 300, 10);
		
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				var body = jellyCubeBluePrint
					.translate(new Vector2(2*i, 2*j).add(center))
					.build();
				body.aName = "Jelly";
			}
		};

		/*
		 *  material test
		 */
		var numberOfCubes = 4;
		for(var i = 0; i < numberOfCubes; i++) {
			scene.world.materialManager.addMaterial(i);
		};
		for(var i = 0; i < numberOfCubes; i++) {
			for(var j = 0; j < numberOfCubes; j++) {
				scene.world.materialManager.setMaterialPairCollide(i, j, true);
				scene.world.materialManager.setMaterialPairData(i, j, 
					1,//i/numberOfCubes,//i/(numberOfCubes-1)+0.2,
					i/numberOfCubes//j/(numberOfCubes-1)+0.2
				);
				scene.world.materialManager.setMaterialPairFilterCallback(i, j, new Jello.CollisionCallback());
			};
		};

		var origin = new Vector2(50, 10);

		var shape = Bloob.ShapeBuilder.Shapes.Cube;
		var particleShape = Bloob.ShapeBuilder.Shapes.Particle;

		for(var i = 0; i < numberOfCubes; i++) {
			// materialized ground
			var body = new Jello.Body(
				scene.world,
				shape,
				Bloob.Utils.fillArray(0, //Number.POSITIVE_INFINITY
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
				var body = new Jello.Body(
					scene.world,
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
		var body = new Jello.SpringBody(
			scene.world,
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
		var body2 = new Jello.SpringBody(
			scene.world,
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
			scene.world,
			body, 2,
			body2, 1
		);

		/*
		 *  (sticky) preasure balls:
		 */
		var center = new Vector2(200, 50);
		loftBluePrint.translate(center).build();

		var pressureBallBluePrint = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
			.world(scene.world)
			.shape(Bloob.ShapeBuilder.Shapes.Ball)
			.pointMasses(1)
			.rotate(0)
			.isKinematic(false)
			.edgeSpringK(300.0)
			.edgeSpringDamp(20.0)
			.shapeSpringK(10.0)
			.shapeSpringDamp(1.0);
		var pb;
		for (x = 6; x <= 16; x+=10) {
			pb = pressureBallBluePrint
				.translate(new Vector2(x, 17).add(center))
				.scale(Vector2.One.copy().mulFloat(2.0))
				.gasPressure(100.0 + 10 * x)
				.build();
			pb.aName = "Sticky Blob";
			var blob = new Bloob.Entity();
			scene.logic.addEntity(blob);
			pb.setEntity(blob);
		}

		/*
		 *  secrets/collectibles:
		 *  highly depend on contacts
		 */
		var collectibleBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
			.world(scene.world)
			.shape(Bloob.ShapeBuilder.Shapes.Diamond)
			.pointMasses(0)
			.scale(Vector2.One.copy())
			.isKinematic(false);
		
		for(var i = 0; i < 360; i += 20) {
			var radius = 12;
			var diamond = collectibleBluePrint
				.translate(new Vector2(
						radius * Math.cos(-i * (Math.PI / 180)),
						radius * Math.sin(-i * (Math.PI / 180))
					).add(new Vector2(-15,4)))
				.rotate(-i * (Math.PI / 180) + Math.PI/2)
				.build();

			var diamondHandler = new Bloob.Entity();
			diamondHandler.onStartContact = function(otherBody, contact) {
				if(typeof otherBody.entity !== "undefined")
					 scene.world.queue().removeBody(this.body);
			};
			scene.logic.addEntity(diamondHandler);
			diamond.setEntity(diamondHandler);
		};

		/*
		 *  I:
		 */
		var center = new Vector2(100, 50);
		loftBluePrint.translate(center).build();

		var iBluePrint = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
			.world(scene.world)
			.shape(Bloob.ShapeBuilder.Shapes.I)
			.pointMasses(1)
			.rotate(0)
			.scale(Vector2.One.copy().mulFloat(2.0))
			.isKinematic(false)
			.edgeSpringK(150.0)
			.edgeSpringDamp(5.0)
			.shapeSpringK(300.0)
			.shapeSpringDamp(15.0)
			
			.addInternalSpring(0, 14, 300.0, 10.0)
			.addInternalSpring(1, 14, 300.0, 10.0)
			.addInternalSpring(1, 15, 300.0, 10.0)
			.addInternalSpring(1, 5, 300.0, 10.0)
			.addInternalSpring(2, 14, 300.0, 10.0)
			.addInternalSpring(2, 5, 300.0, 10.0)
			.addInternalSpring(1, 5, 300.0, 10.0)
			.addInternalSpring(14, 5, 300.0, 10.0)
			.addInternalSpring(2, 4, 300.0, 10.0)
			.addInternalSpring(3, 5, 300.0, 10.0)
			.addInternalSpring(14, 6, 300.0, 10.0)
			.addInternalSpring(5, 13, 300.0, 10.0)
			.addInternalSpring(13, 6, 300.0, 10.0)
			.addInternalSpring(12, 10, 300.0, 10.0)
			.addInternalSpring(13, 11, 300.0, 10.0)
			.addInternalSpring(13, 10, 300.0, 10.0)
			.addInternalSpring(13, 9, 300.0, 10.0)
			.addInternalSpring(6, 10, 300.0, 10.0)
			.addInternalSpring(6, 9, 300.0, 10.0)
			.addInternalSpring(6, 8, 300.0, 10.0)
			.addInternalSpring(7, 9, 300.0, 10.0);

		for (i = 0; i <= 30; i+=15) {
			iBluePrint
				.translate(new Vector2(0, i).add(center))
				.build();
		}

		/*
		 *  Test: Particles
		 */
		var center = new Vector2(150, 50);
		loftBluePrint.translate(center).build();
		
		var particle;
		for (i = 0; i <= 2; i++) {
			for (j = 0; j <= 3; j++) {
				particle = particleBluePrint
					.translate(new Vector2(0 + i, 15 + j).add(center))
					.build();
			}
		}
				
		/*
		 *  Rays
		 */
		var ray = new Ray(scene.world, new Vector2(-10, -5), new Vector2(1, 0.5));

		/*
		 *  InterpolationJoint Test
		 */
		var lastParticle = particle;
		particle = particleBluePrint
			.translate(new Vector2(0 + 1 * i, 8))
			.build();
		new InterpolationJoint(
			scene.world,
			body, 0,
			lastParticle, 0,
			particle, 0,
			0.8
		);

		/*
		 *  Particle Chain & Web
		 */
		var center = new Vector2(-20, 50);
		var particleWeb = [];
		
		var max = 3;
		for(var i = 0; i < max; i++) {
			particleWeb[i] = [];
			for(var j = 0; j < max; j++) {
				particleWeb[i][j] = particleBluePrint
					.translate(new Vector2(i,j).mulFloat(2).add(center))
					.build();
			}
		}
		i--;
		j--;
		particleWeb[0][0].pointMasses[0].Mass = 0;
		particleWeb[0][max-1].pointMasses[0].Mass = 0;
		particleWeb[max-1][0].pointMasses[0].Mass = 0;
		particleWeb[max-1][max-1].pointMasses[0].Mass = 0;
		
		for(var i = 1; i < max; i++) {
			for(var j = 1; j < max; j++) {
				new DistanceJoint(
						scene.world,
						particleWeb[i-1][j-1], 0,
						particleWeb[i][j], 0,
						0.0,
						1050.0,
						15.0
					);
				new DistanceJoint(
						scene.world,
						particleWeb[i][j], 0,
						particleWeb[i][j], 0,
						0.0,
						1050.0,
						15.0
					);
			}
		}
		
		
		var particle1, particle2;
		for(var i = 0; i < 10; i++) {
			particle2 = particleBluePrint
				.translate(new Vector2(0 + 1 * i, 8))
				.build();
			
			if(typeof particle1 === "undefined") {
				particle2.pointMasses[0].Mass = 0;
			} else {
				new DistanceJoint(
					scene.world,
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
		var stickShape = new Jello.ClosedShape()
			.begin()
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(1.0, 0.0))
			.addVertex(new Vector2(1.0, 0.3))
			.addVertex(new Vector2(0.0, 0.3))
			.finish();
		
		var stick = new Jello.SpringBody(
			scene.world,
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
			var stick2 = new Jello.SpringBody(
				scene.world,
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
				scene.world,
				stick, 1,
				stick2, 0
			);
			new PinJoint(
				scene.world,
				stick, 3,
				stick2, 2
			);
			stick = stick2;
		};
		stick2.pointMasses[1].Mass = 0;
		
		/*
		 *  Chain of Sticks 2
		 */
		var stickShape = new Jello.ClosedShape()
			.begin()
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(0.0, 0.0))
			.addVertex(new Vector2(0.0, 0.1))
			.addVertex(new Vector2(0.0, 0.1))
			.finish();
		
		var center = new Vector2(-30, -25);
		var stick = new Jello.SpringBody(
			scene.world,
			stickShape,
			1,
			center,
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
			var stick2 = new Jello.SpringBody(
				scene.world,
				stickShape,
				1,
				new Vector2(3*i, 0).add(center),
				0.0,
				Vector2.One.copy().mulFloat(3),
				false,
				450.0,
				5.0,
				300.0,
				15.0
			);
			new PinJoint(
				scene.world,
				stick, 1,
				stick2, 0
			);
			new PinJoint(
				scene.world,
				stick, 2,
				stick2, 3
			);
			stick = stick2;
		};
		stick2.pointMasses[1].Mass = 0;
		stick2.pointMasses[2].Mass = 0;
		/*
		 *  TEST: ParticleCannon:
		 */
		var cannon = new Jello.ParticleCannon()
			.bluePrint(iBluePrint.translate(Vector2.Zero.copy()))
			.addToWorld(scene.world);
		
		/*
		 *  TODO:
		 *  Body of Water: FLUIDS
		 */
		var center = new Vector2(0, 50);
		loftBluePrint.translate(center).build();

		/*
		 *  END OF OBJECTS
		 */

		if(typeof Bloob.MapBuilder.__callback__ == "function")
			Bloob.MapBuilder.__callback__();
	}
};
