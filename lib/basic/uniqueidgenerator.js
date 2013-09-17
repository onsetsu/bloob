mini.Module(
	"basic/uniqueidgenerator"
)
.requires(
	"basic/utils"
)
.defines(function() {
	var UniqueIdGenerator = mini.Class.subclass({
		initialize: function(prefix) {
			this.store = {
				"prefix": prefix || "",
				"nextId": 0
			};
		},
		nextId: function() {
			return this.store.prefix + this.store.nextId++;
		}
	});

	Bloob.UniqueIdGenerator = UniqueIdGenerator;

	return UniqueIdGenerator;
});
