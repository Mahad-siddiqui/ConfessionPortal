import { createContext, useContext, useState, useCallback } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is authenticated and if they're an admin
  const checkAuthState = useCallback(() => {
    setLoading(true)
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true)
          } else {
            setIsAdmin(false)
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      } else {
        setCurrentUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
  }, [])

  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      setLoading(true)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Check if this is the first user
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const isFirstUser = usersSnapshot.empty
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        role: isFirstUser ? 'admin' : 'student', // Make first user admin
        createdAt: new Date().toISOString()
      })
      
      toast.success('Account created successfully!')
      if (isFirstUser) {
        toast.success('You have been granted admin privileges!')
      }
      return user
    } catch (error) {
      console.error('Error during registration:', error)
      let errorMessage = 'Failed to create account'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please try logging in instead.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.'
          break
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.'
          break
        default:
          errorMessage = error.message || errorMessage
      }
      
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login successful!')
      return user
    } catch (error) {
      console.error('Error during login:', error)
      let errorMessage = 'Failed to log in'
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.'
          break
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please register first.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.'
          break
        default:
          errorMessage = error.message || errorMessage
      }
      
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error(error.message || 'Failed to log out')
      throw error
    }
  }

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    signOut,
    checkAuthState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}