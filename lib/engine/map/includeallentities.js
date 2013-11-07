mini.Module(
	"engine/map/includeallentities"
)
.requires(
	"engine/map/entityrepository",
	"engine/map/entity",
	"bloob/entities/entitybody",
	"bloob/entities/entitytest"// , ... more Entities
)
.defines(function(
	EntityRepository // , ...
) {
	return EntityRepository;
});
