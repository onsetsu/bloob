mini.Module(
	"basic/mapbuilder"
)
.requires(
	"basic/shapebuilder",
	"basic/utils",
	"engine/input",
	"engine/map/entity",
	"bloob/entities/entitytest",
	"behaviour/trait",
	"logic/bodyenhancement"
)
.defines(function(
	ShapeBuilder,
	Utils,
	Input,
	Entity,
	EntityTest,
	Trait,
	BodyEnhancement
) {
	var MapBuilder = {
		"onLoad": function(callBack) {
			MapBuilder.__callback__ = callBack;
			return MapBuilder;
		},
		"buildParticleAt": function(world, translate, rotate, scale) {
			return Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(ShapeBuilder.Shapes.Particle)
				.pointMasses(1)
				.translate(translate)
				.rotate(rotate)
				.scale(scale)
				.isKinematic(false)
				.build();
		},
		"buildGroundRectangle": function(world, upperLeft, lowerRight, rotate) {
			var groundShape = ShapeBuilder.Shapes.Cube;

			var groundBody = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(groundShape)
				.pointMasses(Utils.Array.fill(0, groundShape.getVertices().length))
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
						new Jello.Vector2(
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
		// Enhance given world with several bodies, etc. for testing purpose.
		"setUpTestMap": function(layer, world) {
			var particleBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(ShapeBuilder.Shapes.Particle)
				.pointMasses(1);
			
			/*
			 *  controllable blob:
			 */
			var pb = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(world)
				.shape(ShapeBuilder.Shapes.Ball)
				.pointMasses(1.0)
				.translate(new Jello.Vector2(-25, 15))
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(20.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(1.0)
				.gasPressure(100.0)
				.build();
			pb.aName = "Player";

			env.input.initKeyboard();
			env.input.bind(Input.KEY.LEFT_ARROW, "left");
			env.input.bind(Input.KEY.RIGHT_ARROW, "right");
			env.input.bind(Input.KEY.UP_ARROW, "up");
			env.input.bind(Input.KEY.DOWN_ARROW, "down");
			env.input.bind(Input.KEY.DOWN_ARROW, "compress");
	
			pb.withUpdate(function(x) {
				if(env.input.state("left")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(-3, 0));
					this.addGlobalRotationForce(10);
				} else if(env.input.state("right")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(3, 0));
					this.addGlobalRotationForce(-10);
				} else if(env.input.state("up")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, 3));
				} else if(env.input.state("down")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, -3));
				};
				if(env.input.pressed("compress")) {
					this.setGasPressure(this.getGasPressure() / 10);
					this.setShapeMatchingConstants(250, 5);
				} else if(env.input.released("compress")) {
					this.setGasPressure(this.getGasPressure() * 10);
					this.setShapeMatchingConstants(150, 1);
				};
			});
	
			// make blob sticky
			// new BodyEnhancement(pb).makeSticky();
	
			
			// the following requires a scene:
			// track camera focus on blob
			env.camera.track(pb);
			
			/*
			 *  a block:
			 */
			var block = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(world)
				.shape(new Jello.ClosedShape().begin()
					.addVertex(new Jello.Vector2(-1.0, -1.0))
					.addVertex(new Jello.Vector2(-1.0, -0.5))
					.addVertex(new Jello.Vector2(-1.0,  0.0))
					.addVertex(new Jello.Vector2(-1.0,  0.5))
					.addVertex(new Jello.Vector2(-1.0,  1.0))
					.addVertex(new Jello.Vector2(-0.5,  1.0))
					.addVertex(new Jello.Vector2( 0.0,  1.0))
					.addVertex(new Jello.Vector2( 0.5,  1.0))
					.addVertex(new Jello.Vector2( 1.0,  1.0))
					.addVertex(new Jello.Vector2( 1.0,  0.5))
					.addVertex(new Jello.Vector2( 1.0,  0.0))
					.addVertex(new Jello.Vector2( 1.0, -0.5))
					.addVertex(new Jello.Vector2( 1.0, -1.0))
					.addVertex(new Jello.Vector2( 0.5, -1.0))
					.addVertex(new Jello.Vector2( 0.0, -1.0))
					.addVertex(new Jello.Vector2(-0.5, -1.0))
					.finish())
				.pointMasses(1.0)
				.translate(new Jello.Vector2(-75, 25))
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(20.0)
				.shapeSpringK(500.0)
				.shapeSpringDamp(20.0)
				.gasPressure(100.0)
				.build();
			
			var blockEntity = new Entity(0, 10, { foo: 42, bar: 17 });
			blockEntity.setTrait(new Trait());
			layer.addEntity(blockEntity);
			
			/*
			 *  GROUND SHAPE
			 */
			var groundShapeScale = new Jello.Vector2(9,1.5);
			
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 2; j++) {
					var middle = new Jello.Vector2(2*18*i, -15 + 36.5*j);
					var groundBody = MapBuilder.buildGroundRectangle(
						world,
						middle.sub(groundShapeScale),
						middle.add(groundShapeScale)
					);

				};
			};
			
			var middle = new Jello.Vector2(-2, -25 + 36.5);
			var groundBody = MapBuilder.buildGroundRectangle(
				world,
				middle.sub(groundShapeScale),
				middle.add(groundShapeScale),
				3*Math.PI/2
			);

			var middle = new Jello.Vector2(-2-10, -25 + 36.5+10);
			var groundBody = MapBuilder.buildGroundRectangle(
				world,
				middle.sub(groundShapeScale),
				middle.add(groundShapeScale),
				3*Math.PI/4
			);

			/*
			 *  Moving Ground:
			 */
			var groundBody = MapBuilder.buildGroundRectangle(
				world,
				new Jello.Vector2(-60,-2),
				new Jello.Vector2(-45,2)
			);
			//groundBody.mIsStatic = true;
			groundBody.mKinematic = true;
			groundBody.withUpdate(function() {
				this.counter = this.counter + 1 || 0;
				if(this.counter == 10) {
					this.counter = 0;
					this.setKinematicPosition(
						this.mDerivedPos.add(
						new Jello.Vector2(-0.0,0.1))
					);
					//this.body.setKinematicScale(new Jello.Vector2(0, 0));
				}
			});

			/*
			 *  Special (Round) Ground:
			 */
			var groundShape = new Jello.ClosedShape()
				.begin();
			MapBuilder.generateRoundShape(new Jello.Vector2(0,0), 15.0, 270, 90, 20, groundShape, groundShape.addVertex);
			groundShape
				.addVertex(new Jello.Vector2(  0,-20))
				.addVertex(new Jello.Vector2(-20,-20))
				.addVertex(new Jello.Vector2(-20, 20))
				.addVertex(new Jello.Vector2(  0, 20))
				.finish();
			
			var loftBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(groundShape)
				.pointMasses(Utils.Array.fill(0, groundShape.getVertices().length))
				.translate(new Jello.Vector2(-75, 23))
				.rotate(Math.PI/2)
				.scale(Jello.Vector2.One.copy())
				.isKinematic(false);
			var roundGround = loftBluePrint.build();
			roundGround.aName = "ground";
			// target the moving ground!
			roundGround.target = groundBody.id;
			
			/*
			 *  Fuzzy Ellipse:
			 */
			function fuzzyEllipseGround(world, translate, rotate, scale) {
				var groundShape = new Jello.ClosedShape().begin();
				for(var i = 0; i <= 360; i += Math.floor(Math.random() * 60))
					groundShape.addVertex(new Jello.Vector2(
						Math.cos(-i * (Math.PI / 180)),
						Math.sin(-i * (Math.PI / 180))
					));
				groundShape.finish();
				
				return Jello.BodyFactory.createBluePrint(Jello.Body)
					.world(world)
					.shape(groundShape)
					.pointMasses(Utils.Array.fill(0, groundShape.getVertices().length))
					.translate(translate)
					.rotate(rotate)
					.scale(scale)
					.isKinematic(false)
					.build();
			};
			
			for(var i = 0; i < 10; i++)
				fuzzyEllipseGround(
					world,
					new Jello.Vector2(Math.floor(Math.random() * -100) - 30, Math.floor(Math.random() * -100) - 30),
					0,
					new Jello.Vector2(Math.floor(Math.random() * 60), Math.floor(Math.random() * 20))
				);
			
			/*
			 *  Jelly Ground:
			 */
			var groundShape = new Jello.ClosedShape()
				.begin();
				// bottom Row
				for(var i = 1; i >= -1; i-= 0.25)
					groundShape.addVertex(new Jello.Vector2( i, -1));
				for(var i = -1; i <= 1; i+= 0.25)
					groundShape.addVertex(new Jello.Vector2( i,  1));
				groundShape.finish();

			var mass = 1 ;
			var groundBody = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(groundShape)
				.pointMasses([
					0,0,0,0,0,0,0,0,0,
					mass,mass,mass,mass,mass,mass,mass,mass,mass,mass
				])
				.translate(new Jello.Vector2(-50, -16)) // translate
				.rotate(0) // rotate
				.scale(new Jello.Vector2(18, 3)) // scale
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
			var center = new Jello.Vector2(50, 50);
			loftBluePrint.translate(center).build();
			
			var jellyCubeBluePrint = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(ShapeBuilder.Shapes.Cube)
				.pointMasses(1)
				.rotate(0)
				.scale(Jello.Vector2.One.copy())
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
						.translate(new Jello.Vector2(2*i, 2*j).add(center))
						.build();
					body.aName = "Jelly";
				}
			};

			/*
			 *  material test
			 */
			var numberOfCubes = 4;
			for(var i = 0; i < numberOfCubes; i++) {
				world.materialManager.addMaterial(i);
			};
			for(var i = 0; i < numberOfCubes; i++) {
				for(var j = 0; j < numberOfCubes; j++) {
					world.materialManager.setMaterialPairCollide(i, j, true);
					world.materialManager.setMaterialPairData(i, j, 
						1,//i/numberOfCubes,//i/(numberOfCubes-1)+0.2,
						i/numberOfCubes//j/(numberOfCubes-1)+0.2
					);
					world.materialManager.setMaterialPairFilterCallback(i, j, new Jello.CollisionCallback());
				};
			};

			var origin = new Jello.Vector2(50, 10);

			var shape = ShapeBuilder.Shapes.Cube;
			var particleShape = ShapeBuilder.Shapes.Particle;

			for(var i = 0; i < numberOfCubes; i++) {
				// materialized ground
				var body = new Jello.Body(
					world,
					shape,
					Utils.Array.fill(0, //Number.POSITIVE_INFINITY
						shape.getVertices().length),
					new Jello.Vector2(3*numberOfCubes*i + origin.x, -10+origin.y), // translate
					0, // rotate
					new Jello.Vector2(3*numberOfCubes/2, 1), // scale
					false
				);
				body.aName = "Jelly";
				body.setMaterial(i);
			
				for(var j = 0; j < numberOfCubes; j++) {
					// particle
					var body = new Jello.Body(
						world,
						particleShape,
						1, // mass per point
						new Jello.Vector2(3*numberOfCubes*i + 3*j - 4.25 + origin.x, 5+origin.y), // translate
						0, // rotate
						Jello.Vector2.One.copy().mulFloat(1.0), // scale
						false
					);
					body.aName = "Jelly";
					body.setMaterial(j);
				}
			};

			/*
			 *  TEST PINJOINT
			 */
			var origin = new Jello.Vector2(40, 20);
			var body = new Jello.SpringBody(
				world,
				shape,
				1, // mass per point
				new Jello.Vector2(-2, -9).add(origin), // translate
				0, // rotate
				Jello.Vector2.One.copy().mulFloat(1.0), // scale
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
				world,
				shape,
				1, // mass per point
				new Jello.Vector2(0, -9).add(origin), // translate
				0, // rotate
				Jello.Vector2.One.copy().mulFloat(1.0), // scale
				false,
				
				// new:
				300.0, // float edgeSpringK,
				5.0, // float edgeSpringDamp,
				150.0, // float shapeSpringK,
				5.0 // float shapeSpringDamp,
			);
			body2.addInternalSpring(0, 2, 300, 10);
			body2.addInternalSpring(1, 3, 300, 10);
			new Jello.PinJoint(
				world,
				body, 2,
				body2, 1
			);

			/*
			 *  (sticky) preasure balls:
			 */
			var center = new Jello.Vector2(200, 50);
			loftBluePrint.translate(center).build();

			var pressureBallBluePrint = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(world)
				.shape(ShapeBuilder.Shapes.Ball)
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
					.translate(new Jello.Vector2(x, 17).add(center))
					.scale(Jello.Vector2.One.copy().mulFloat(2.0))
					.gasPressure(100.0 + 10 * x)
					.build();
				pb.aName = "Blob";
			}

			// sticky blob
			pb = pressureBallBluePrint
				.translate(new Jello.Vector2(-50, 10))
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
				.gasPressure(100.0)
				.build();
			pb.aName = "Sticky Blob";
			new BodyEnhancement(pb).makeSticky();

			/*
			 *  secrets/collectibles:
			 *  highly depend on contacts
			 */
			var collectibleBluePrint = Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(ShapeBuilder.Shapes.Diamond)
				.pointMasses(0)
				.scale(Jello.Vector2.One.copy())
				.isKinematic(false);
			
			for(var i = 0; i < 360; i += 20) {
				var radius = 12;
				var diamond = collectibleBluePrint
					.translate(new Jello.Vector2(
							radius * Math.cos(-i * (Math.PI / 180)),
							radius * Math.sin(-i * (Math.PI / 180))
						).add(new Jello.Vector2(-15,4)))
					.rotate(-i * (Math.PI / 180) + Math.PI/2)
					.build();

				// remove diamond, if touched by a named body
				diamond.onStartContact(function(otherBody, contact) {
					if(typeof otherBody.aName !== "undefined")
						world.queue().removeBody(this);
				});

			};

			/*
			 *  I:
			 */
			var center = new Jello.Vector2(100, 50);
			loftBluePrint.translate(center).build();

			var iBluePrint = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(ShapeBuilder.Shapes.I)
				.pointMasses(1)
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
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
					.translate(new Jello.Vector2(0, i).add(center))
					.build();
			}

			/*
			 *  Test: Particles
			 */
			var center = new Jello.Vector2(150, 50);
			loftBluePrint.translate(center).build();
			
			var particle;
			for (i = 0; i <= 2; i++) {
				for (j = 0; j <= 3; j++) {
					particle = particleBluePrint
						.translate(new Jello.Vector2(0 + i, 15 + j).add(center))
						.build();
				}
			}
					
			/*
			 *  Rays
			 */
			var ray = new Jello.Ray(world, new Jello.Vector2(-10, -5), new Jello.Vector2(1, 0.5));

			/*
			 *  InterpolationJoint Test
			 */
			var lastParticle = particle;
			particle = particleBluePrint
				.translate(new Jello.Vector2(0 + 1 * i, 8))
				.build();
			new Jello.InterpolationJoint(
				world,
				body, 0,
				lastParticle, 0,
				particle, 0,
				0.8
			);

			/*
			 *  Particle Chain & Web
			 */
			var center = new Jello.Vector2(-20, 50);
			var particleWeb = [];
			
			var max = 3;
			for(var i = 0; i < max; i++) {
				particleWeb[i] = [];
				for(var j = 0; j < max; j++) {
					particleWeb[i][j] = particleBluePrint
						.translate(new Jello.Vector2(i,j).mulFloat(2).add(center))
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
					new Jello.DistanceJoint(
							world,
							particleWeb[i-1][j-1], 0,
							particleWeb[i][j], 0,
							0.0,
							1050.0,
							15.0
						);
					new Jello.DistanceJoint(
							world,
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
					.translate(new Jello.Vector2(0 + 1 * i, 8))
					.build();
				
				if(typeof particle1 === "undefined") {
					particle2.pointMasses[0].Mass = 0;
				} else {
					new Jello.DistanceJoint(
						world,
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
				.addVertex(new Jello.Vector2(0.0, 0.0))
				.addVertex(new Jello.Vector2(1.0, 0.0))
				.addVertex(new Jello.Vector2(1.0, 0.3))
				.addVertex(new Jello.Vector2(0.0, 0.3))
				.finish();
			
			var stick = new Jello.SpringBody(
				world,
				stickShape,
				1,
				new Jello.Vector2(0+30, 12),
				0.0,
				Jello.Vector2.One.copy().mulFloat(2),
				false,
				150.0,
				5.0,
				300.0,
				15.0
			);
			stick.pointMasses[0].Mass = 0;
			for (i = 1; i <= 5; i++) {
				var stick2 = new Jello.SpringBody(
					world,
					stickShape,
					1,
					new Jello.Vector2(2*i+30, 12),
					0.0,
					Jello.Vector2.One.copy().mulFloat(2),
					false,
					150.0,
					5.0,
					300.0,
					15.0
				);
				new Jello.PinJoint(
					world,
					stick, 1,
					stick2, 0
				);
				new Jello.PinJoint(
					world,
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
				.addVertex(new Jello.Vector2(0.0, 0.0))
				.addVertex(new Jello.Vector2(0.0, 0.0))
				.addVertex(new Jello.Vector2(0.0, 0.1))
				.addVertex(new Jello.Vector2(0.0, 0.1))
				.finish();
			
			var center = new Jello.Vector2(-30, -25);
			var stick = new Jello.SpringBody(
				world,
				stickShape,
				1,
				center,
				0.0,
				Jello.Vector2.One.copy().mulFloat(2),
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
					world,
					stickShape,
					1,
					new Jello.Vector2(3*i, 0).add(center),
					0.0,
					Jello.Vector2.One.copy().mulFloat(3),
					false,
					450.0,
					5.0,
					300.0,
					15.0
				);
				new Jello.PinJoint(
					world,
					stick, 1,
					stick2, 0
				);
				new Jello.PinJoint(
					world,
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
				.bluePrint(iBluePrint.translate(Jello.Vector2.Zero.copy()))
				.addToWorld(world);
			
			/*
			 *  TODO:
			 *  Body of Water: FLUIDS
			 */
			var center = new Jello.Vector2(0, 50);
			loftBluePrint.translate(center).build();

			/*
			 *  TriggerFields:
			 */
			new Jello.TriggerField(
					world, new Jello.AABB(
						new Jello.Vector2(-40, 10),
						new Jello.Vector2(-30, 25)
					)
				).onOverlapBody(function(body) {
					console.log("has Body");
				}).onContainBody(function(body) {
					console.log("contains");
					if(typeof body.getGasPressure !== "undefined")
						body.setGasPressure(body.getGasPressure() * 1.01);
				});
				
			new Jello.TriggerField(
					world, new Jello.AABB(
						new Jello.Vector2(-40, -45),
						new Jello.Vector2( 10, -40)
					)
				).onOverlapBody(function(body) {
					if(typeof body.aName !== "undefined") {
						// TODO: retranslate Object
					};
				});
				
			/*
			 *  END OF OBJECTS
			 */

			if(typeof MapBuilder.__callback__ == "function")
				MapBuilder.__callback__();
		}
	};

	return MapBuilder;
});
