import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConfessions } from '../contexts/ConfessionContext'
import ConfessionCard from '../components/ConfessionCard'
import { FiFilter, FiPlus, FiRefreshCw } from 'react-icons/fi'

const Home = () => {
  const { 
    confessions, 
    loading, 
    filter, 
    setFilter, 
    category, 
    setCategory, 
    sortBy, 
    setSortBy 
  } = useConfessions()
  
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'funny', label: 'Funny' },
    { id: 'serious', label: 'Serious' },
    { id: 'venting', label: 'Venting' },
    { id: 'appreciation', label: 'Appreciation' },
    { id: 'question', label: 'Question' },
    { id: 'other', label: 'Other' }
  ]

  const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
    { id: 'mostLiked', label: 'Most Liked' }
  ]

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const resetFilters = () => {
    setFilter('approved')
    setCategory('all')
    setSortBy('newest')
  }

  // Filter only approved confessions for public view
  const approvedConfessions = confessions.filter(conf => conf.status === 'approved')

  return (
    <div>
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-left">
            Campus Confessions
          </h1>
          <p className="mt-2 text-center text-neutral-600 dark:text-neutral-400 sm:text-left">
            Share your thoughts anonymously, connect with others
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={toggleFilters}
            className="btn btn-secondary gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFilter size={16} />
            <span>Filter</span>
          </motion.button>
          
          <Link to="/create">
            <motion.button
              className="btn btn-primary gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={16} />
              <span>New Confession</span>
            </motion.button>
          </Link>
        </div>
      </div>
      
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Category
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      category === cat.id
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Sort By
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      sortBy === option.id
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <motion.button
                onClick={resetFilters}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw size={14} />
                <span>Reset Filters</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {loading ? (
        <div className="my-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
        </div>
      ) : approvedConfessions.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approvedConfessions.map((confession) => (
            <ConfessionCard key={confession.id} confession={confession} />
          ))}
        </div>
      ) : (
        <div className="my-12 rounded-lg bg-white p-8 text-center shadow-md dark:bg-neutral-800">
          <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            No confessions found
          </h3>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            Be the first to share your thoughts with the community!
          </p>
          <Link to="/create">
            <motion.button
              className="btn btn-primary mx-auto gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={16} />
              <span>Create Confession</span>
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home