import Message from './message.js';


class InformationMessage extends Message{
    show (_text) {
      this.text = _text;
      super.show({type: 'INFORMATION', 
            text: this.text,
            color: '#64bfab',
            img: "../img/infoW.png"  
          })
      }; 
}

export default InformationMessage;