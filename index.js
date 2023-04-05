const qrcode = require('qrcode-terminal');
const memes = require("random-memes");
const fs = require('fs')
const weather = require('weather-js');
const mime = require('mime-types')
const { MessageMedia } = require('whatsapp-web.js');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

console.log('Client is ready!');
client.on('message', async message => {
    client.on('message', async (msg) => {
        const mentions = await msg.getMentions();
    });
    
    switch (message.body) {
        case '!help':
            message.reply("Hi I am Griffith an open source whatsapp group management bot.\t \n\n\nSend any of the following commands to have a conversation with me \n\n\n *!help*:- Sends all  bot commands \n\n *!alive*:- Checks whether bot is alive or not \n\n *!sticker*:- Converts an image to sticker  \n\n *!meme* :- Sends a random meme sometimes dank meme \n\n *!info*:- To get connection information \n\n *!groupinfo*:- Sends group information (⚠️ command cannot be used in personal chat ) \n\n*!quote*:- Sends a cringy quote to help boost your morale \n\n *!source*:- Sends  Github repository link")
            break;
        case '!alive':
            message.reply("As you can see I am alive and well. So tell me what brings you to summon me");
            break;
        case '!sticker':
            if (message.hasMedia) {
                message.downloadMedia().then(media => {
                    if (media) {
                        const mediaPath = './downloaded-media/'
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath)
                        }

                        const extension = mime.extension(media.mimetype);

                        const filename = new Date().getTime();

                        const fullFilename = mediaPath + filename + '.' + extension;

                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
                            MessageMedia.fromFilePath(filePath = fullFilename)
                            client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true, stickerAuthor: "Created By Griffith", stickerName: "Griffith's-Pack" })
                            fs.unlinkSync(fullFilename)
                            console.log(`File Deleted successfully!`,);
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`,);
                        }
                    }
                });
            } else {
                message.reply(`send image with caption *!sticker* `)
            }
            break;

        case '!meme':
            const memeImg = await memes.random()
            const media = await MessageMedia.fromUrl(memeImg.image);
            client.sendMessage(message.from, message.reply(media), { caption: memeImg.image })
            break;

        case '!delete':
            message.reply("under development")
            break;

        case '!quote':
            const apiData = await fetch('https://type.fit/api/quotes')
            const JsonData = await apiData.json();
            message.reply(`*${JsonData[Math.floor(Math.random() * JsonData.length)].text}*`)
            break;
        case '!info':
            let info = client.info;
            client.sendMessage(message.from, `*Connection info*\nBot name: ${info.pushname}
            \nNumber: ${info.me.user}\nServer:${info.me.server}\nPlatform: ${info.platform}
            `);
            break;
        case '!groupinfo':
            let chat = await message.getChat();
            if (chat.isGroup) {
                message.reply(`*Details of* ${chat.name} \n\nDescription: ${chat.description}\nCreated At: ${chat.createdAt.toString()}\nCreated By: ${chat.owner.user}\nParticipant count: ${chat.participants.length}`);
            } else {
                message.reply('This command can only be used in a group!');
            }

        break;
        default:
            message.reply("Screw you use !help before sending weird commands you nerd 🤓")
            break;
    }
});


client.initialize();
