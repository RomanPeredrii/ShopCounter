
/* unit for collection different useful function */

// let it easy
const log = console.log;
const makeRandomColor = () => {
    let text = "";
    let possible = "ABCDEF0123456789";
    for (let i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    };
    return `#${text}`;
};

// !! - make token
const makeid = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    };
    //log('GENERATE TOKEN', text);
    return text;
  };
exports.makeid = makeid;
exports.makeRandomColor = makeRandomColor;
exports.log = log;
