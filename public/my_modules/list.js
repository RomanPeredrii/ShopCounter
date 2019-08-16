var log = console.log;
// !!! - creating list with checkbox for choice departments


class List {
    constructor(_data, _name, _parent) {
        this.parent = document.querySelector(`${_parent}`);
        //this.allInputs = document.querySelectorAll(`${_parent} input`)
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
            const check = document.createElement('input');
            check.type = "checked";
            check.name = `${this.name}${i}`;
            // check.style.display = 'none';
            tr.appendChild(check);
            tr.bgColor = '#f4f4f4';
            //tr.innerHTML += `${item}`;
            tr.innerHTML += `<label for=${check}>${item}<label>`;
            tr.addEventListener('click', cont => this._check(cont));
            i++;
            tr.checked = false;
            table.appendChild(tr);
        };
        this.parent.appendChild(table);
    }

    _check(cont) {
        //log(cont.target.parentNode.children[0].checked);
        cont.target.parentNode.children[0].checked = cont.target.parentNode.children[0].checked ? false : true;
        cont.target.parentNode.bgColor = cont.target.parentNode.children[0].checked ? '#0275d8' : '#ffffff';
        cont.target.style.color = cont.target.parentNode.children[0].checked ? '#ffffff' : '#757575';
        cont.target.style.fontSize = cont.target.parentNode.children[0].checked ? '1.1em' : '1em';
        // log(cont.target.parentNode.children[0].checked);
    };
};
export default List;