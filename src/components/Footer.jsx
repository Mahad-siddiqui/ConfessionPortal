import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo size="small" />
              <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                ConfessHub
              </span>
            </Link>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              A safe space for anonymous confessions and sharing thoughts with your campus community.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                  Create Confession
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Community Guidelines</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Be respectful, honest, and kind. Hate speech, harassment, and illegal content are strictly prohibited and will be removed.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6 text-center dark:border-neutral-700">
          <p className="flex items-center justify-center gap-1 text-neutral-600 dark:text-neutral-400">
            Made with <FiHeart className="text-red-500" /> for campus communities
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} ConfessHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer