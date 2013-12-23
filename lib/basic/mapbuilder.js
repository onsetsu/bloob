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
	"logic/bodyenhancement",
	"engine/time/tween",
	"engine/rendering/texture",
	"engine/time/timer",
	"engine/rendering/image",
	"assets/loader"
)
.defines(function(
	ShapeBuilder,
	Utils,
	Input,
	Entity,
	EntityTest,
	Trait,
	BodyEnhancement,
	Tween,
	Texture,
	Timer,
	Image,
	Loader
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
			if(layer.name !== "main") {
				if(typeof MapBuilder.__callback__ == "function")
					MapBuilder.__callback__();
				return;
			}
			
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
			
			// Entity
			var blockEntity = new Entity("testBlock", 0, 10, { foo: 42, bar: 17 }).addToLayer(layer);
			
			// attach tags
			blockEntity.addTag("moving");
			blockEntity.addTag("entity");
			console.log("block has tag moving", blockEntity.hasTag("moving"));
			console.log("block has tag entity", blockEntity.hasTag("entity"));
			blockEntity.removeTag("moving");
			console.log("block should not have tag moving", blockEntity.hasTag("moving"));
			console.log("block has tag entity", blockEntity.hasTag("entity"));
			console.log(blockEntity.getTags());
			
			// Behaviour
			blockEntity.setTrait(new Trait(function(entity) {
				var body = entity.getBody();
				if(body) {
					body.mGasAmount++;
				}
				if(body) {
					body.addGlobalForce(
						body.getDerivedPosition(),
						new Vector2(10, 2)
					);
				}
			}));

			// Body
			blockEntity.setBody(Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(world)
				.shape(new Jello.ClosedShape().begin()
					.addVertex(new Jello.Vector2(-1.0, -1.0)) // 0
					.addVertex(new Jello.Vector2(-1.0, -0.5))
					.addVertex(new Jello.Vector2(-1.0,  0.0))
					.addVertex(new Jello.Vector2(-1.0,  0.5))
					.addVertex(new Jello.Vector2(-1.0,  1.0)) // 4
					.addVertex(new Jello.Vector2(-0.5,  1.0))
					.addVertex(new Jello.Vector2( 0.0,  1.0))
					.addVertex(new Jello.Vector2( 0.5,  1.0))
					.addVertex(new Jello.Vector2( 1.0,  1.0)) // 8
					.addVertex(new Jello.Vector2( 1.0,  0.5))
					.addVertex(new Jello.Vector2( 1.0,  0.0))
					.addVertex(new Jello.Vector2( 1.0, -0.5))
					.addVertex(new Jello.Vector2( 1.0, -1.0)) // 12
					.addVertex(new Jello.Vector2( 0.5, -1.0))
					.addVertex(new Jello.Vector2( 0.0, -1.0))
					.addVertex(new Jello.Vector2(-0.5, -1.0))
					.finish())
				.pointMasses(1.0)
				.translate(new Jello.Vector2(-75, 25))
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(4.0))
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(20.0)
				.shapeSpringK(500.0)
				.shapeSpringDamp(20.0)
				.gasPressure(100.0)
				.build()
			);
			
			// Texture
			blockEntity.setTexture(new Texture("sample.png")
				.from([new Jello.Vector2(0, 32), new Jello.Vector2(0, 0), new Jello.Vector2(96, 0)]).to([3,4,5])
				.from([new Jello.Vector2(0, 64), new Jello.Vector2(0, 32), new Jello.Vector2(96, 0)]).to([2,3,5])
				.from([new Jello.Vector2(0, 64), new Jello.Vector2(96, 0), new Jello.Vector2(192, 0)]).to([2,5,6])
				.from([new Jello.Vector2(0, 96), new Jello.Vector2(0, 64), new Jello.Vector2(192, 0)]).to([1,2,6])
				.from([new Jello.Vector2(0, 96), new Jello.Vector2(192, 0), new Jello.Vector2(288, 0)]).to([1,6,7])
				.from([new Jello.Vector2(0, 128), new Jello.Vector2(0, 96), new Jello.Vector2(288, 0)]).to([0,1,7])
				.from([new Jello.Vector2(0, 128), new Jello.Vector2(288, 0), new Jello.Vector2(384, 0)]).to([0,7,8])
				.from([new Jello.Vector2(96, 128), new Jello.Vector2(0, 128), new Jello.Vector2(384, 0)]).to([15,0,8])
				.from([new Jello.Vector2(96, 128), new Jello.Vector2(384, 0), new Jello.Vector2(384, 32)]).to([15,8,9])
				.from([new Jello.Vector2(192, 128), new Jello.Vector2(96, 128), new Jello.Vector2(384, 32)]).to([14,15,9])
				.from([new Jello.Vector2(192, 128), new Jello.Vector2(384, 32), new Jello.Vector2(384, 64)]).to([14,9,10])
				.from([new Jello.Vector2(288, 128), new Jello.Vector2(192, 128), new Jello.Vector2(384, 64)]).to([13,14,10])
				.from([new Jello.Vector2(288, 128), new Jello.Vector2(384, 64), new Jello.Vector2(384, 96)]).to([13,10,11])
				.from([new Jello.Vector2(384, 128), new Jello.Vector2(288, 128), new Jello.Vector2(384, 96)]).to([12,13,11])
			);
			
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
				for(var i = 0; i <= 360; i += 1 + Math.floor(Math.random() * 60))
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
					Math.random() - 0.5,
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
					mass,mass,mass,mass,mass,mass,mass,mass,mass
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
			 *  Pressure Jelly Ground:
			 */
			var groundShape = new Jello.ClosedShape().begin();
				// bottom Row
				for(var i = 1; i >= -1; i-= 0.25)
					groundShape.addVertex(new Jello.Vector2( i, -1));
				for(var i = -1; i <= 1; i+= 0.25)
					groundShape.addVertex(new Jello.Vector2( i,  1));
				groundShape.finish();

			var mass = 1 ;
			var groundBody = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(world)
				.shape(groundShape)
				.pointMasses([
					0,0,0,0,0,0,0,0,0,
					0,mass,mass,mass,mass,mass,mass,mass,mass
				])
				.translate(new Jello.Vector2(-90, -16)) // translate
				.rotate(0) // rotate
				.scale(new Jello.Vector2(18, 3)) // scale
				.isKinematic(false)
				.edgeSpringK(150.0) // float ,
				.edgeSpringDamp(5.0) // float ,
				.shapeSpringK(300.0) // float ,
				.shapeSpringDamp(5.0) // float ,
				.gasPressure(300.0)
				.build();

			groundBody.aName = "ground";
			
			/*
			 *  jelly cubes (crates)
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

					// create Entity
					var jellyCrate = new Entity("jellyCrate", 0, 0, { foo: 42, bar: 17 }).addToLayer(layer);
					
					// JellyBody
					var body = jellyCubeBluePrint
						.translate(new Jello.Vector2(2*i, 2*j).add(center))
						.build();
					body.aName = "Jelly";
					jellyCrate.setBody(body);
					
					// Crate Texture
					jellyCrate.setTexture(new Texture("crate.png")
						.from([new Jello.Vector2(0, 500), new Jello.Vector2(0, 0), new Jello.Vector2(500, 0)]).to([0,1,2])
						.from([new Jello.Vector2(500, 0), new Jello.Vector2(500, 500), new Jello.Vector2(0, 500)]).to([2,3,0])
					);
				}
			};

			/*
			 *  a jumping crate:
			 */
			
			// Entity
			var jumpingCrate = new Entity("jumpingCrate", 0, 10, { foo: 42, bar: 17 }).addToLayer(layer);
			
			// Behaviour
			// Jump all 5 seconds.
			var jumpTimer = new Timer(5);
			jumpingCrate.setTrait(new Trait(function(entity) {
				if(jumpTimer.get() > 0) {
					jumpTimer.reset();
					var body = entity.getBody();
					body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(0, 1000));
				}
				// add additional force, if clicked on crate
				if(entity.isClicked()) {
					var body = entity.getBody();
					body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(1000, 0));
				} else if(entity.isHovered()) {
					// add additional force, if hovered over crate 
					var body = entity.getBody();
					body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(0, 100));
				}
			}));

			// Body
			jumpingCrate.setBody(Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(ShapeBuilder.Shapes.Cube)
				.pointMasses(1)
				.translate(new Jello.Vector2(12, 12))
				.rotate(0)
				.scale(Jello.Vector2.One.copy())
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(5.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(5.0)
				.addInternalSpring(0, 2, 300, 10)
				.addInternalSpring(1, 3, 300, 10)
				.build()
			);
			
			// Texture
			jumpingCrate.setTexture(new Texture("crate.png")
				.from([new Jello.Vector2(0, 500), new Jello.Vector2(0, 0), new Jello.Vector2(500, 0)]).to([0,1,2])
				.from([new Jello.Vector2(500, 0), new Jello.Vector2(500, 500), new Jello.Vector2(0, 500)]).to([2,3,0])
			);

			/*
			 *  material test
			 */
			var numberOfCubes = 4;
			var testMaterials = [];
			for(var i = 0; i < numberOfCubes; i++) {
				var mat = new Jello.Material();
				mat.setFriction(1);
				mat.setElasticity(i/numberOfCubes);
				
				testMaterials.push(mat);
			};

			var origin = new Jello.Vector2(50, 10);
			var shape = ShapeBuilder.Shapes.Cube;

			var particleShape = ShapeBuilder.Shapes.Particle;

			for(var i = 0; i < numberOfCubes; i++) {
				// materialized ground
				var body = Jello.BodyFactory.createBluePrint(Jello.Body)
					.world(world)
					.shape(shape)
					.pointMasses(Utils.Array.fill(0, //Number.POSITIVE_INFINITY
						shape.getVertices().length))
					.translate(new Jello.Vector2(3*numberOfCubes*i + origin.x, -10+origin.y))
					.rotate(0)
					.scale(new Jello.Vector2(3*numberOfCubes/2, 1))
					.isKinematic(false)
					.material(testMaterials[i])
					.build();
				body.aName = "Jelly";
			
				for(var j = 0; j < numberOfCubes; j++) {
					// particle
					var body = Jello.BodyFactory.createBluePrint(Jello.Body)
						.world(world)
						.shape(particleShape)
						.pointMasses(1)
						.translate(new Jello.Vector2(3*numberOfCubes*i + 3*j - 4.25 + origin.x, 5+origin.y))
						.rotate(0)
						.scale(Jello.Vector2.One.copy().mulFloat(1.0))
						.isKinematic(false)
						.material(testMaterials[j])
						.build();
					body.aName = "Jelly";
				}
			};
			
			/*
			 *  collisiontype test
			 */
			var specialCollisionId = 17;
			var origin = new Jello.Vector2(15, 0);
			var bodyBluePrintForCollisionType = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
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
			
			bodyBluePrintForCollisionType
				.translate(origin.add(new Jello.Vector2(0, 5)))
				.collisionType(new CollisionType()
					.setCollisionOn(CollisionType.Ground)
					.setCollisionOn(specialCollisionId))
				.build();

			bodyBluePrintForCollisionType
				.translate(origin.add(new Jello.Vector2(0, 10)))
				.collisionType(new CollisionType()
					.setCollisionOn(specialCollisionId))
				.build();

			bodyBluePrintForCollisionType
				.translate(origin.add(new Jello.Vector2(0, 15)))
				.collisionType(new CollisionType()
					.setCollisionOn(specialCollisionId))
				.build();

			bodyBluePrintForCollisionType
				.translate(origin.add(new Jello.Vector2(0, 20)))
				.collisionType(new CollisionType()
					.setCollisionOn(specialCollisionId))
				.build();

			/*
			 *  TEST PINJOINT
			 */
			var origin = new Jello.Vector2(40, 20);
			var body = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(shape)
				.pointMasses(1) // mass per point
				.translate(new Jello.Vector2(-2, -9).add(origin)) // translate
				.rotate(0) // rotate
				.scale(Jello.Vector2.One.copy().mulFloat(1.0)) // scale
				.isKinematic(false)
				.edgeSpringK(300.0) // float edgeSpringK,
				.edgeSpringDamp(5.0) // float edgeSpringDamp,
				.shapeSpringK(150.0) // float shapeSpringK,
				.shapeSpringDamp(5.0) // float shapeSpringDamp,
				.addInternalSpring(0, 2, 300, 10)
				.addInternalSpring(1, 3, 300, 10)
				.build();
			
			var body2 = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(shape)
				.pointMasses(1) // mass per point
				.translate(new Jello.Vector2(0, -9).add(origin)) // translate
				.rotate(0) // rotate
				.scale(Jello.Vector2.One.copy().mulFloat(1.0)) // scale
				.isKinematic(false)
				.edgeSpringK(300.0) // float edgeSpringK,
				.edgeSpringDamp(5.0) // float edgeSpringDamp,
				.shapeSpringK(150.0) // float shapeSpringK,
				.shapeSpringDamp(5.0) // float shapeSpringDamp,
				.addInternalSpring(0, 2, 300, 10)
				.addInternalSpring(1, 3, 300, 10)
				.build();

			new Jello.PinJoint(
				world,
				body, 2,
				body2, 1
			);

			/*
			 *  preasure balls:
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

			/*
			 * sticky blob
			 */
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
			
			var firefly1x1 = new Image("firefly1x1.png");
			var firefly2x2 = new Image("firefly2x2.png");

			var drawImageAtPosition = function(renderer, image) {
				var image = image.data;
				var worldPosition = this.getBody().getDerivedPosition();
				var screenPosition = env.camera.worldToScreenCoordinates(worldPosition);
				
				var sourceX = 0;
				var sourceY = 0;
				var width = image.width;
				var height = image.height;
				var targetX = screenPosition.x - image.width/2;
				var targetY = screenPosition.y - image.height/2;
				var targetWidth = image.width;
				var targetHeight = image.height;
				
				renderer.context.drawImage(
					image,
					sourceX, sourceY,
					width, height,
					targetX, targetY,
					targetWidth, targetHeight
				);
			};
			
			var drawFirefly2x2 = function(renderer, image) {
				drawImageAtPosition.call(this, renderer, firefly2x2);
			};
			var drawFirefly1x1 = function(renderer, image) {
				drawImageAtPosition.call(this, renderer, firefly1x1);
			};
			
			for (i = 0; i <= 2; i++) {
				for (j = 0; j <= 3; j++) {
					// Entity
					var fireflyEntity = new Entity("firefly", 0, 10, { foo: 42, bar: 17 }).addToLayer(layer);
					
					// Behaviour
					fireflyEntity.setTrait(new Trait(function(entity) {}));

					// Body
					fireflyEntity.setBody(particleBluePrint
						.translate(new Jello.Vector2(0 + i, 15 + j).add(center))
						.build()
					);
					
					// make fireflies fly
					fireflyEntity.getBody().clearExternalForces();

					fireflyEntity.addDrawCallback(Math.random() < 0.5 ? drawFirefly1x1 : drawFirefly2x2);
				}
			}
	

			/*
			 *  Rays
			 */
			var ray = new Jello.Ray(world, new Jello.Vector2(-10, -5), new Jello.Vector2(1, 0.5));

			/*
			 *  InterpolationJoint Test
			 */
			var lastParticle = particleBluePrint
				.translate(new Jello.Vector2(30, 115))
				.build();
			var particle = particleBluePrint
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
			
			var stick = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(stickShape)
				.pointMasses(1) // mass per point
				.translate(new Jello.Vector2(0+30, 12)) // translate
				.rotate(0.0) // rotate
				.scale(Jello.Vector2.One.copy().mulFloat(2)) // scale
				.isKinematic(false)
				.edgeSpringK(150.0) // float edgeSpringK,
				.edgeSpringDamp(5.0) // float edgeSpringDamp,
				.shapeSpringK(300.0) // float shapeSpringK,
				.shapeSpringDamp(15.0) // float shapeSpringDamp,
				.build();

			stick.pointMasses[0].Mass = 0;
			for (i = 1; i <= 5; i++) {
				var stick2 = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
					.world(world)
					.shape(stickShape)
					.pointMasses(1) // mass per point
					.translate(new Jello.Vector2(2*i+30, 12)) // translate
					.rotate(0.0) // rotate
					.scale(Jello.Vector2.One.copy().mulFloat(2)) // scale
					.isKinematic(false)
					.edgeSpringK(150.0) // float edgeSpringK,
					.edgeSpringDamp(5.0) // float edgeSpringDamp,
					.shapeSpringK(300.0) // float shapeSpringK,
					.shapeSpringDamp(15.0) // float shapeSpringDamp,
					.build();
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
			var stick = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
				.world(world)
				.shape(stickShape)
				.pointMasses(1) // mass per point
				.translate(center) // translate
				.rotate(0.0) // rotate
				.scale(Jello.Vector2.One.copy().mulFloat(2)) // scale
				.isKinematic(false)
				.edgeSpringK(450.0) // float edgeSpringK,
				.edgeSpringDamp(5.0) // float edgeSpringDamp,
				.shapeSpringK(300.0) // float shapeSpringK,
				.shapeSpringDamp(15.0) // float shapeSpringDamp,
				.build();
			stick.pointMasses[0].Mass = 0;
			stick.pointMasses[3].Mass = 0;

			for (i = 1; i <= 10; i++) {
				var stick2 = Jello.BodyFactory.createBluePrint(Jello.SpringBody)
					.world(world)
					.shape(stickShape)
					.pointMasses(1) // mass per point
					.translate(new Jello.Vector2(3*i, 0).add(center)) // translate
					.rotate(0.0) // rotate
					.scale(Jello.Vector2.One.copy().mulFloat(3)) // scale
					.isKinematic(false)
					.edgeSpringK(450.0) // float edgeSpringK,
					.edgeSpringDamp(5.0) // float edgeSpringDamp,
					.shapeSpringK(300.0) // float shapeSpringK,
					.shapeSpringDamp(15.0) // float shapeSpringDamp,
					.build();
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
			var triggerAABBMin = new Jello.Vector2(-40, 10);
			
			// Use a Tween to dynamically adjust the size of the trigger field's AABB
			this.tween = new Tween(triggerAABBMin)
				.to({"x": -50, "y": 5}, 2.5, Tween.Ease.linear())
				.wait(1.0)
				.to({"x": -40}, 5.5, Tween.Ease.linear())
				.onFinished(function() { console.log(1234567890); })
				.start();

			new Jello.TriggerField(
					world, new Jello.AABB(
						triggerAABBMin,
						new Jello.Vector2(-30, 25)
					)
				).onOverlapBody(function(body) {
					console.log("has Body");
				}).onContainBody(function(body) {
					console.log("contains");
					// pump up body, if its a PressureBody
					if(typeof body.getGasPressure !== "undefined")
						body.setGasPressure(body.getGasPressure() * 1.01);
				});
			
			/*
			 * testMapExtensions
			 */
			for(var extension in MapBuilder.testMapExtensions)
				MapBuilder.testMapExtensions[extension].apply(MapBuilder, arguments);
			
			/*
			 * search Entities by attributes
			 */
			console.log(layer.getEntitiesWithName("testBlock"));
			console.log(layer.getEntitiesWithTag("entity"));
			
			/*
			 *  END OF OBJECTS
			 */

			// load newly needed assets
			Loader.load(function() {
				if(typeof MapBuilder.__callback__ == "function")
					MapBuilder.__callback__();
			});
			
		},
		testMapExtensions: []
	};

	return MapBuilder;
});
