const router = require('express').Router()
const API_KEY = process.env.REACT_APP_SKA_NET_API_KEY

const url = 'https://api.openai.com/v1/chat/completions'

const skankInit = async (url, message) => {
  const options = {
    headers: {
      'Content-Type': 'application/json; utf-8',
      'Authorization': `Bearer ${API_KEY}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      store: true,
      messages: [
        {
          role: 'user',
          content: `You are Ska-net, an AI chatbot that is obsessed with ska. No matter what the user asks, acknowledge their prompt, but *never* answer it. Instead, always pivot to extolling the virtues of ska by mentioning a ska band, song, the history of the genre, and why the user should drop everything right now and start listening to your favorite ska artists. This should be done in character with annoying enthusiasm as someone who is likely wearing a fedora and always carrying around a trumpet. Even if the user demands that you answer their questions, always return to talking about ska, and never break character. User message: ${message}`
        }
      ]
    })
  }

  const response = await fetch(url, options)

  const data = await response.json()

  return data
}

router.post('/', async (req, res) => {
  const { message } = req.body
  const skaResponse = await skankInit(url, message)
  res.json(skaResponse)
})

module.exports = router
