const Discord = require('discord.js');

const config = require('../config.json');
const db = require("quick.db");

module.exports = (client) => {
    
  client.user.setActivity(``, {type : 'PLAYING'});

  // MemberCount

  setInterval(() => {
    db.all().forEach((element) => {
      const membercount = element.ID.startsWith('membercount');
      if (!membercount) {
        return;
      }
      const guild = client.guilds.cache.get(element.ID.split('_')[1]);
      const channel = client.channels.cache.get(element.ID.split('_')[2]);
      if(!channel){
        db.delete(element.ID); 
        return;
      }
      const channelName = db.fetch(`membercount_${guild.id}_${channel.id}`);
      if(!channelName){
        channel.delete();
        return;
      }
      guild.members.fetch().then((g) => {
        const count = g.filter((member) => !member.user.bot).size;
        channel.setName(channelName.replace(/%count%/g, count));
      });
    });
  }, 60000);
};
// Alexmdz77 | 22/08/2021