const config = require('../config.json');
const db = require('quick.db');

module.exports.run = (client, message, args) => {

	const channelsuggestion = db.fetch(`channelsuggestion_${message.guild.id}`);

	if(!channelsuggestion){return;}
	if(message.channel.id !== channelsuggestion) return;
	message.delete();
    
	if(!args) return message.channel.send({embed: {color: config.color,description:'Vous n\'avez pas proposé de suggestion ( '+config.prefix+'s <suggestion> )'}}).then (function (data){
		data.delete({ timeout: 2000 });
		message.delete();
	});
    
	message.channel.send({embed: {
		author: {
			name: message.author.tag,
			icon_url: message.author.displayAvatarURL()
		},
		color: config.color, 
		title: 'Suggestion :', 
		description:'>>> '+ args.join(' '),
		timestamp: new Date(),
		footer: {
			icon_url: client.user.displayAvatarURL(),
			text: config.prefix+'s <suggestion>'
		},
	}}).then (async data => {
		await data.react('✅');
		await data.react('❌');
	});};

module.exports.help = {
	name: 's',
	aliases: ['suggestion']
};
// Alexmdz77 | 22/03/2021