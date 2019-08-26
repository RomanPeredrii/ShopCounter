import Message from './message.js';


class WarningMessage extends Message{
    show (_text) {
      this.text = _text;
      super.show({type: 'WARNING', 
            text: this.text,
            color: '#dabc63',
            img: "../img/avisoW.png"  
          })
      }; 
}

export default WarningMessage;