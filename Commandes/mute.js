const Discord = require('discord.js');
const config = require('../config.json');
const db = require('quick.db');
const formatDate = require('dateformat');
const ms = require('ms');

module.exports.run = async (client, message, args) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) {return;}
    let muted_role;

    const now = new Date();

    // RESOLVE MEMBER
    let mentionedUser;
    if(message.mentions.members.first()){
        mentionedUser = message.mentions.members.first();
    }
    else {
        mentionedUser = args[0];
        if(isNaN(mentionedUser) && args[0]) {
            const embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setDescription(`**Vous ne pouvez pas mute cet utilisateur.**`)
            return message.channel.send(embed);
        }
        mentionedUser = message.guild.members.resolve(args[0]);
    }

    // Check role position
    const memberPosition = mentionedUser.roles.highest.position;
    const moderationPosition = message.member.roles.highest.position;

    if(mentionedUser.id === message.author.id || (moderationPosition < memberPosition)) {
        const embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setDescription(`**Vous ne pouvez pas mute cet utilisateur.**`)
        return message.channel.send(embed);
    }

    mutedid = db.fetch(`mutedrole_${message.guild.id}`)
    muted_role = message.guild.roles.cache.find(role => role.id = mutedid)
    // console.log(muted_role);

    if(!muted_role) {
        // console.log("create")
        muted_role = message.guild.roles.cache.find(role => role.name.toLowerCase().includes("muted"));
        console.log(muted_role);
        if(!muted_role || muted_role.id) {
            try {
                console.log("create muted")
                message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#000000",
                        permissions:['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    }
                }).then(role =>{
                    db.set(`mutedrole_${message.guild.id}`, role.id)
                })
            } catch (error) {
                return console.log(error);
            }
        } else {
            db.set(`mutedrole_${message.guild.id}`, muted_role.id)
        }
    }

    mutedid = db.fetch(`mutedrole_${message.guild.id}`)
    console.log(mutedid)
    muted_role = message.guild.roles.cache.find(role => role.id = mutedid)
    console.log(muted_role);

    // CHANNELS SET
    let channels = "";
    await message.guild.channels.cache.forEach((channel) => {
        channel.updateOverwrite(muted_role.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CONNECT: false
        }).catch((error) => {
            channels += `\`${channel.name}\`, `;
        });
    });
    if (channels.length !== 0){
        console.log('pas de perms channels frero')
    }

    // DB SET
    let count = 0;
    await db.all().forEach((element) => {
        const sanctionsdb = element.ID.startsWith(`sanctions_${message.guild.id}_${mentionedUser.id}`);
        if (!sanctionsdb) {
            return;
        }
        count++;
    });
    let raison = 'Unspecified'
    let temps = 'Forever'
    if(args[1] && ms(args[1])) {
        if(ms(args[1])< 120000 || ms(args[1])> 63070000000){
            const embed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setDescription(`**L'argument \`time\` doit être compris entre 2 minutes et 2 ans. (2m et 2y)**`)
            return message.channel.send(embed);
        }
        time = ms(args[1]) + now.getTime() 
        raison = args.slice(2).join(" ") || "Unspecified";
        temps = ms(ms(args[1]), { long: true })
        db.set(`mute_${message.guild.id}_${mentionedUser.id}`, time)
    } else {
        if(args[1]) {
            raison = args.slice(1).join(" ") || "Unspecified";
        }
        db.set(`mute_${message.guild.id}_${mentionedUser.id}`, `forever`)
    }

    mentionedUser.roles.add(muted_role.id)
    
    // message.client.users.fetch(mentionedUser.id).then(user => user.roles.add(muted_role.id))

    const muted_embed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle(`Vous avez été mute de ${message.guild.name} par ${message.author.tag}`)
        .setDescription(`**Durée :** ${temps}\n**Raison :** ${raison}`)
    mentionedUser.send(muted_embed)
    
    db.set(`sanctions_${message.guild.id}_${mentionedUser.id}_${count+1}`, `Muted by ${message.author.tag} | Reason: ${raison} | Duration: ${temps} | Time: ${formatDate(now, "mm/dd/yy HH:MM:ss")}`);
    
    const embed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle(`${mentionedUser.user.tag} (id: ${mentionedUser.id}) a été mute par ${message.author.tag}`)
        .setDescription(`**Durée :** ${temps}\n**Raison :** ${raison}`)
    return message.channel.send(embed)
};

module.exports.help = {
    name: 'mute',
    aliases: ['']
};