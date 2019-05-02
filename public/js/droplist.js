// !! - build fully functional custom "drop list" 

class DropList {
    constructor(input, itemlist) {
        this.input = input;
        this.itemlist = itemlist;
        this.dropList;
        this.init();
    }

    init() {
        if (!document.querySelector('.dropList')) {
            let body = document.querySelector('body');
            let wrap = document.createElement('div');
            wrap.className = 'dropList'
            wrap.innerHTML = `
                                <style type="text/css">
                                        .dropList {
                                        background:#fff;
                                        }
                                        .items {
                                        width: 100%;
                                        }
                                        .items tr:hover{
                                        background-color: #e0e0e0;
                                        font-weight: bold
                                        } 
                                </style>
                                <table class="items">
                                    <tr></tr>
                                </table>
                            `;
            const list = wrap.querySelector('.items');
            body.appendChild(wrap);
            list.innerHTML = ``;
            wrap.setAttribute('style', `
                                            position: absolute; 
                                            left: ${this.input.getBoundingClientRect().left}px; 
                                            top: ${this.input.getBoundingClientRect().bottom + scrollX}px; 
                                            display: inline-block; 
                                            z-index: 12; 
                                            max-height: 20em;
                                            overflow: hidden; 
                                            overflow-y: auto; 
                                            border:1px solid #dadada; 
                                            border-radius: 0.2em; 
                                            margin: 0; 
                                            padding: 0;
                                            min-width: ${this.input.offsetWidth}px; 
                                    `);
            this.dropList = document.querySelector('.dropList');
            this.itemlist.map((item) => {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = item;
                td.addEventListener('click', () => {
                    this.dropList.parentNode.removeChild(this.dropList);
                    if (this.input.value.indexOf(item, 0) === -1) {
                        this.input.value += item + ', ';
                    };
                });
                tr.appendChild(td);
                list.appendChild(tr);
            });
        };
    };
};


