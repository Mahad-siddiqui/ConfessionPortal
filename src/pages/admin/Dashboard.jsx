import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiMessageSquare, 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock 
} from 'react-icons/fi'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalConfessions: 0,
    pendingConfessions: 0,
    approvedConfessions: 0,
    rejectedConfessions: 0,
    totalUsers: 0
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching stats from database
    const fetchStats = () => {
      setLoading(true)
      
      // In a real app, this would be an API/firestore call
      setTimeout(() => {
        setStats({
          totalConfessions: 156,
          pendingConfessions: 12,
          approvedConfessions: 127,
          rejectedConfessions: 17,
          totalUsers: 78
        })
        setLoading(false)
      }, 1000)
    }
    
    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Confessions',
      value: stats.totalConfessions,
      icon: <FiMessageSquare size={24} className="text-primary-500" />,
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-700 dark:text-primary-300'
    },
    {
      title: 'Pending Confessions',
      value: stats.pendingConfessions,
      icon: <FiClock size={24} className="text-yellow-500" />,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    {
      title: 'Approved Confessions',
      value: stats.approvedConfessions,
      icon: <FiCheckCircle size={24} className="text-green-500" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      title: 'Rejected Confessions',
      value: stats.rejectedConfessions,
      icon: <FiXCircle size={24} className="text-red-500" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers size={24} className="text-blue-500" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300'
    }
  ]

  if (loading) {
    return (
      <div className="my-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Admin Dashboard
      </h1>
      
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-lg ${card.bgColor} p-6 shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {card.title}
                </p>
                <h3 className={`mt-2 text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </h3>
              </div>
              <div className="rounded-full bg-white p-3 shadow-sm dark:bg-neutral-800">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 dark:border-neutral-700">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  index % 3 === 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  index % 3 === 1 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {index % 3 === 0 ? <FiCheckCircle size={18} /> : 
                   index % 3 === 1 ? <FiClock size={18} /> : 
                   <FiXCircle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {index % 3 === 0 ? 'Confession approved' : 
                     index % 3 === 1 ? 'New confession submitted' : 
                     'Confession rejected'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {index % 3 === 0 ? '2 hours ago' : 
                     index % 3 === 1 ? '3 hours ago' : 
                     '4 hours ago'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Popular Categories
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Funny', count: 45, percentage: 35 },
              { name: 'Venting', count: 35, percentage: 28 },
              { name: 'Serious', count: 20, percentage: 16 },
              { name: 'Appreciation', count: 15, percentage: 12 },
              { name: 'Question', count: 10, percentage: 8 }
            ].map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {category.name}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.count} confessions ({category.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div 
                    className="h-full rounded-full bg-primary-500 dark:bg-primary-600" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard