var log = console.log;

/* class for obtaining values from different types <input>,
for adding value from <input> to outgoing object we must set:
DOM property checked & name of property through the DOM property "name" .
_parent - parent DOM container;
_default - you can set default values (no obligatorily), just pass {} */

class Gather {
    constructor(_parent, _default) {
        this.parent = _parent;
        this.default = _default
    };

    _getContext() {
        return document.querySelectorAll(`${this.parent} input`);
    };
    
    getValues() {
        let values = {};
        this._getContext().forEach((context) => {
            if (context.value) values[context.name] = context.value;
        });
        this.default = { ...this.default, ...values };
        return this.default;
    };

};

export default Gather;