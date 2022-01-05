const Discord = require('discord.js');

module.exports = {
    data: {
        name: 'dice',
        description: 'ダイスを作成します(?d?)',
        options: [{
            type: 'NUMBER',
            name: 'ダイスの数',
            description: '何回ダイスを振るか',
            required: true,
        }, {
            type: 'NUMBER',
            name: 'ダイスの面数',
            description: '何面ダイスを振るか',
            required: true,
        }],
    },
    need_admin: false,

    async execute(interaction) {
        const button = new Discord.MessageButton()
            .setCustomId('dicerole')
            .setStyle('PRIMARY')
            .setLabel(`${interaction.options.getNumber('ダイスの数')} d ${interaction.options.getNumber('ダイスの面数')}`);
        await interaction.channel.send({
            content: 'ボタンをクリックしてダイスロール🎲!',
            components: [new Discord.MessageActionRow().addComponents(button)],
        });
        interaction.reply({ content: 'ダイスを作成しました', ephemeral: true });
    },
};