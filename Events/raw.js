const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");
const formatDate = require('dateformat');

module.exports = (client) => {

client.once('raw', payload => {
    if(payload.t === 'MESSAGE_REACTION_ADD') {
        // ancien event reaction add ==> clickButton.js
    }
})
};
// Alexmdz77 | 22/03/2021