const config = require('../config.json');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {

	// console.log(message.mentions.roles.first());
    let role = message.mentions.roles.first() || message.guild.roles.cache.find((c) => c.name === args[0] || c.id === args[0]);

	if(!message.member.hasPermission('ADMINISTRATOR')) {return;}
	message.delete();
	message.channel.send({
		embed: {
			color: config.color,
			title:'Comment proposer votre suggestion ?',
			description:'Écrivez directement dans ce channel pour proposer votre suggestion au staff et aux joueurs du serveur.',
			footer: {
				text: '© 2021 - MCBotV2',
				icon_url: client.user.displayAvatarURL()
			}
		}
	}).then (function (data){
		db.set(`channelsuggestion_${data.channel.guild.id}`, data.channel.id);
		if(role){db.set(`rolesuggestion_${data.channel.guild.id}`, role.id);}
		console.log(`channelsuggestion_${data.channel.guild.id} : ${data.channel.id}`);
	});
};

module.exports.help = {
	name: 'sugg',
	aliases: []
};
// Alexmdz77 | 22/03/2021
