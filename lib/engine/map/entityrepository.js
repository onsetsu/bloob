mini.Module(
	"engine/map/entityrepository"
)
.requires(

)
.defines(function() {
	var EntityRepository = {
		classes: {},
		addClass: function(name, entityClass) {
			EntityRepository.classes[name] = entityClass;
			entityClass.className = name;
		}
	};
	
	return EntityRepository;
});
