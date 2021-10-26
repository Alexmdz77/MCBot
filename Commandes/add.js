const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
    if(!message.member.roles.cache.has(role => role.id === rolesupport) && !message.member.hasPermission("ADMINISTRATOR")) {return;}
    if(!message.channel.topic){return;}
    if(message.channel.topic.split(" ")[0] !== 'MCBotV2' || message.channel.topic.split(" ")[1] !== 'Ticket') {return;}
    message.delete();

    // RESOLVE MEMBER
    let mentionedUser;
    if(message.mentions.members.first()){
        mentionedUser = message.mentions.members.first();
    }
    else {
        mentionedUser = args[0];
        if(isNaN(mentionedUser) && args[0]) {return;}
        mentionedUser = message.guild.members.resolve(args[0]);
    }

    message.channel.updateOverwrite(mentionedUser, {VIEW_CHANNEL: true, SEND_MESSAGES: true});

    message.channel.send({
		embed: {
			color: config.color,
			title:'Utilisateur ajouté',
			description:`**L'utilisateur ${mentionedUser} a été ajouté au ticket par ${message.author}**`,
            timestamp: new Date(),
			footer: {
				text: '© 2021 - MCBotV2',
				icon_url: client.user.displayAvatarURL()
			}
		}
	});

}

module.exports.help = {
    name: "add",
	aliases: []
}
// Alexmdz77 | 18/04/2021