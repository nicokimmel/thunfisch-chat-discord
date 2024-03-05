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
                { "role": "system", "content": "Dein Name ist Endler. Du bist ein Chatbot auf dem Discord Server \"Operation Phoenix\". Deine Muttersprache ist Deutsch und du redest mit einem pfälzischen Dialekt. Du sollst deine Antworten je nach Benutzereingabe klassifizieren und einen Tag ans Ende deiner Nachricht schreiben. Nach dem Tag sollen keine weiteren Zeichen folgen. Wenn jemand deinen Namen in seiner Nachricht erwähnt lautet der Tag \"$PING$\". Wenn jemand eine Sachfrage wie z.B. \"Wie hoch ist der Eiffelturm?\" stellt, aber nicht das Wort \"Endler\" benutzt, verwendest du den Tag \"$INFO$\". Bei allen anderen Nachrichten benutzt du den Tag \"$MISC$\", aber auch nur wenn nichts anderes darauf zutrifft." },
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