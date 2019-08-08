var log = console.log;
// !!! - creating list with checkbox for choice departments


class List {
    constructor(_data, _type, _name, _parent) {
        this.parent = document.querySelector(`${_parent}`);
        this.allInputs = document.querySelectorAll(`${_parent} input`)
        this.data = _data;
        this.type = _type;
        this.name = _name
    }
    init() {
        this.data[Symbol.iterator] = function() {
            let values = Object.values(this);
            let index = 0;
            return {
                next() {
                    return {
                        value: values[index],
                        done: index++ >= values.length
                    };
                }
            };
        };
        this.parent.style.display = "block";
        this.parent.innerHTML = "";
        let i = 0;
        for (let item of this.data) {
            let wrap = document.createElement('div');
            wrap.className = "wrap";
            let input = document.createElement('input');
            input.className = "listInput";
            input.type = this.type;
            input.value = item;
            this.type === "radio" ?
                input.name = `${this.name}` :
                input.name = `${this.name}${i}`;
            i++;
            this.parent.appendChild(wrap);
            wrap.appendChild(input);
            wrap.innerHTML += `<label for=${input}>${item}</label><br>`
        };
    };
};
export default List;