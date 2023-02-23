const { Client, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} kullanıcı adı ile giriş yaptı!`);
  const statuses = [
    "Made by Synin",
    "Gizem Kurt'un Yan Çarları"
  ];
  let i = 0;
  setInterval(() => {
    client.user.setActivity(statuses[i], { type: "PLAYING" });
    i = (i + 1) % statuses.length;
  }, 4000);
});

client.on('messageCreate', async message => {
  // Spoiler içindeki mesajlar ignore edilir
  if (message.content.includes('||')) return;

  // Küfürlü kelime listesi
  const badWords = config.badWords;

  // Küfür kontrolü
  const regex = new RegExp('\\b(' + badWords.join('|') + ')\\b', 'gi'); // "\\b" kelime sınırı anlamına gelir
  const isBadWord = regex.test(message.content.toLowerCase());

  const allowedRole = message.guild.roles.cache.get('filtreden engellenmeyecek rolün idsini buraya girelim.'); // engellenmeyecek rolün ID'si
  if (!isBadWord || message.member.roles.cache.has(allowedRole.id)) return;

  await message.delete();
  message.channel.send(`${message.author}, Lütfen küfür etmeyin.`)
    .then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000); // 5 saniye sonra mesajı silme
    });
});

client.login(config.token);