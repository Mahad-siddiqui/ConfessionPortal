import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="mb-4 text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Page Not Found
        </h2>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <motion.button
            className="btn btn-primary mx-auto gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHome size={16} />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound