const Discord = require('discord.js');
const config = require('../config.json');

module.exports = (client, member) => {
	const userCount = member.guild.memberCount;
    member.guild.channels.cache.get(config.channel_bienvenue).send({embed: { // 
        color: config.color,
        title: "Bienvenue sur MCBotV2 !",
        url: "https://MCBotV2.fr/",
        description: `Bienvenue à toi **${member.user.tag}** sur **MCBotV2** ! \n\n • Le Discord compte désormais ${userCount} personnes !`,
        timestamp: new Date(),
        footer: {
        icon_url: client.user.avatarURL,
        text: "© 2021 - MCBotV2"
        }
    }})
    
    const role = member.guild.roles.cache.find((c) => c.id === config.autorole);
    member.roles.add(role);
};
// Alexmdz77 | 22/03/2021