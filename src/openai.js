const { OpenAI } = require("openai")

class OpenAIWrapper {

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API
        })
    }

    chat(messages, callback) {
        this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages
        }).then((response) => {
            callback(response.choices[0].message.content)
        }).catch((error) => {
            console.error("Error:", error)
        })
    }
    
    image(messages, callback) {
        this.openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: messages
        }).then((response) => {
            callback(response.choices[0].message.content)
        }).catch((error) => {
            console.error("Error:", error)
        })
    }
}

module.exports = { OpenAIWrapper }