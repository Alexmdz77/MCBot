const Discord = require("discord.js");
const db = require('quick.db');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

	if(!message.member.hasPermission('ADMINISTRATOR')) {return;}

	const name = args.join(" ")
	if (!name) {return;}

	// DISABLE MEMBERCOUNT

	if(name.toLowerCase() === "disable"){
		let processed = 0;
		db.all().forEach((element) => {
			let membercount = element.ID.startsWith(`membercount_${message.guild.id}`);
			processed++;
			if (membercount) {
				const channel = client.channels.cache.get(element.ID.split('_')[2]);
				if(!channel){
					return message.channel.send("Il n'y a pas de channel MemberCount actif sur votre serveur !");
				}
				const channelName = db.fetch(`membercount_${message.guild.id}_${channel.id}`);
				if(!channelName){
					channel.delete();
					return;
				}
				db.delete(`membercount_${message.guild.id}_${channel.id}`);
				channel.delete();
				return message.channel.send("Le channel MemberCount a été désactivé !");
			} 
			else if(processed >= db.all().length){
				if(!membercount){
					return message.channel.send("Il n'y a pas de channel MemberCount actif sur votre serveur !");
				}
			}
		});
	} // ENABLE MEMBERCOUNT
	else {
		let processed = 0;
		db.all().forEach((element) => {
			const membercount = element.ID.startsWith(`membercount_${message.guild.id}`);
			processed++;
			if (membercount) {
				const channel = client.channels.cache.get(element.ID.split('_')[2]);
				if(channel){
					return message.channel.send("Vous devez d'abord désactiver le précédent channel MemberCount !");
				}
			}
			else if(processed >= db.all().length){
				if(!membercount){
					message.guild.members.fetch().then((g) => {
						const count = g.filter(member => !member.user.bot).size;  
						message.guild.channels.create(name.replace(/%count%/g, count), {
							type: 'voice',
							permissionOverwrites: [
								{
									id: message.guild.roles.everyone,
									deny: ['CONNECT'],
									allow:['VIEW_CHANNEL'],
								},
								{
									id: client.user,
									allow:['VIEW_CHANNEL','MANAGE_CHANNELS','CONNECT'],
								}
							]
						}).then(c => {
							db.set(`membercount_${message.guild.id}_${c.id}`, name);
						});
					});
					return message.channel.send("Le channel MemberCount a été créé avec succès.");
				}
			}
		});
		
	}
    
};

module.exports.help = {
    name: 'membercount',
    aliases: []
};
// Alexmdz77 | 22/03/2021