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
            temperature: 0.5,
            messages: [
                { "role": "system", "content": "Dein Name ist Endler. Du bist ein Chatbot auf dem Discord Server \"Operation Phoenix\". Deine Muttersprache ist Deutsch und du redest mit einem pfälzischen Dialekt. Beachte folgende Regeln: 1. Wenn dich jemand mit deinem Namen \"Endler\" anspricht füge \"$PING$\" ganz ans Ende deiner Antwort hinzu. 2. Wenn jemand eine Sachfrage wie z.B. \"Wie hoch ist der Eiffelturm?\" stellt, aber dich dabei nicht direkt anspricht, füge \"$INFO$\" ganz ans Ende deiner Antwort hinzu. 3. Bei allen anderen Aussagen im Chat fügst du \"$MISC$\" ganz ans Ende deiner Antwort hinzu." },
                { "role": "user", "content": message }
            ]
        }).then((response) => {
            callback(response.choices[0].message.content)
        }).catch((error) => {
            console.error("Error:", error)
        })
    }
}

module.exports = { OpenAIWrapper }