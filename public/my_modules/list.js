var log = console.log;
// !!! - creating list with checkbox for choice departments


class List {
    constructor(_data, _name, _parent) {
        this.parent = document.querySelector(`${_parent}`);
        this.allInputs = document.querySelectorAll(`${_parent} input`)
        this.data = _data;
        this.name = _name;
    }

    chooseValues() {
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
        let table = document.createElement('table');
        table.className = 'tableList';
        let i = 0;
        for (let item of this.data) {
            const tr = document.createElement('tr');
            tr.name = `${this.name}${i}`;
            tr.checked = false;
            tr.bgColor = '#f4f4f4';
            tr.innerHTML += `${item}`;
            tr.addEventListener('click', cont => this._check(cont));
            i++;
            table.appendChild(tr);
        };
        this.parent.appendChild(table);
    }

    _check(cont) {
        cont.target.checked = cont.target.checked ? false : true;
        cont.target.bgColor = cont.target.checked ? '#0275d8' : '#ffffff';
        cont.target.style.color = cont.target.checked ? '#ffffff' : '#757575';
        cont.target.style.fontSize = cont.target.checked ? '1.2em' : '1em';
    };
};
export default List;