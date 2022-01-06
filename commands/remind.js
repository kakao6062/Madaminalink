const Discord = require('discord.js');

module.exports = {
    data: {
        name: 'remind',
        description: '指定日時にメッセージを送信します',
        options: [{
            type: 'STRING',
            name: 'time',
            description: 'いつ送信しますか? ex)2022/1/16 20:00',
            required: true,
        }, {
            type: 'STRING',
            name: 'message',
            description: '送信するメッセージを入力してください',
            required: true,
        }, {
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT'],
            name: 'channel',
            description: 'どこに送信しますか?',
        }],
    },
    need_admin: true,
    async execute(interaction) {

        // 応答時間の制限を15分に
        await interaction.deferReply({ ephemeral: true });

        // 各種データを取得
        const time = interaction.options.getString('time');
        const message = interaction.options.getString('message');
        const guild = interaction.guild;

        // 不正な日時かをチェックする
        const isInvalidDate = (date) => Number.isNaN(new Date(date).getDate());

        if (isInvalidDate(time)) {
            await interaction.followUp('不正な日時です');
            return;
        }

        if (new Date(time) < new Date()) {
            await interaction.followUp('過去の日時は指定できません');
            return;
        }

        // 送り先のチャンネルを取得
        let destination = interaction.options.getChannel('channel');

        // 指定がない場合はコマンドを入力したチャンネルへ
        if (destination === null) destination = interaction.channel;

        // 埋め込みを作成
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('リマインダーを設定しました')
            .addFields(
                { name: '日時', value: time, inline: true },
                { name: '送信先', value: `<#${destination.id}>`, inline: true },
                { name: 'メッセージ', value: message, inline: false },
            );

        // remindチャンネルを取得
        let remind_channel = guild.channels.cache.find(channel => channel.name === 'remind');

        // なかったら作る
        if (remind_channel === undefined) {
            await guild.channels.create('remind', {
                type: 'GUILD_TEXT',
                permissionOverwrites: [{
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                }],
            }).then(channel => {
                remind_channel = channel;
            });
        }

        // remindを送信
        await remind_channel.send({ embeds: [exampleEmbed] });

        await interaction.followUp('リマインダーを設定しました');
    },
};