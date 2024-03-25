require("dotenv").config()

const express = require("express")
const app = express()
const http = require("http").Server(app)

app.get("/", (req, res) => {
	res.send("success")
})

http.listen(process.env.PORT, () => {
	console.log(`Server läuft auf *${process.env.PORT}`)
})

const { Client, Events, GatewayIntentBits } = require("discord.js")
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	]
})

const { OpenAIWrapper } = require("./openai.js")
const openai = new OpenAIWrapper()
//const { AnthropicWrapper } = require("./anthropic.js")
//const anthropic = new AnthropicWrapper()

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Eingeloggt als ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
	if (message.author.id === client.user.id) {
		return
	}

	if (message.channel.id !== process.env.DISCORD_CHANNEL) {
		return
	}

	if (!await containsEndler(message)) {
		return
	}

	let history = await collectReplyHistory(message)
	history.unshift({ "role": "system", "content": process.env.SYSTEM_PROMPT })
	
	openai.chat(history, (response) => {
		message.reply(response)
	})
})

client.login(process.env.DISCORD_TOKEN)

async function replacePings(message) {

	let cleanContent = message.content

	const userMentions = message.mentions.users
	if (userMentions) {
		for (const [id, user] of userMentions) {
			const member = await message.guild.members.fetch(id)
			cleanContent = cleanContent.replace(new RegExp(`<@!?${id}>`, 'g'), member.user.username)
		}
	}

	const roleMentions = message.mentions.roles
	if (roleMentions) {
		for (const [id, role] of roleMentions) {
			cleanContent = cleanContent.replace(new RegExp(`<@&${id}>`, 'g'), role.name)
		}
	}

	return cleanContent
}

async function containsEndler(message) {

	if (message.content.toLowerCase().includes("<@1212757770579746816>")) {
		return true
	}

	if (message.reference?.messageId) {
		try {
			const repliedToMessage = await message.channel.messages.fetch(message.reference.messageId)
			if (repliedToMessage.author.id === process.env.DISCORD_BOT_ID) {
				return true
			}
		} catch (error) {
			return false
		}
	}

	return false
}

async function collectReplyHistory(message, history = []) {
	
	const cleanContent = await replacePings(message)
	if (message.author.id === process.env.DISCORD_BOT_ID) {
		history.unshift({ "role": "assistant", "content": cleanContent })
	} else {
		let senderName = message.author.username
		history.unshift({ "role": "user", "content": `${senderName}: ${cleanContent}` })
	}

	if (message.reference && message.reference.messageId) {
		const repliedToMessage = await message.channel.messages.fetch(message.reference.messageId)
		await collectReplyHistory(repliedToMessage, history)
	}

	return history
}