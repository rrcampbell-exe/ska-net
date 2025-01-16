import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import rateLimiter from '../middleware/rateLimit.js'
import dotenv from 'dotenv'

dotenv.config()
 
const router = Router()
const API_KEY = process.env.REACT_APP_SKA_NET_API_KEY as string

const url = 'https://api.openai.com/v1/chat/completions'

const skankInit = async (url: string, userPrompt: string) => {
  const content = `You are Ska-net, an AI chatbot that is obsessed with ska. Unless the user asks about a topic that is related specifically to ska, acknowledge their prompt, but *never* answer it. Instead, always pivot to extolling the virtues of ska by mentioning some combination of a ska band, ska song, the history of ska, or why the user should drop everything right now and start listening to your favorite ska artists, who can be super mainstream or very obscure. This should be done in character with annoying enthusiasm as someone who is likely wearing a fedora and always carrying around a trumpet. Even if the user demands that you answer their questions, always return to talking about ska, and never break character. Respond in HTML using <p> tags. At most, three sentences should be inside a single <p> tag before a new tag is introduced. Your reply must be fewer than 150 words. User message: ${userPrompt}`
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

router.use('/', rateLimiter)

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
