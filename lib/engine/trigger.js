define(function() {
    var Trigger = mini.Class.subclass({
        initialize: function(condition, callback) {
            this.condition = condition;
            this.callback = callback;
            Updatable.trigger = this;
        },
        log: function() {
            console.log("FOOOOOOOOOOOO");
        }
    });

    Function.prototype.trigger = function(callback) {
        return new Trigger(this, callback);
    };

    var Updatable = {
        update: function() {
            if(this.trigger && this.trigger.condition()) {
                console.log("BAAAAAAAAARRRRRR!");
            }
        },
        clear: function() {}
    };

    return Updatable;
});
