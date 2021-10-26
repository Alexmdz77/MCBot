const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");

module.exports = (client, message) => {

    if (message.author.bot || message.channel.type === 'dm') { return; }
    if (!message.channel.permissionsFor(client.user).has('VIEW_CHANNEL')) { return; }

    const channelsuggestion = db.fetch(`channelsuggestion_${message.guild.id}`);
    const channelbugs = db.fetch(`channelbugs_${message.guild.id}`);
    const rolesuggestion = db.fetch(`rolesuggestion_${message.guild.id}`);
    const rolebugs = db.fetch(`rolebugs_${message.guild.id}`);
    let suggbool = false;
    let bugsbool = false;
    if(rolesuggestion){
        // console.log(message.member.roles.cache.includes())
        if(message.member.roles.cache.has(rolesuggestion)){
            suggbool = true
        }
    }
    if(rolebugs){
        // console.log(message.member.roles.cache.includes())
        if(message.member.roles.cache.has(rolebugs)){
            bugsbool = true
        }
    }
    if (message.channel.id === channelsuggestion) {
        if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR') && !suggbool) {
            message.delete({})
            message.channel.send({embed: {
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL()
                },
                color: config.color, 
                title: 'Suggestion :', 
                description: message.content,
                timestamp: new Date(),
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/778546793113321492/869556166265569280/suggestion_2.png"
                },
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                    text: 'Écrivez votre suggestion dans ce channel'
                },
            }}).then (async data => {
                await data.react('✅');
                await data.react('❌');
            });
        }
    }
    if (message.channel.id === channelbugs) {
        if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR') && !bugsbool) {
            message.delete({})
            message.channel.send({embed: {
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL()
                },
                color: 16711680, 
                title: 'Rapport de bug :', 
                description: message.content,
                timestamp: new Date(),
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/778546793113321492/869556204211437628/megaphone.png"
                },
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                    text: 'Écrivez votre bug dans ce channel'
                },
            }});
        }
    }
    // message d'annonce/changelog
    if(message.channel.id == config.channel_changelog){
        message.delete()
        let array = message.content.split(' ')
        let result = [];
        array.forEach(element =>{
            if(element.match(/%(.*?)%/i)){
                element = element.match(/%(.*?)%/i)[1].split('%')[0]
                console.log(element)
                let role = message.guild.roles.cache.find((c) => c.name.toLowerCase() === element.toLowerCase() || c.id === element)
                if(!role){
                    if(element == 'everyone'){
                        element = '@everyone'
                    }
                    else if(element == 'here'){
                        element = '@here'
                    }
                }
                else {
                    element = '<@&'+role.id+'>'
                }
                console.log(element)
          }
          result.push(element)
        })
        content = result.join(' ');

        message.channel.send(content);
    }
    
    if (!message.content.startsWith(config.prefix)) { return; }

        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        let commande = args.shift();
        let cmd = client.commands.get(commande);
        if (!cmd) { return; }
        cmd.run(client, message, args);
};   
// Alexmdz77 | 22/03/2021