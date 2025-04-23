import { FiMessageCircle } from 'react-icons/fi'

const Logo = ({ size = 'default' }) => {
  const sizeClass = 
    size === 'small' ? 'w-8 h-8' : 
    size === 'large' ? 'w-12 h-12' : 
    'w-10 h-10'

  return (
    <div className={`flex items-center justify-center rounded-full bg-primary-600 ${sizeClass}`}>
      <FiMessageCircle className="text-white" size={size === 'large' ? 24 : 20} />
    </div>
  )
}

export default Logo