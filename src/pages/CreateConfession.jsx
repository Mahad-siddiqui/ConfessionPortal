import { motion } from 'framer-motion'
import ConfessionForm from '../components/ConfessionForm'

const CreateConfession = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-2xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Share Your Confession
        </h1>
        <p className="mb-8 text-center text-neutral-600 dark:text-neutral-400">
          Express yourself freely. All confessions are moderated before being published.
        </p>
        
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-neutral-800">
          <ConfessionForm />
        </div>
        
        <div className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-900">
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Guidelines for posting:
          </h3>
          <ul className="ml-4 list-disc space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>Be respectful and considerate of others</li>
            <li>No hate speech, discrimination, or personal attacks</li>
            <li>Do not share personal identifying information of others</li>
            <li>No illegal content or promotion of illegal activities</li>
            <li>No spam or promotional content</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateConfession