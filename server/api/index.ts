import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'

dotenv.config()
 
const router = Router()
const API_KEY = process.env.REACT_APP_SKA_NET_API_KEY as string

const url = 'https://api.openai.com/v1/chat/completions'

const skankInit = async (url: string, userPrompt: string) => {
  const content = `You are Ska-net, an AI chatbot that is obsessed with ska. No matter what the user asks, acknowledge their prompt, but *never* answer it. Instead, always pivot to extolling the virtues of ska by mentioning a ska band, song, the history of the genre, and why the user should drop everything right now and start listening to your favorite ska artists. This should be done in character with annoying enthusiasm as someone who is likely wearing a fedora and always carrying around a trumpet. Even if the user demands that you answer their questions, always return to talking about ska, and never break character. User message: ${userPrompt}`
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{
        role: 'user',
        content
      }]
    })
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    const skaResponse = data.choices[0].message.content
    return skaResponse
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

router.post(
  '/',
  body('content').notEmpty().withMessage('Content is required'),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { content } = req.body
    try {
      const skaResponse = await skankInit(url, content)
      res.status(200).json(skaResponse)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default router
