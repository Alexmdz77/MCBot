const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const config = require('./config.json');
const fs = require('fs');
require('discord-buttons')(client);

fs.readdir('./Commandes/', (error, f) => {
	if (error) { return console.error(error); }
	let commandes = f.filter(f => f.split('.').pop() === 'js');
	if (commandes.length <= 0) { return console.log('Aucune commande trouvée !'); }

	commandes.forEach((f) => {
		let commande = require(`./Commandes/${f}`);- 
		console.log(`${f} commande chargée !`);
		client.commands.set(commande.help.name, commande);
		commande.help.aliases.forEach(alias => {
			client.aliases.set(alias, commande.help.name);
		});
	});
});

fs.readdir('./Events/', (error, f) => {
    if (error) { return console.error(error); }
    console.log(`${f.length} events chargés`);

    f.forEach((f) => {
        let events = require(`./Events/${f}`);
        let event = f.split('.')[0];
        client.on(event, events.bind(null, client));
    });
});


client.login(config.token);
// Alexmdz77 | 22/03/2021