import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiMessageSquare, FiUsers } from 'react-icons/fi'
import Logo from '../Logo'

const menuItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: <FiHome size={18} />
  },
  {
    path: '/admin/confessions',
    label: 'Confessions',
    icon: <FiMessageSquare size={18} />
  },
  {
    path: '/admin/users',
    label: 'Users',
    icon: <FiUsers size={18} />
  }
]

const AdminSidebar = () => {
  const location = useLocation()

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800">
      <div className="flex items-center gap-3 p-6">
        <Logo />
        <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-neutral-200 p-4 dark:border-neutral-700">
        <Link 
          to="/"
          className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <span>← Back to site</span>
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar