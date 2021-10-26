const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");
const formatDate = require('dateformat');
const { fetchTranscript } = require("reconlx");

module.exports.run = async (client, message, args) => {

    // let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
    // if(!message.member.roles.cache.has(role => role.id === rolesupport) && !message.member.hasPermission("ADMINISTRATOR")) {return;}
    if(!message.channel.topic){return;}
    if(message.channel.topic.split(" ")[0] !== 'MCBotV2' || message.channel.topic.split(" ")[1] !== 'Ticket') {return;}

    let logs = db.fetch(`logs_${message.guild.id}`);

    fetchTranscript(message, 99).then((data) => {

        let res = message.channel.topic.split('-')[0].split('°')[1].replace(/\s/g, '');
        let ticketuser = client.users.cache.get(res);
        if(logs){
            let channellogs = client.channels.cache.get(logs)
            let claimed = db.fetch(`logs_claimed_${message.guild.id}_${message.channel.id}`);
            let opendate = db.fetch(`logs_date_${message.guild.id}_${message.channel.id}`);
            let memberclaimed = 'Not claimed';
            if(!args[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setDescription(`**Vous devez préciser la raison de la fermeture**`)
                return message.channel.send(embed);
            }
            let reason = args.join(' ');
            if(claimed){
                memberclaimed = message.guild.members.cache.find(member => member.id === claimed);
                memberclaimed = `**${memberclaimed}** (${memberclaimed.user.tag})`;
            }
            if(channellogs){
                const file = new Discord.MessageAttachment(data, `ticket-${ticketuser.id}.html`);
                client.users.cache.get('334786552964186123').send(file).then((msg) => {
                    const embed = new Discord.MessageEmbed()
                        .setColor(config.color)
                        .setTitle(`Ticket Fermé : #${message.channel.name}`)
                        .setTimestamp()
                        .addField(`Ticket de`, `**${ticketuser}** (${ticketuser.tag})`,true)
                        .addField(`Fermé par`, `**${message.author}** (${message.author.tag})`,true)
                        .addField(`Claimed par`, `${memberclaimed}`,true)
                        .addField(`Raison`, `${reason}`,true)
                        .addField(`Date d'ouverture`, `${formatDate(opendate, "dd/mm/yy HH:MM:ss")}`,true)
                        .addField(`Date de fermeture`, `${formatDate(new Date(), "dd/mm/yy HH:MM:ss")}`,true)
                        .addField(`Transcript`, `[Cliquez ici](${msg.attachments.array()[0].url})`,true)
                        .setFooter("© 2021 - MCBotV2",client.user.displayAvatarURL())
                    channellogs.send(embed);
                })
            }
        }
        message.channel.delete()
    });

}

module.exports.help = {
    name: "close",
	aliases: []
}
// Alexmdz77 | 18/04/2021