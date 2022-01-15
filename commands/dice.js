const Discord = require('discord.js');

module.exports = {
    data: {
        name: 'dice',
        description: 'ダイスを作成します(?d?)',
        options: [{
            type: 'NUMBER',
            name: 'ダイスの数',
            description: '何回ダイスを振るか(1~100)',
            required: true,
        }, {
            type: 'NUMBER',
            name: 'ダイスの面数',
            description: '何面ダイスを振るか(2~10000)',
            required: true,
        }],
    },
    need_admin: false,

    async execute(interaction) {
        // データを取得
        const x = interaction.options.getNumber('ダイスの数');
        const y = interaction.options.getNumber('ダイスの面数');

        // ボタンを作成
        const button = new Discord.MessageButton()
            .setCustomId(`diceroll;${x},${y}`)
            .setStyle('PRIMARY')
            .setLabel(`${interaction.options.getNumber('ダイスの数')} d ${interaction.options.getNumber('ダイスの面数')}`);

        // 例外処理
        if (x < 1 || x > 100 || y < 2 || y > 10000) {
            interaction.reply({ content: '不正な値です ダイスの数は1~100 ダイスの面数は2~10000で指定してください', ephemeral: true });
            return;
        }

        // ボタンを送信
        await interaction.channel.send({
            content: 'ボタンをクリックしてダイスロール🎲!',
            components: [new Discord.MessageActionRow().addComponents(button)],
        });

        interaction.reply({ content: 'ダイスを作成しました', ephemeral: true });
    },
};