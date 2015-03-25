define(function() {
    var Trigger = mini.Class.subclass({
        initialize: function(condition, callback) {
            this._condition = condition;
            this._callback = callback.bind(this);

            this._enabled = false;
            this._previouslyFulfilled = false;
        },
        update: function() {
            if(!this._enabled) { return; }

            var conditionFulfilled = this._condition();

            if(conditionFulfilled && !this._previouslyFulfilled) {
                this._callback();
            }

            this._previouslyFulfilled = conditionFulfilled;
        },
        enable: function() {
            this._enabled = true;
        },
        disable: function() {
            this._enabled = false;
        }
    });

    Function.prototype.trigger = function(callback) {
        var trigger = new Trigger(this, callback);
        trigger.enable();
        Updatable.trigger = trigger;
        return trigger;
    };

    var Updatable = {
        update: function() {
            this.trigger && this.trigger.update();
        },
        clear: function() {}
    };

    return Updatable;
});
