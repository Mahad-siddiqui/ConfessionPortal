import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { FiUserPlus, FiAlertCircle } from 'react-icons/fi'

const Register = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    try {
      setError('')
      setLoading(true)
      await register(email, password, displayName)
      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Create an Account
      </h2>
      
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block font-medium text-neutral-700 dark:text-neutral-300">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input mt-1"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium text-neutral-700 dark:text-neutral-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium text-neutral-700 dark:text-neutral-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block font-medium text-neutral-700 dark:text-neutral-300">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input mt-1"
            required
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiUserPlus size={16} />
          {loading ? 'Creating Account...' : 'Create Account'}
        </motion.button>
      </form>
      
      <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          Sign in here
        </Link>
      </div>
    </div>
  )
}

export default Register