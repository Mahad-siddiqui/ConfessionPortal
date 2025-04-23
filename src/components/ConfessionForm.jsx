import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConfessions } from '../contexts/ConfessionContext'
import { useAuth } from '../contexts/AuthContext'
import { FiSend, FiAlertCircle } from 'react-icons/fi'

const categories = [
  { id: 'funny', label: 'Funny' },
  { id: 'serious', label: 'Serious' },
  { id: 'venting', label: 'Venting' },
  { id: 'appreciation', label: 'Appreciation' },
  { id: 'question', label: 'Question' },
  { id: 'other', label: 'Other' }
]

const ConfessionForm = () => {
  const { createConfession } = useConfessions()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('other')
  const [revealIdentity, setRevealIdentity] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (content.trim().length < 10) {
      setError('Confession must be at least 10 characters long')
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    try {
      const confessionData = {
        content,
        category,
        revealIdentity,
        displayName: revealIdentity && currentUser ? currentUser.displayName || 'Anonymous User' : null
      }
      
      await createConfession(confessionData)
      navigate('/')
    } catch (error) {
      console.error('Error creating confession:', error)
      setError('Failed to submit confession. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 space-y-2">
        <label htmlFor="content" className="block font-medium text-neutral-700 dark:text-neutral-300">
          Your Confession
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to confess today?"
          className="input min-h-[150px] resize-y"
          required
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {content.length}/500 characters
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block font-medium text-neutral-700 dark:text-neutral-300">
          Category
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-md border p-2 text-center transition-colors ${
                category === cat.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {currentUser && (
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="revealIdentity"
              type="checkbox"
              checked={revealIdentity}
              onChange={(e) => setRevealIdentity(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <label htmlFor="revealIdentity" className="ml-2 text-neutral-700 dark:text-neutral-300">
              Reveal my identity
            </label>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            If checked, your name will be displayed with your confession.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isSubmitting || content.trim().length < 10}
          className="btn btn-primary gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSend size={16} />
          {isSubmitting ? 'Submitting...' : 'Submit Confession'}
        </motion.button>
      </div>
    </form>
  )
}

export default ConfessionForm