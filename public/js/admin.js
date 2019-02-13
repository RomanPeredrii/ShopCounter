"use strict"

const log = console.log;

const optionHostDBData = document.querySelector('#optionsHost');
const optionPortDBData = document.querySelector('#optionsPort');
const optionPathDBData = document.querySelector('#optionsPath');
const optionUserDBData = document.querySelector('#optionsUser');
const optionRoleDBData = document.querySelector('#optionsRole');
const optionPasswordDBData = document.querySelector('#optionsPassword');
const optionPageSizeDBData = document.querySelector('#optionsPageSize');
const checkConnection = document.querySelector('#checkConnection');
// OPTION FOR ATTACH DB
const options = {
host : optionHostDBData.value,
port : optionPortDBData.value,
database : optionPathDBData.value,
user : optionUserDBData.value,
password : optionPasswordDBData.value,
pageSize : optionPageSizeDBData.value,
role : optionRoleDBData.value
};

checkConnection.addEventListener('click', () => {
    log(options)
});