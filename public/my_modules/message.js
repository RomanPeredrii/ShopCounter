import ParentMessager from './parentMessager.js';
// !! - template for message 

class Message extends ParentMessager{

  show(_message) { 
    super.show(
      `
      <style  type="text/css">
      .parent {
        display: flex;
        width: 100%;
        height: 100%;
        align-items:baseline;
        justify-content: center;
        background-color: #77777720;
      }
      .wrap {
        display: flex;
        flex-direction: column;
        margin: auto;
        width: 10em;
        background-color: #FFFFFF;
        border: 0.1em solid #dadada;
        border-radius: 0.3em;
        font: 1.2em Helvetica, Arial, sans-serif;
        color: #757575
      }
      .type {
        display: flex;
        flex-flow:row wrap;
        justify-content: flex-start;
        height: 30%;
        margin: 0;
        padding: 0;
        background-color: ${_message.color};
        border-bottom: 0.2em solid #dadada;
        border-top-left-radius: 0.15em;
        border-top-right-radius: 0.15em;
        font: 1.2em Helvetica, Arial, sans-serif;
        font-weight: bold;
        color: #FFFFFF;
      }
      .description {
        display: flex;
        flex-flow:row wrap;
        height: 70%;
        background-color: #FFFFFF;
        font: 1em Helvetica, Arial, sans-serif;
        color: #757575
      }
      img{
        margin: 0.2em;
        height: 1.5em;
        width: 1.5em;
      }
      p {
        margin: 0;
        padding: 0;
        align-self: center;
      }
      </style>
    <div class="parent">
      <div class="wrap">
        <div class="type">
          <img src="${_message.img}">
           <p>${_message.type}</p>
        </div>
        <div class="description">
          <p>${_message.text}</p>
        </div>
      </div>
    </div>
  `
  )}

}

export default Message;