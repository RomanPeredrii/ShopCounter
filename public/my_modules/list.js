var log = console.log;
// !!! - creating list with checkbox for choice departments


class List {
    constructor(_data, _name, _parent) {
        this.parent = document.querySelector(`${_parent}`);
        this.data = _data;
        this.name = _name;
    }

    showCheckboxList() {
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
        for (let item in this.data) {
            const check = document.createElement('input');
            check.type = "checkbox";
            check.checked = false;
            check.name = `${item}`;
            check.value = this.data[item];
            this.parent.appendChild(check);
            this.parent.innerHTML += `<label for=${check}>${this.data[item]}<label><br>`;
        };

    }

};
export default List;