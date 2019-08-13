const log = console.log;
// !! - just for show loader animation

// class PreloaderBar extends Preloader {
//     constructor(parent) {
//         super
//         this.parent =
//     }
// }

class Preloader {
    constructor(parent) {
        this.parent = document.querySelector(parent);
    }
    show() {
        this.parent.style.display = 'block'
        this.parent.innerHTML = `
        <style  type="text/css">
        .preload {
          display: flex;
          width: 100%;
          height: 100%;
          align-items:baseline;
          justify-content: center;
          background-color: #77777720;
        }
        .wrap {
            margin: auto;
            width: 6em;
        }    
        .load {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          width: 100%;
          height: 5em;
        }    
        .line {
            display: inline-block;
            width: 15px;
            height: 15px;
            background-color: #4b9cdb;
        }
        .wrap .letter {
          animation-name: loadingLetters;
          animation-duration: 1.6s;
          animation-iteration-count: infinite;
          animation-direction: linear;
        }
        .letter-holder {
          display: flex;
          padding: 1em;
          justify-content: center;
        }
        .letter {
          font: 1.2em Helvetica, Arial, sans-serif;
          color: #777777;
        }
        .l-1 {
          animation-delay: .48s;
        }
        .l-2 {
          animation-delay: .6s;
        }
        .l-3 {
          animation-delay: .72s;
        }
        .l-4 {
          animation-delay: .84s;
        }
        .l-5 {
          animation-delay: .96s;
        }
        .l-6 {
          animation-delay: 1.08s;
        }
        .l-7 {
          animation-delay: 1.2s;
        }
        .l-8 {
          animation-delay: 1.32s;
        }
        .l-9 {
          animation-delay: 1.44s;
        }
        .l-10 {
          animation-delay: 1.56s;
        }
        .load .line:nth-last-child(1) {
          animation: loadingBar 1.5s 1s infinite;
        }
        .load .line:nth-last-child(2) {
          animation: loadingBar 1.5s .5s infinite;
        }
        .load .line:nth-last-child(3) {
          animation: loadingBar 1.5s 0s infinite;
        }
        .load .line:nth-last-child(4) {
          animation: loadingBar 1.5s .8s infinite;
        }
        .load .line:nth-last-child(5) {
          animation: loadingBar 1.5s .3s infinite;
        }
        @keyframes loadingBar {
            0 {
              height: 2em;
            }
            50% {
              height: 5em;
            }
            100% {
              height: 1em;
            }
        }
        @keyframes loadingLetters {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
      }
    </style>
      <div class="preload">
        <div class="wrap">
          <div class="load">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
          <div class="letter-holder">
            <div class="l-1 letter">L</div>
            <div class="l-2 letter">o</div>
            <div class="l-3 letter">a</div>
            <div class="l-4 letter">d</div>
            <div class="l-5 letter">i</div>
            <div class="l-6 letter">n</div>
            <div class="l-7 letter">g</div>
            <div class="l-8 letter">.</div>
            <div class="l-9 letter">.</div>
            <div class="l-10 letter">.</div>
          </div>  
        </div>
      </div>
    `;
    }
    hide() {
        this.parent.style.display = 'none';
    }
}

export default Preloader;