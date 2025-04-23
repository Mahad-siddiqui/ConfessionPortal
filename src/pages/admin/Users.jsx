import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { 
  FiSearch, 
  FiUserX, 
  FiUserCheck, 
  FiTrash2, 
  FiShield,
  FiUser
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const usersList = []
        
        usersSnapshot.forEach(doc => {
          usersList.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        setUsers(usersList)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole })
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
      
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId))
        
        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
        
        toast.success('User deleted successfully')
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (searchTerm === '') return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      (user.displayName && user.displayName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Manage Users
      </h1>
      
      <div className="mb-6 flex justify-end">
        <div className="relative max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-neutral-500" size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="input pl-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="my-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md dark:bg-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                    {user.displayName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role || 'student'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          className="rounded-full p-1.5 text-neutral-600 hover:bg-purple-100 hover:text-purple-600 dark:text-neutral-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
                          title="Make Admin"
                        >
                          <FiShield size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user.id, 'student')}
                          className="rounded-full p-1.5 text-neutral-600 hover:bg-blue-100 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                          title="Make Student"
                        >
                          <FiUser size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-full p-1.5 text-neutral-600 hover:bg-red-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Delete User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">
            No users found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminUsers