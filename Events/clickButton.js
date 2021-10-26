const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");
const { MessageButton } = require('discord-buttons');

module.exports = async (client, button) => {

    await button.defer(true);

    let user = button.clicker.user;
    let message = button.message;
    let member = button.clicker.member;
    if(button.id == 'ticket_create'){

        let name = user.username.replace(/([^a-z0-9]+)/gi, '').normalize('NFKC');
        if(name == ''){
            name = user.username.normalize('NFKC');
        }
        
        console.log("Ticket de "+user.tag);

        let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
        // Check if ticket existant
        if (message.guild.channels.cache.some(c => c.topic && c.topic.includes(user.id)) && !member.hasPermission("ADMINISTRATOR") && !member.roles.cache.has(role => role.id === rolesupport)){ //  
            return message.channel.send("Vous possedez déjà un ticket actif !").then(msg => {
                msg.delete({ timeout: 2000 })
            })
        }

        //  Création du ticket
        let category_id = db.fetch(`categorieticket_${message.guild.id}`);
        let category = client.channels.cache.find(c => c.id === category_id)

        message.guild.channels.create("ticket・"+name, {
        type: 'text',
        topic: 'MCBotV2 Ticket n°' + user.id + ' - User : ' + user.tag,
        parent: category.id,
        permissionOverwrites: [
            {
            id: message.guild.roles.everyone,
            deny: ['VIEW_CHANNEL','SEND_MESSAGES'],
            },
            {
            id: user,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
            },
            {
            id: client.user,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
            },
            {
            id: rolesupport,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES'],
            }
        ]
        }).then(c => {

            // user.send(`${name}, votre ticket a été créé ici : <#${c.id}>.`);

            let button = new MessageButton()
            .setLabel("Fermer le ticket")
            .setStyle("red")
            .setEmoji("🔒")
            .setID("ticket_delete")

            // const embed = new Discord.MessageEmbed()
        
            // .setColor(config.color)
            // .setTitle('**__Contrôle de votre ticket__**')
            // .addField(`MCBotV2 | Support `, 
            // `Vous pouvez clôturer votre ticket en cliquant sur le bouton 🔒.`)
            // .setTimestamp();
            // c.send({
            //     embed: embed
            // })

            const embed1 = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle('MCBotV2・Support')
            .setURL('https://MCBotV2.fr/')
            .setDescription(`Votre ticket sera pris en charge dans quelques instants.\n\nPour faciliter le travail du support, veuillez expliquer votre plainte, problème ou requête de manière précise.\n\n**Formuler un ticket clair et précis :**\n🔹 Indiquer votre pseudo en jeu.\n🔹 Expliquer en détails votre problème.\n🔹 Fournir le plus de preuves possible.`)
            .setThumbnail(user.displayAvatarURL())
            embed1.setFooter("MCBotV2",client.user.displayAvatarURL())
            .setTimestamp();
            c.send(`${user}`,{
                component: button,
                embed: embed1
                })
                
            db.set(`logs_date_${message.guild.id}_${c.id}`, new Date());
        })
    }
    if(button.id == 'ticket_delete'){
        let content = ["Aucune."];
        return client.commands.get("close").run(client, message, content);
    }
};
// Alexmdz77 | 16/06/2021