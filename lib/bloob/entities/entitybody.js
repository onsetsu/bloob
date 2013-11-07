mini.Module(
	"bloob/entities/entitybody"
)
.requires(
	"engine/map/entityrepository",
	"engine/map/entity"
)
.defines(function(
	EntityRepository,
	Entity
) {
	var EntityBody = Entity.subclass({
		initialize: function() {
			Entity.prototype.initialize.apply(this, arguments);
		}
	});

	EntityRepository.addClass("EntityBody", EntityBody);
	
	return EntityBody;
});
