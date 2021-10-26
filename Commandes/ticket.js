const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");
const { MessageButton } = require('discord-buttons');

module.exports.run = async (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) {return;}
    message.delete();

    let rolesupport = message.guild.roles.cache.find((c) => c.name === args[0] || c.id === args[0]);
    let logs = message.mentions.channels.first();

    if (!rolesupport) { 
        rolesupport_id = db.fetch(`rolesupport_${message.channel.guild.id}`);
        if(!rolesupport_id) return message.channel.send('Vous n\'avez pas mentionné de role support !'); 
        rolesupport = message.guild.roles.cache.find((c) => c.id === rolesupport_id);
        if(!rolesupport) return message.channel.send('Vous n\'avez pas mentionné de role support !'); 
    } else {
        // Le role support
        message.channel.send(`Le role **${rolesupport.name}** est maintenant le **role support** !`).then (function (data){
            data.react('✅');
            setTimeout(function(){ 
                db.set(`rolesupport_${data.channel.guild.id}`, rolesupport.id);
            }, 2000);
            data.delete({ timeout: 5000 })
        });
    }


    if(logs){
        message.channel.send(`Le channel **${logs.name}** est maintenant le **channel de logs** !`).then (function (data){
            data.react('✅');
            setTimeout(function(){ 
                db.set(`logs_${data.channel.guild.id}`, logs.id);
            }, 2000);
            data.delete({ timeout: 5000 })
        });
    }

    // Message de création des tickets
    let button = new MessageButton()
    .setLabel("Ouvrir un ticket")
    .setStyle("green")
    .setEmoji("📩")
    .setID("ticket_create")

    message.channel.send({
        component: button,
        embed: {
            description:`Contactez notre support grâce à un ticket, il sera pris en charge dès que possible !\n\nAfin de créer un ticket et obtenir de l'aide, réagissez avec le bouton juste en dessous. 📩\n\n:warning: Merci de préciser votre pseudo et votre serveur en expliquant votre problème, plainte ou requête !`,
            title: "**MCBotV2 • Support**",
            url: "https://MCBotV2.fr/",
            thumbnail: {
              url: "https://media.discordapp.net/attachments/778546793113321492/869556177841840148/customer-service.png"
            },
            footer: {
                text: "MCBotV2 | Support",
                icon_url: client.user.displayAvatarURL()
            }
        }
    }).then (function (data){
        // data.react('📝')
        data.channel.updateOverwrite(data.channel.guild.roles.everyone, { 
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });

        setTimeout(function(){ 
            db.set(`messageticket_${data.channel.guild.id}`, data.id);
            db.set(`categorieticket_${data.channel.guild.id}`, data.channel.parentID);
        }, 5000);
    })

}

module.exports.help = {
    name: "ticket",
	aliases: []
}
// Alexmdz77 | 22/03/2021