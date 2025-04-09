import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
    ],
});

const prefix = '!';

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} está listo!`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'precio') {
        const cripto = args[0];
        if (!cripto) {
            return message.reply('Ingresa una criptomoneda válida. Ejemplo: `!precio bitcoin`');
        }

        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cripto}`
            );

            if (response.data.length === 0) {
                return message.reply(`No se encontró la criptomoneda "${cripto}".`);
            }

            const criptoData = response.data[0];
            const precio = criptoData.current_price;
            const imagen = criptoData.image;

            const embed = new EmbedBuilder()
                .setTitle(`Precio de ${criptoData.name} (${criptoData.symbol.toUpperCase()})`)
                .setDescription(`El precio actual es **$${precio} USD**.`)
                .setThumbnail(imagen)
                .setColor('#00FF00') 
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener el precio:', error);
            message.reply('Hubo un error al obtener el precio de la criptomoneda.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Bot iniciando sesión...'))
    .catch((error) => {
        console.error('Error al iniciar sesión:', error);
    });




