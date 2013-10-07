mini.Module(
	"basic/interactionhandlerbuilder"
)
.requires(
	"basic/interactionhandler",
	"basic/utils",
	"basic/shapebuilder"
)
.defines(function(InteractionHandler, Utils, ShapeBuilder) {
	var Builder = {
		buildDragBodyInWorld: function(world, camera) {
			return new InteractionHandler()
			.name("DRAG_BODY")
			.context({
				body: {},
				pmId: -1
			})
			.onPressed(function(timePassed, mouse) {
				// create force callback
				this.drag = Utils.bind(function drag(body) {
					var mousePositionInWorldCoordinates = camera.screenToWorldCoordinates(mouse.input.mouse);
					var pointMass = body.pointMasses[this.pmId];
					var diff = Jello.VectorTools.calculateSpringForceVelAVelB(
						pointMass.Position,
						pointMass.Velocity,
						mousePositionInWorldCoordinates,
						Jello.Vector2.Zero.copy(), // velB,
						0.0, // springD,
						100.0, // springK,
						10.0 // damping
					);
					pointMass.Force.addSelf(diff);
				}, this);

				var answer = world.getClosestPointMass(camera.screenToWorldCoordinates(mouse.input.mouse));
				this.body = world.getBody(answer.bodyId);
				this.body.addExternalForce(this.drag);
				this.pmId = answer.pointMassId;
			})
			.onReleased(function(timePassed, mouse) {
				if(typeof this.body.removeExternalForce == "function")
					this.body.removeExternalForce(this.drag);
			});
		},
		buildSpawnCubeInWorld: function(world, camera) {
			return new InteractionHandler()
			.name("SPAWN_CUBE")
			.onPressed(function(timePassed, mouse) {
				Jello.BodyFactory.createBluePrint(Jello.SpringBody)
					.world(world)
					.shape(ShapeBuilder.Shapes.Cube)
					.pointMasses(1)
					.translate(camera.screenToWorldCoordinates(mouse.input.mouse))
					.rotate(0)
					.scale(Jello.Vector2.One.copy())
					.isKinematic(false)
					.edgeSpringK(300.0)
					.edgeSpringDamp(5.0)
					.shapeSpringK(150.0)
					.shapeSpringDamp(5.0)
					.addInternalSpring(0, 2, 300, 10)
					.addInternalSpring(1, 3, 300, 10)
					.build();
			});
		},
		buildSelectBodyInWorld: function(world, camera) {
			return new InteractionHandler()
			.name("SELECT_BODY")
			.onPressed(function(timePassed, mouse) {
				var answer = world.getClosestPointMass(camera.screenToWorldCoordinates(mouse.input.mouse));
				var body = world.getBody(answer.bodyId);
				console.log(body.aName);
			});
		}
	};
	
	return Builder;
});
