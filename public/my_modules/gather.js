var log = console.log;

/* class for obtaining values from different types <input>,
for adding value from <input> to outgoing object we must set:
DOM property checked & name of property through the DOM property "name" .
_parent - parent DOM container;
_default - you can set default values (no obligatorily), just pass {} */

class Gather {
    constructor(_parent, _default = {
        startValue: false,
        timeStamp: false,
        serial: false,
        period: false
    }) {
        this.parent = _parent;
        this.default = _default
    };

    logD =() => 'default';
    _getContext() {
        return document.querySelectorAll(`${this.parent} input`);
    };

    _getFirstContext() {
        return document.querySelectorAll(`${this.parent}>input`);
    };


    getValues() {
        let values = {};
        this._getContext().forEach((context) => {
           if (context.value) values[context.name] = context.value;
        });
        this.default = {...this.default, ...values };
        return this.default;
    };

    getCheckedValues() {
        let counters = {};
        this._getContext().forEach((context) => {
            if (context.checked && context.value) {counters[context.name] = context.value;
                
            // log(context.checked, context)
        }
        });
        // log(this.default);
        return {...this.default, ...counters };
        //return this.default;
    };
    getLocalValues() {
        let values = {};
        this._getFirstContext().forEach((context) => {
           if (context.value) values[context.name] = context.value;
        });
        this.default = {...this.default, ...values };
        return this.default;
    };

    getLocalCheckedValues() {
        let values = {};
        this._getFirstContext().forEach((context) => {
            if (context.checked && context.value) values[context.name] = context.value;
        });
        this.default = {...this.default, ...values };
        return this.default;
    };

    getAllValues() {
        return this.default = {...this.default, ...this.getCheckedValues(), ...this.getValues() };
    };
};

export default Gather;