require("dotenv").config()

const { Client, Events, GatewayIntentBits } = require('discord.js')
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

client.on(Events.MessageCreate, (message) => {
	console.log(`Nachricht von ${message.author.tag}: ${message.content}`)
	if (message.author.id !== client.user.id) {
		let prompt = `${message.author.tag}: ${message.content.replaceAll("<@1212757770579746816>", "@Endler")}`
		console.log(prompt)
		openai.chat(prompt, (response) => {
			if (response !== "$NOPE$") {
				message.channel.send(response)
			}
		})
	}
})

client.login(process.env.DISCORD_TOKEN)