define(function() {
    /**
     * The interface to enable and disable specified triggers created with {@link Function#trigger}.
     * @class Trigger
     * @private
     */
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

    /**
     * Specifies that as soon as this evaluates to true the given callback is called.
     * @function Function#trigger
     * @public
     * @param {function} callback The callback that should be invoked once this becomes true.
     * @return {Trigger} {
     *    An object to manipulate the trigger.
     * }
     * @example Example usage of Function.prototype.trigger
     * (function() {
     *     return env.input.state("S");
     * }).trigger(function() {
     *     // disable the trigger, so that callback will not fire again
     *     this.disable();
     *     console.log("Callback invoked!");
     * });
     */
    Function.prototype.trigger = function(callback) {
        var trigger = new Trigger(this, callback);
        trigger.enable();
        TriggerUpdater._add(trigger);
        return trigger;
    };

    var TriggerUpdater = {
        _triggers: [],
        update: function() {
            this._triggers.forEach(function(trigger) {
                trigger.update();
            });
        },
        _add: function(trigger) {
            this._triggers.push(trigger);
        },
        clear: function() {
            this._triggers.length = 0;
        }
    };

    return TriggerUpdater;
});
