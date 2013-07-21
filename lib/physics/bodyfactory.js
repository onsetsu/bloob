var Bloob = Bloob || {};
Bloob.BodyFactory = {
	"createBody": function(){
		return Body.apply(this, arguments);
	}
};