const log = console.log;
//const socket = io.connect('http://localhost:3001');
//window.socket = socket;
const form = document.querySelector('.form-inline');

form.addEventListener('submit', (evt) => {
    evt.preventDefault()
});


//socket.on('onConnect', (mess) => { log(mess)});