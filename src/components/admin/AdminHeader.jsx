import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiLogOut } from 'react-icons/fi'

const AdminHeader = () => {
  const { currentUser, signOut } = useAuth()
  
  return (
    <header className="border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Administrator Dashboard
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              <FiUser size={16} />
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {currentUser?.displayName || currentUser?.email || 'Admin'}
            </span>
          </div>
          
          <button 
            onClick={signOut}
            className="flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
          >
            <FiLogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader