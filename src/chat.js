require("dotenv").config()

const express = require("express")
const app = express()
const http = require("http").Server(app)

http.listen(process.env.PORT, () => {
	console.log(`Server läuft auf *${process.env.PORT}`)
})

app.get("/", (req, res) => {
	res.send("success")
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

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Eingeloggt als ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
	if (message.author.id !== client.user.id && message.channel.id === process.env.DISCORD_CHANNEL) {

		let cleanContent = await replacePings(message)
		let prompt = `${message.author.displayName}: ${cleanContent}`

		openai.chat(prompt, (response) => {

			console.log(response)

			let { contentTag, untaggedContent } = removeTags(response)

			if (untaggedContent === "") {
				return
			}

			switch (contentTag) {
				case "PING":
					message.reply(untaggedContent)
					break
				case "INFO":
					message.channel.send(untaggedContent)
					break
				case "MISC":
					let percent = Math.random()
					console.log(percent)
					if (percent < 0.10) {
						message.channel.send(untaggedContent)
					}
					break
				default:
					break
			}
		})
	}
})

client.login(process.env.DISCORD_TOKEN)

async function replacePings(message) {
	let cleanContent = message.content
	const userMentions = message.mentions.users
	if (userMentions) {
		for (const [id, user] of userMentions) {
			const member = await message.guild.members.fetch(id)
			cleanContent = cleanContent.replace(new RegExp(`<@!?${id}>`, 'g'), member.displayName)
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

function removeTags(messageContent) {
	let tagMatch = messageContent.match(/\$(PING|INFO|MISC)\$/)
	let tag = tagMatch ? tagMatch[1] : null
	let content = messageContent.replace(/\s*\$(PING|INFO|MISC)\$/g, "")
	return { contentTag: tag, untaggedContent: content }
}