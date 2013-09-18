mini.Module(
	"engine/domready"
)
.requires(

)
.defines(function() {
	var domReady = function(callback) {
		$().ready(callback);
	};
	
	return domReady;
});
