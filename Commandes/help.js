const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) {return;}
    
    message.channel.send({
        embed: {
            color: config.color,
            title: 'Commandes de setup du Bot MCBotV2 !',

            fields: [
                {
                    name: '**'+config.prefix+'ticket <@roleadmin> <@rolesupport> <#channellogs>**',
                    value: 'Définition du channel et des roles de ticket (faire la commande dans le channel #création-ticket)'
                },
                {
                    name: '**'+config.prefix+'membercount <titre>**',
                    value: 'Exemple : \`'+config.prefix+'membercount %count% Membres\` et \`'+config.prefix+'membercount disable\` pour le supprimer'
                }
            ],
        }
    });
};

module.exports.help = {
    name: 'help',
	aliases: []
};
// Alexmdz77 | 22/03/2021