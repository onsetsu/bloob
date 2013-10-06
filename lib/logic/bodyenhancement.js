mini.Module(
	"logic/bodyenhancement"
)
.requires(
	"basic/shapebuilder",
	"basic/utils"
)
.defines(function(ShapeBuilder, Utils) {
	var BodyEnhancement = function(body) {
		this.body = body;
		body.withUpdate(Utils.bind(this.update, this));
		this.isSticky = false;
	};

	BodyEnhancement.prototype.update = function(timePassed) {
		// handle stickiness
		if(this.isSticky) {
			this.removeStickyJoints();
			this.attachStickyJoints();
		}
	};

	/*
	 *  Stickyness:
	 */
	BodyEnhancement.prototype.makeSticky = function(datGui) {
		this.isSticky = true;
		this.stickies = [];

		this.maxStickyDistance = 1.3;
		if(typeof datGui !== "undefined")
			datGui.add(this, 'maxStickyDistance').name('StickyBreak').min(0).max(10).listen().step(0.1);

		this.createStickyJoints();
		this.pointMassIsConnected = Utils.fillArray(false, this.body.mPointCount);
		
		return this;
	};

	BodyEnhancement.prototype.createStickyJoints = function() {
		var body = this.body;
		var world = body.mWorld;
		
		for (var i = 0; i < body.mPointCount; i++)
		{
			var jointInfo = this.stickies[i] = {};
			
			// Third Version using Particle Wrapper
			var temp = jointInfo.temp = Jello.BodyFactory.createBluePrint(Jello.Body)
				.world(world)
				.shape(ShapeBuilder.Shapes.Particle)
				.pointMasses(1)
				.translate(this.body.pointMasses[i].Position)
				.rotate(0.0)
				.scale(Jello.Vector2.One.copy())
				.isKinematic(false)
				.build();

			jointInfo.jointToTemp = new Jello.DistanceJoint(
				world,
				this.body, i,
				temp, 0,
				0, 
				100, 10
			);
			jointInfo.jointTempToA = new Jello.DistanceJoint(
				world,
				temp, 0,
				temp, 0, // to replace: second pm
				0, // to replace: dist
				100, 10
			);
			jointInfo.jointTempToB = new Jello.DistanceJoint(
				world,
				temp, 0,
				temp, 0, // to replace: second pm
				0, // to replace: dist
				100, 10
			);
			
			// remove helpers for now
			world.removeJoint(jointInfo.jointToTemp);
			world.removeJoint(jointInfo.jointTempToA);
			world.removeJoint(jointInfo.jointTempToB);
			world.removeBody(jointInfo.temp);
		};
	};

	BodyEnhancement.prototype.attachStickyJoints = function() {
		/*
		 *  TEST FOR STICKY BLOB
		 */
		var world = this.body.mWorld;
		for (var i = 0; i < world.mCollisionList.length; i++)
		{
			var info = world.mCollisionList[i]; // BodyCollisionInfo
			if(info.bodyA == this.body) {
				if(!this.pointMassIsConnected[info.bodyApm]) {
					this.pointMassIsConnected[info.bodyApm] = true;
					var jointInfo = this.stickies[info.bodyApm];
					
					// Third Version using Particle Wrapper

					// adjust helper point mass position
					jointInfo.temp.pointMasses[0].Position.set(
						this.body.pointMasses[info.bodyApm].Position
					);

					// update connected body, point masses and distance
					jointInfo.jointTempToA.bodyB = info.bodyB;
					jointInfo.jointTempToA.pointMassIndexB = info.bodyBpmA;
					jointInfo.jointTempToA.springDistance =
						jointInfo.temp.pointMasses[0].Position.sub(
							info.bodyB.pointMasses[info.bodyBpmA].Position
						).length() * info.edgeD;

					jointInfo.jointTempToB.bodyB = info.bodyB;
					jointInfo.jointTempToB.pointMassIndexB = info.bodyBpmB;
					jointInfo.jointTempToB.springDistance =
						jointInfo.temp.pointMasses[0].Position.sub(
							info.bodyB.pointMasses[info.bodyBpmB].Position
						).length() * (1.0 - info.edgeD);

					// attach helpers to world
					world.addJoint(jointInfo.jointToTemp);
					world.addJoint(jointInfo.jointTempToA);
					world.addJoint(jointInfo.jointTempToB);
					world.addBody(jointInfo.temp);

					jointInfo.temp.clearExternalForces();
					
					/*
					// Second Version using direct DistanceJoints between penetrated object
					new Jello.DistanceJoint(
						world,
						this.body, info.bodyApm,
						info.bodyB, info.bodyBpmA,
						this.body.pointMasses[info.bodyApm].Position.sub(
							info.bodyB.pointMasses[info.bodyBpmA].Position
							).length() * info.edgeD, 
						100, 10
					);
					new Jello.DistanceJoint(
						world,
						this.body, info.bodyApm,
						info.bodyB, info.bodyBpmB,
						this.body.pointMasses[info.bodyApm].Position.sub(
							info.bodyB.pointMasses[info.bodyBpmB].Position
						).length() * (1-info.edgeD), 
						100, 10
					);
					*/
					/*
					// First Version using Interpolation Joint, does not seem to work out
					var temp = Bloob.MapBuilder.buildParticleAt(
						world,
						this.body.pointMasses[info.bodyApm].Position,
						0.0,
						Jello.Vector2.One.copy()
					);
					new Jello.DistanceJoint(
						world,
						this.body, info.bodyApm,
						temp, 0,
						0, 300, 20
					);
					new Jello.InterpolationJoint(
						world,
						info.bodyB,
						info.bodyBpmA,
						info.bodyB,
						info.bodyBpmB,

						temp,
						0,

						1 - info.edgeD
					);
					*/
					//game.stop();
					return;
				}
			}
		};
	};

	BodyEnhancement.prototype.removeStickyJoints = function() {
		for(var i = 0; i < this.stickies.length; i++) {
			if(!this.pointMassIsConnected[i])
				continue; // do nothing, if not connected
			var jointToTemp = this.stickies[i].jointToTemp;
			if(
				jointToTemp.bodyA.pointMasses[jointToTemp.pointMassIndexA].Position.sub(
					jointToTemp.bodyB.pointMasses[jointToTemp.pointMassIndexB].Position
				).length() > this.maxStickyDistance // maximum elasticity exceeded
			) {
				this.pointMassIsConnected[i] = false;

				// remove this helper from world
				this.body.mWorld.removeJoint(jointToTemp);
				this.body.mWorld.removeJoint(this.stickies[i].jointTempToA);
				this.body.mWorld.removeJoint(this.stickies[i].jointTempToB);
				this.body.mWorld.removeBody(this.stickies[i].temp);
			};
		};
	};
	
	return BodyEnhancement;
});
