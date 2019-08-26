import Message from './message.js';


class ErrorMessage extends Message{
    show (_text) {
      this.text = _text;
      super.show({type: 'ERROR', 
            text: this.text,
            color: '#c16969',
            img: "../img/cancelarW.png"  
          })
      }; 
}

export default ErrorMessage;