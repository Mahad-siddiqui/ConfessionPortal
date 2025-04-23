import { useState } from 'react'
import { motion } from 'framer-motion'
import { useConfessions } from '../../contexts/ConfessionContext'
import {
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiTrash2,
  FiEye,
  FiSearch
} from 'react-icons/fi'

const AdminConfessions = () => {
  const { 
    confessions, 
    loading, 
    updateConfessionStatus, 
    deleteConfession, 
    filter, 
    setFilter 
  } = useConfessions()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConfession, setSelectedConfession] = useState(null)

  // Filter options
  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' }
  ]

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateConfessionStatus(id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Handle deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this confession? This action cannot be undone.')) {
      try {
        await deleteConfession(id)
        
        // Close modal if the deleted confession was being viewed
        if (selectedConfession && selectedConfession.id === id) {
          setSelectedConfession(null)
        }
      } catch (error) {
        console.error('Error deleting confession:', error)
      }
    }
  }

  // Filter and search
  const filteredConfessions = confessions.filter(confession => {
    // Apply status filter
    if (filter !== 'all' && confession.status !== filter) {
      return false
    }
    
    // Apply search
    if (searchTerm.trim() !== '') {
      return confession.content.toLowerCase().includes(searchTerm.toLowerCase())
    }
    
    return true
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Manage Confessions
      </h1>
      
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FiFilter size={16} className="text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Status:
          </span>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((statusFilter) => (
              <button
                key={statusFilter.id}
                onClick={() => setFilter(statusFilter.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  filter === statusFilter.id
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                }`}
              >
                {statusFilter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative flex-1 sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-neutral-500" size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search confessions..."
            className="input pl-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="my-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
        </div>
      ) : filteredConfessions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md dark:bg-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
              <tr>
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredConfessions.map((confession) => (
                <tr key={confession.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                  <td className="px-6 py-4">
                    <div className="line-clamp-2 max-w-xs">
                      {confession.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold capitalize text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                      {confession.category || 'other'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      confession.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      confession.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {confession.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                    {new Date(confession.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedConfession(confession)}
                        className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-primary-400"
                        title="View"
                      >
                        <FiEye size={16} />
                      </button>
                      
                      {confession.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(confession.id, 'approved')}
                          className="rounded-full p-1.5 text-neutral-600 hover:bg-green-100 hover:text-green-600 dark:text-neutral-400 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                          title="Approve"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      )}
                      
                      {confession.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(confession.id, 'rejected')}
                          className="rounded-full p-1.5 text-neutral-600 hover:bg-red-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Reject"
                        >
                          <FiXCircle size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(confession.id)}
                        className="rounded-full p-1.5 text-neutral-600 hover:bg-red-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Delete"
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
            No confessions found matching your criteria.
          </p>
        </div>
      )}
      
      {/* Confession Detail Modal */}
      {selectedConfession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Confession Details
              </h3>
              <button
                onClick={() => setSelectedConfession(null)}
                className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
              >
                <FiXCircle size={20} />
              </button>
            </div>
            
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Category</p>
                <p className="font-medium capitalize text-neutral-900 dark:text-neutral-100">
                  {selectedConfession.category || 'Other'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Status</p>
                <p className={`font-medium ${
                  selectedConfession.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                  selectedConfession.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {selectedConfession.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Date</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {new Date(selectedConfession.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mb-4 rounded-md bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="whitespace-pre-line text-neutral-800 dark:text-neutral-200">
                {selectedConfession.content}
              </p>
            </div>
            
            {selectedConfession.revealIdentity && selectedConfession.displayName && (
              <div className="mb-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Posted by</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedConfession.displayName}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              {selectedConfession.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedConfession.id, 'approved')
                    setSelectedConfession(null)
                  }}
                  className="btn bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500"
                >
                  Approve
                </button>
              )}
              
              {selectedConfession.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedConfession.id, 'rejected')
                    setSelectedConfession(null)
                  }}
                  className="btn bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
                >
                  Reject
                </button>
              )}
              
              <button
                onClick={() => {
                  handleDelete(selectedConfession.id)
                  setSelectedConfession(null)
                }}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminConfessions