class Dslider {
  constructor(parent, width, startValue, finishValue, step) {
    this.parent = document.querySelector(parent);
    this.width = width;
    this.parent.innerHTML = `
    <style type="text/css">
    .base {
      min-width: ${this.width};
      display: flex;
      flex-direction: row;
      justify-content: center;
      border:1px solid #999;
      border-radius: 0.5em;
      background:#fff;
    }
    .wrapSlideline {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 60%;
    }
    .slideline {
      position: relative;
      height: 50%;
      width: 100%;
      border-radius: 0.5em;
      background:#888888;
    }
    .sliderTo {
      position: absolute;
      right: 0;
      height: 100%;
      width: 3%;
      float: right;
      border:0px solid #2e2e2e;
      border-top-right-radius: 0.5em;
      border-bottom-right-radius: 0.5em;
      background:#2e2e2e;
    }
    .sliderFrom {
      position: absolute;
      left: 0px;
      height: 100%;
      width: 3%;
      float: left;
      border:0px solid #2e2e2e;
      border-top-left-radius: 0.5em;
      border-bottom-left-radius: 0.5em;
      background:#2e2e2e;
    }
    .start, .finish {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 20%;
    }
    label {
      font: inherit;
      height: inherit;
      font-size: 1em;
      text-align: center;
      padding-left: 5%;
      padding-right: 5%;
      margin-bottom: 1vh;
      margin-top: 1vh;
    }
</style>
<div class="base">
  <div class="start"><label class="startLabel"></label></div>
  <div class="wrapSlideline">
      <div class="slideline">
          <div class="sliderFrom"></div>
          <div class="sliderTo"></div>
      </div>
  </div>
  <div class="finish"><label class="finishLabel"></label></div>
</div>
    `;
    this.base = this.parent.querySelector('.base')
    this.startValue = startValue;
    this.finishValue = finishValue;
    this.minValue = startValue;
    this.maxValue = finishValue;
    this.step = step;
    this.onchange = () => {};
    this.init();
  }

  //init = () => {
  init() {
    const pqs = (cont) => {
      return this.parent.querySelector(cont);
    };
    const tr = (val) => {
      return Math.trunc(val)
    };
    const rd = (val) => {
      return Math.round(val)
    };
    const start = pqs('.startLabel');
    const finish = pqs('.finishLabel');
    const slideline = pqs('.slideline');
    const sliderFrom = pqs('.sliderFrom');
    const sliderTo = pqs('.sliderTo');
    finish.innerHTML = `${this.finishValue}`;
    start.innerHTML = `${this.startValue}`;

    let slidelineOffsetLeft = slideline.offsetLeft + this.parent.offsetLeft;

    let moveLeft = (e) => {
      if
        (
        (e.clientX - tr(slidelineOffsetLeft + sliderFrom.offsetWidth / 2) >= 0)
        && (
          (e.clientX - (slidelineOffsetLeft + sliderFrom.offsetWidth / 2)
            < (sliderTo.offsetLeft - sliderFrom.offsetWidth)
          )
        )
      ) {
        sliderFrom.style.left = (e.clientX - (slidelineOffsetLeft + sliderFrom.offsetWidth / 2)) + 'px';
        sliderFrom.startValue = rd(tr(this.finishValue) / ((slideline.offsetWidth - (sliderFrom.offsetWidth + sliderTo.offsetWidth))) * (sliderFrom.offsetLeft));
        this.minValue = start.innerHTML = `${rd(tr(this.finishValue) / ((slideline.offsetWidth - (sliderFrom.offsetWidth + sliderTo.offsetWidth))) * (sliderFrom.offsetLeft))}`;
        //console.log(this.minValue);
        this.onchange({
          finishValue: sliderTo.finishValue,
          startValue: sliderFrom.startValue
        });
      };
    };

    let moveRight = (e) => {
      if
        ((
          (
            (e.clientX - slidelineOffsetLeft)
          )
          >= (sliderFrom.offsetLeft + tr(sliderFrom.offsetWidth + sliderFrom.offsetWidth / 2)
          )
        )
        && (
          (e.clientX + sliderTo.offsetWidth / 2)
          < (slidelineOffsetLeft + slideline.offsetWidth)
        )
      ) {
        sliderTo.style.left = ((e.clientX - (slidelineOffsetLeft + sliderTo.offsetWidth / 2))) + 'px';

        sliderTo.finishValue = rd(tr(this.finishValue) / ((slideline.offsetWidth - (sliderFrom.offsetWidth + sliderTo.offsetWidth))) * (sliderTo.offsetLeft - sliderFrom.offsetWidth));
        this.maxValue = finish.innerHTML = `${sliderTo.finishValue}`;
        this.onchange({
          finishValue: sliderTo.finishValue,
          startValue: sliderFrom.startValue
        });
      };
    };

    sliderFrom.addEventListener('mousedown', () => {
      sliderFrom.addEventListener('mousemove', moveLeft);
    });
    sliderTo.addEventListener('mousedown', () => {
      sliderTo.addEventListener('mousemove', moveRight);
    });
    document.querySelector('*').addEventListener('mouseup', () => {
      sliderFrom.removeEventListener('mousemove', moveLeft);
      sliderTo.removeEventListener('mousemove', moveRight);
    });
  };
}

