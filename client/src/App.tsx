import { useState } from 'react'
import parse from 'html-react-parser'
import './App.css'

function App() {
  const [content, setContent] = useState<string>('')
  const [response, setResponse] = useState<any>(null)
  const [isFormHidden, setIsFormHidden] = useState<boolean>(false)
  const [isResponseHidden, setIsResponseHidden] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsFormHidden(true)
      setIsLoading(true)
      setIsResponseHidden(false)
      const response: Response = await fetch('http://localhost:9173/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const data = await response.json()
      setIsLoading(false)
      setResponse(data)
    } catch (error) {
      setIsLoading(false)
      setHasError(true)
    }
  }

  const handleNewQuestion = () => {
    setHasError(false)
    setIsResponseHidden(true)
    setContent('')
    setResponse(null)
    setIsFormHidden(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className='app'>
      <div className='logo-container'>
        <img src='skanet-logo.png' alt='Ska-net' className='logo' />
      </div>
      <div className='response-and-form-box'>
        {hasError &&
          <div className='error'>
            <p>Sorry, kiddo, but I've been skanking way too hard.</p>
            <p>Try again later.</p>
            <button onClick={handleNewQuestion}>
              Pick it up!
            </button>
          </div>
        }
        {response &&
          <div className={`response-container ${isResponseHidden ? 'hidden' : ''}`}>
            <div className='response'>
              {parse(response)}
            </div>
            <button onClick={handleNewQuestion}>
              Ask another question
            </button>
          </div>
        }
        {isLoading &&
          <div className='loader-container'>
            <div className='loader'>
              🎺🎸
            </div>
            <p>Scoping out the scene...</p>
          </div>
        }
        {!isFormHidden &&
          <form
            onSubmit={handleSubmit}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask me anything, boss."
              onKeyDown={handleKeyDown}
              maxLength={200}
            />
            <button type='submit' disabled={isFormHidden || content === ''}>Send</button>
          </form>
        }
      </div>
    </div>
  )
}

export default App
