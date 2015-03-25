define(function() {
    var Trigger = mini.Class.subclass({
        initialize: function(condition, callback) {
            this.condition = condition;
            this.callback = callback.bind(this);

            this.enabled = true;
            this.previouslyFulfilled = false;

            Updatable.trigger = this;
        },
        update: function() {
            if(!this.enabled) { return; }

            var conditionFulfilled = this.condition();

            if(conditionFulfilled && !this.previouslyFulfilled) {
                this.callback();
            }

            this.previouslyFulfilled = conditionFulfilled;
        }
    });

    Function.prototype.trigger = function(callback) {
        return new Trigger(this, callback);
    };

    var Updatable = {
        update: function() {
            this.trigger && this.trigger.update();
        },
        clear: function() {}
    };

    return Updatable;
});
