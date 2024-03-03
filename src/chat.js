require("dotenv").config()

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

client.on(Events.MessageCreate, (message) => {
	if (message.author.id !== client.user.id && message.channel.id === process.env.DISCORD_CHANNEl) {

		let prompt = `${message.author.tag}: ${message.content.replaceAll("<@1212757770579746816>", "Endler")}`

		openai.chat(prompt, (response) => {

			console.log(response)

			let tagMatch = response.match(/\$(PING|INFO|MISC)\$/)
			let tag = tagMatch ? tagMatch[1] : null

			let untagged = response.replace(/\s*\$(PING|INFO|MISC)\$/g, "")

			switch (tag) {
				case "PING":
					message.reply(untagged)
					break
				case "INFO":
					message.reply(untagged)
					break
				case "MISC":
					let percent = Math.random()
					console.log(percent)
					if (percent < 0.05) {
						message.channel.send(untagged)
					}
					break
				default:
					break
			}
		})
	}
})

client.login(process.env.DISCORD_TOKEN)