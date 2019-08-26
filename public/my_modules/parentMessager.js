const log = console.log;
// !! - just for show loader animation

// class PreloaderBar extends Preloader {
//     constructor(parent) {
//         super
//         this.parent =
//     }
// }

class ParentMessager {
    constructor(parent) {
        this.parent = document.querySelector(parent);
    }
    show(content) {
        this.parent.style.display = 'block'
        this.parent.innerHTML = `${content}`;
    }
    hide() {
        this.parent.style.display = 'none';
    }
};

export default ParentMessager;