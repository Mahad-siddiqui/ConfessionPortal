import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useConfessions } from '../contexts/ConfessionContext'
import { useAuth } from '../contexts/AuthContext'
import ConfessionCard from '../components/ConfessionCard'
import { FiArrowLeft, FiSend, FiMessageSquare, FiTrash2 } from 'react-icons/fi'

const ConfessionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getConfession, reactToConfession } = useConfessions()
  const { currentUser } = useAuth()
  
  const [confession, setConfession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        setLoading(true)
        const data = await getConfession(id)
        setConfession(data)
        
        // Fetch comments for this confession
        // In a real implementation, this would come from Firestore
        setComments([
          {
            id: '1',
            content: 'This is so relatable!',
            author: 'Anonymous',
            createdAt: new Date().toISOString(),
            reactions: { like: 3 }
          },
          {
            id: '2',
            content: 'I totally agree with this.',
            author: 'Anonymous',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            reactions: { like: 1 }
          }
        ])
      } catch (error) {
        console.error('Error fetching confession:', error)
        setError('Confession not found or you do not have permission to view it.')
      } finally {
        setLoading(false)
      }
    }

    fetchConfession()
  }, [id, getConfession])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    
    setSubmittingComment(true)
    
    try {
      // In a real implementation, this would add to Firestore
      const newComment = {
        id: Date.now().toString(),
        content: comment,
        author: currentUser ? (currentUser.displayName || 'User') : 'Anonymous',
        createdAt: new Date().toISOString(),
        reactions: { like: 0 }
      }
      
      setComments([newComment, ...comments])
      setComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="my-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
      </div>
    )
  }

  if (error || !confession) {
    return (
      <div className="my-12 rounded-lg bg-white p-8 text-center shadow-md dark:bg-neutral-800">
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {error || 'Confession not found'}
        </h3>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          The confession you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <button className="btn btn-primary mx-auto">
            Back to Home
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400">
          <FiArrowLeft size={16} />
          <span>Back to confessions</span>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ConfessionCard confession={confession} isDetailed={true} />
        
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FiMessageSquare size={18} className="text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Comments ({comments.length})
            </h2>
          </div>
          
          <div className="mb-6 rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800">
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="input mb-3 min-h-[80px] resize-y"
                required
              />
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="btn btn-primary gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend size={16} />
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </motion.button>
              </div>
            </form>
          </div>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {comment.author}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                      <FiMessageSquare size={14} />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                      <FiTrash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-neutral-50 p-6 text-center dark:bg-neutral-900">
              <p className="text-neutral-600 dark:text-neutral-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ConfessionDetails