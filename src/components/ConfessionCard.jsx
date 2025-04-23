import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useConfessions } from '../contexts/ConfessionContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  FiThumbsUp, 
  FiHeart, 
  FiSmile, 
  FiMessageSquare, 
  FiClock, 
  FiTag,
  FiEye
} from 'react-icons/fi'

const categoryIcons = {
  funny: <FiSmile className="text-yellow-500" />,
  serious: <FiClock className="text-blue-500" />,
  venting: <FiMessageSquare className="text-red-500" />,
  appreciation: <FiHeart className="text-pink-500" />,
  question: <FiTag className="text-purple-500" />,
  other: <FiTag className="text-neutral-500" />
}

const ConfessionCard = ({ confession, isDetailed = false }) => {
  const { reactToConfession } = useConfessions()
  const { currentUser } = useAuth()
  const [isReacting, setIsReacting] = useState(false)

  const {
    id,
    content,
    category = 'other',
    revealIdentity,
    displayName,
    reactions = {},
    createdAt,
    status
  } = confession

  const formattedDate = createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : 'Just now'

  const handleReaction = async (type) => {
    if (isReacting) return

    try {
      setIsReacting(true)
      await reactToConfession(id, type)
    } catch (error) {
      console.error('Error adding reaction:', error)
    } finally {
      setIsReacting(false)
    }
  }

  // Animation variants
  const cardVariants = {
    hover: { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    tap: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }
  }

  return (
    <motion.div 
      className={`card ${isDetailed ? 'w-full' : 'mb-6'}`}
      whileHover={!isDetailed ? "hover" : undefined}
      whileTap={!isDetailed ? "tap" : undefined}
      variants={cardVariants}
      transition={{ duration: 0.2 }}
    >
      {status === 'pending' && (
        <div className="mb-3 rounded-md bg-yellow-100 px-3 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Pending approval
        </div>
      )}
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {categoryIcons[category] || categoryIcons.other}
          <span className="text-sm font-medium capitalize text-neutral-700 dark:text-neutral-300">
            {category}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
          <FiClock size={12} />
          {formattedDate}
        </span>
      </div>
      
      <div className="mb-4">
        {isDetailed ? (
          <p className="whitespace-pre-line text-neutral-800 dark:text-neutral-200">{content}</p>
        ) : (
          <p className="line-clamp-3 text-neutral-800 dark:text-neutral-200">
            {content}
          </p>
        )}
      </div>
      
      {revealIdentity && displayName && (
        <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">Posted by:</span> {displayName}
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-3">
          <button
            onClick={() => handleReaction('like')}
            disabled={isReacting || status === 'pending'}
            className={`flex items-center gap-1 rounded-full p-1.5 text-sm ${
              reactions.like ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400'
            } hover:bg-neutral-100 dark:hover:bg-neutral-700`}
          >
            <FiThumbsUp size={16} />
            <span>{reactions.like || 0}</span>
          </button>
          
          <button
            onClick={() => handleReaction('love')}
            disabled={isReacting || status === 'pending'}
            className={`flex items-center gap-1 rounded-full p-1.5 text-sm ${
              reactions.love ? 'text-pink-600 dark:text-pink-400' : 'text-neutral-600 dark:text-neutral-400'
            } hover:bg-neutral-100 dark:hover:bg-neutral-700`}
          >
            <FiHeart size={16} />
            <span>{reactions.love || 0}</span>
          </button>
          
          <button
            onClick={() => handleReaction('laugh')}
            disabled={isReacting || status === 'pending'}
            className={`flex items-center gap-1 rounded-full p-1.5 text-sm ${
              reactions.laugh ? 'text-yellow-600 dark:text-yellow-400' : 'text-neutral-600 dark:text-neutral-400'
            } hover:bg-neutral-100 dark:hover:bg-neutral-700`}
          >
            <FiSmile size={16} />
            <span>{reactions.laugh || 0}</span>
          </button>
        </div>
        
        {!isDetailed && status === 'approved' && (
          <Link
            to={`/confession/${id}`}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <FiEye size={16} />
            <span>View confession</span>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default ConfessionCard