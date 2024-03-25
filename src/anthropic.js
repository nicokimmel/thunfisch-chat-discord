const { Anthropic } = require("@anthropic-ai/sdk")

class AnthropicWrapper {

    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API
        })
    }

    async chat(messages, callback) {
        const message = await this.anthropic.messages.create({
            max_tokens: 1024,
            messages: messages,
            model: "claude-3-haiku-20240307",
        })
        callback(message.content[0].text)
    }
}

module.exports = { AnthropicWrapper }