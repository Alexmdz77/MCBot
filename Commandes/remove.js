const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
    if(!message.member.roles.cache.has(role => role.id === rolesupport) && !message.member.hasPermission("ADMINISTRATOR")) {return;}
    if(!message.channel.topic){return;}
    if(message.channel.topic.split(" ")[0] !== 'Ticket' || message.channel.topic.split(" ")[1] !== 'Ticket') {return;}
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

    message.channel.updateOverwrite(mentionedUser, {VIEW_CHANNEL: false, SEND_MESSAGES: false});

    message.channel.send({
		embed: {
			color: config.color,
			title:'Utilisateur retiré',
			description:`L'utilisateur ${mentionedUser} a été retiré du ticket par ${message.author}`,
            timestamp: new Date(),
			footer: {
				text: '© 2021 - MCBotV2',
				icon_url: client.user.displayAvatarURL()
			}
		}
	});

}

module.exports.help = {
    name: "remove",
	aliases: []
}
// Alexmdz77 | 18/04/2021