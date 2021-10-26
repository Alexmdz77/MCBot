const config = require('../config.json');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {

	// console.log(message.mentions.roles.first());
    let role = message.mentions.roles.first() || message.guild.roles.cache.find((c) => c.name === args[0] || c.id === args[0]);

	if(!message.member.hasPermission('ADMINISTRATOR')) {return;}
	message.delete();
	message.channel.send({
		embed: {
			color: 16711680,
			title:'Comment signaler un bug ?',
			description:'Écrivez directement dans ce channel pour signaler le bug au staff.',
			footer: {
				text: '© 2021 - MCBotV2',
				icon_url: client.user.displayAvatarURL()
			}
		}
	}).then (function (data){
		db.set(`channelbugs_${data.channel.guild.id}`, data.channel.id);
		if(role){db.set(`rolebugs_${data.channel.guild.id}`, role.id);}
		console.log(`channelbugs_${data.channel.guild.id} : ${data.channel.id}`);
	});
};

module.exports.help = {
	name: 'bugs',
	aliases: []
};
// Alexmdz77 | 21/06/2021
