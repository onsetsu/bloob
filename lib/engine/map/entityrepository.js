mini.Module(
	"engine/map/entityrepository"
)
.requires(

)
.defines(function() {
	var EntityRepository = {
		classes: {},
		addClass: function(name, entityClass) {
			EntityRepository[name] = entityClass;
			entityClass.className = name;
		}
	};
	
	return EntityRepository;
});
