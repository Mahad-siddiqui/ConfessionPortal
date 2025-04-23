// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
// import { motion } from 'framer-motion'
// import { 
//   FiMenu, 
//   FiX, 
//   FiUser, 
//   FiLogIn, 
//   FiLogOut, 
//   FiPlus, 
//   FiShield 
// } from 'react-icons/fi'
// import Logo from './Logo'

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const { currentUser, isAdmin, signOut } = useAuth()
//   const navigate = useNavigate()

//   const handleSignOut = async () => {
//     try {
//       await signOut()
//       navigate('/')
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   const toggleMenu = () => setIsOpen(!isOpen)
//   const closeMenu = () => setIsOpen(false)

//   return (
//     <nav className="border-b border-neutral-200 bg-white py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
//       <div className="container flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2">
//           <Logo />
//           <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
//             ConfessHub
//           </span>
//         </Link>

//         {/* Desktop menu */}
//         <div className="hidden items-center gap-6 md:flex">
//           <Link 
//             to="/" 
//             className="font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400"
//           >
//             Home
//           </Link>
//           <Link 
//             to="/create" 
//             className="btn btn-primary flex items-center gap-2"
//           >
//             <FiPlus size={16} />
//             <span>Confess</span>
//           </Link>
          
//           {currentUser ? (
//             <div className="relative group">
//               <button className="flex items-center gap-2 font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400">
//                 <FiUser size={16} />
//                 <span>Account</span>
//               </button>
//               <div className="absolute right-0 mt-2 hidden w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block dark:bg-neutral-800">
//                 {isAdmin && (
//                   <Link 
//                     to="/admin" 
//                     className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                   >
//                     <FiShield size={16} />
//                     <span>Admin Dashboard</span>
//                   </Link>
//                 )}
//                 <button 
//                   onClick={handleSignOut}
//                   className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                 >
//                   <FiLogOut size={16} />
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <Link 
//               to="/login" 
//               className="flex items-center gap-2 font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400"
//             >
//               <FiLogIn size={16} />
//               <span>Login</span>
//             </Link>
//           )}
//         </div>

//         {/* Mobile menu button */}
//         <button 
//           onClick={toggleMenu}
//           className="text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400 md:hidden"
//         >
//           {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.2 }}
//           className="container mt-4 space-y-3 pb-4 md:hidden"
//         >
//           <Link 
//             to="/" 
//             className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//             onClick={closeMenu}
//           >
//             Home
//           </Link>
//           <Link 
//             to="/create" 
//             className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//             onClick={closeMenu}
//           >
//             Create Confession
//           </Link>
          
//           {currentUser ? (
//             <>
//               {isAdmin && (
//                 <Link 
//                   to="/admin" 
//                   className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                   onClick={closeMenu}
//                 >
//                   Admin Dashboard
//                 </Link>
//               )}
//               <button 
//                 onClick={() => {
//                   handleSignOut()
//                   closeMenu()
//                 }}
//                 className="block w-full rounded-md px-4 py-2 text-left font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//               >
//                 Sign Out
//               </button>
//             </>
//           ) : (
//             <Link 
//               to="/login" 
//               className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
//               onClick={closeMenu}
//             >
//               Login
//             </Link>
//           )}
//         </motion.div>
//       )}
//     </nav>
//   )
// }

// export default Navbar

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogIn, 
  FiLogOut, 
  FiPlus, 
  FiShield 
} from 'react-icons/fi'
import Logo from './Logo'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { currentUser, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="border-b border-neutral-200 bg-white py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
            ConfessHub
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-6 md:flex">
          <Link 
            to="/" 
            className="font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <Link 
            to="/create" 
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus size={16} />
            <span>Confess</span>
          </Link>
          
          {currentUser ? (
            <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center gap-2 font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400">
                <FiUser size={16} />
                <span>Account</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800 z-50">
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                      <FiShield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400"
            >
              <FiLogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="text-neutral-700 hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-400 md:hidden"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="container mt-4 space-y-3 pb-4 md:hidden"
        >
          <Link 
            to="/" 
            className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/create" 
            className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
            onClick={closeMenu}
          >
            Create Confession
          </Link>
          
          {currentUser ? (
            <>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={() => {
                  handleSignOut()
                  closeMenu()
                }}
                className="block w-full rounded-md px-4 py-2 text-left font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="block rounded-md px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
