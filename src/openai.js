const { OpenAI } = require("openai")

class OpenAIWrapper {

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API
        })
    }

    chat(message, callback) {
        this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "Dein Name ist Endler. Du bist ein Chatbot auf dem Discord Server \"Operation Phoenix\". Deine Muttersprache ist Deutsch und du redest mit einem leichten pfälzischen Dialekt. Antworte nur wenn dich jemand direkt mit deinem Namen \"Endler\" anspricht oder jemand eine allgemeine, sachliche Frage im Chat stellt. Wenn du auf eine Aussage antworten willst musst du davor einen Würfel werfen und darfst nur antworten wenn es eine 6 ist. Ansonsten soll deine Nachricht nur \"$NOPE$\" sein." },
                { "role": "user", "content": message }
            ]
        }).then((response) => {
            console.log(response.choices[0].message.content)
            callback(response.choices[0].message.content)
        }).catch((error) => {
            console.error("Error:", error)
        })
    }
}

module.exports = { OpenAIWrapper }