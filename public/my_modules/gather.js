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

    _getContext() {
        let content = document.querySelectorAll(`${this.parent} input`);
        content.forEach((cont) => {
            //log(typeof cont);
            // if (cont=="input") 
            //log(cont);
        });




        return document.querySelectorAll(`${this.parent} input`);
    };

    getValues() {
        let values = {};
        //log(this._getContext());
        this._getContext().forEach((context) => {
            // log(context);
            if (context.value) values[context.name] = context.value;
        });
        this.default = {...this.default, ...values };
        return this.default;
    };

    getCheckedValues() {
        let values = {};
        this._getContext().forEach((context) => {
            if (context.checked) values[context.name] = context.value;
        });
        this.default = {...this.default, ...values };
        return this.default;
    };

    getAllValues() {
        return this.default = {...this.default, ...this.getCheckedValues(), ...this.getValues() };
    };
};

export default Gather;