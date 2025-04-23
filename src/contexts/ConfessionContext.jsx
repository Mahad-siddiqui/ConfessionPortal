import { createContext, useContext, useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const ConfessionContext = createContext()

export const useConfessions = () => useContext(ConfessionContext)

export const ConfessionProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('approved')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Fetch confessions based on filters
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        setLoading(true)
        let confessionsQuery = collection(db, 'confessions')
        
        // Build query based on filters
        const constraints = []
        
        // Status filter
        if (filter !== 'all') {
          constraints.push(where('status', '==', filter))
        }
        
        // Category filter
        if (category !== 'all') {
          constraints.push(where('category', '==', category))
        }
        
        // Sorting
        if (sortBy === 'newest') {
          constraints.push(orderBy('createdAt', 'desc'))
        } else if (sortBy === 'oldest') {
          constraints.push(orderBy('createdAt', 'asc'))
        } else if (sortBy === 'mostLiked') {
          constraints.push(orderBy('likeCount', 'desc'))
        }
        
        // Execute query
        const q = query(confessionsQuery, ...constraints)
        const querySnapshot = await getDocs(q)
        
        const fetchedConfessions = []
        querySnapshot.forEach(doc => {
          fetchedConfessions.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })
        })
        
        setConfessions(fetchedConfessions)
      } catch (error) {
        console.error('Error fetching confessions:', error)
        toast.error('Failed to load confessions')
      } finally {
        setLoading(false)
      }
    }

    fetchConfessions()
  }, [filter, category, sortBy])

  // Create a new confession
  const createConfession = async (confession) => {
    try {
      const newConfession = {
        ...confession,
        status: 'pending',
        likeCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // If user is logged in, add their user ID
      if (currentUser && confession.revealIdentity) {
        newConfession.userId = currentUser.uid
      }
      
      const docRef = await addDoc(collection(db, 'confessions'), newConfession)
      toast.success('Confession submitted for approval!')
      return { id: docRef.id, ...newConfession }
    } catch (error) {
      console.error('Error creating confession:', error)
      toast.error('Failed to submit confession')
      throw error
    }
  }

  // Get a single confession by ID
  const getConfession = async (id) => {
    try {
      const docRef = doc(db, 'confessions', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Confession not found')
      }
    } catch (error) {
      console.error('Error fetching confession:', error)
      toast.error('Failed to load confession')
      throw error
    }
  }

  // Update confession status (for admins)
  const updateConfessionStatus = async (id, status) => {
    try {
      const confessionRef = doc(db, 'confessions', id)
      await updateDoc(confessionRef, { 
        status, 
        updatedAt: serverTimestamp() 
      })
      
      // Update local state
      setConfessions(prevConfessions => 
        prevConfessions.map(confession => 
          confession.id === id ? { ...confession, status } : confession
        )
      )
      
      toast.success(`Confession ${status}`)
      return true
    } catch (error) {
      console.error('Error updating confession status:', error)
      toast.error('Failed to update confession')
      throw error
    }
  }

  // Delete a confession
  const deleteConfession = async (id) => {
    try {
      await deleteDoc(doc(db, 'confessions', id))
      
      // Update local state
      setConfessions(prevConfessions => 
        prevConfessions.filter(confession => confession.id !== id)
      )
      
      toast.success('Confession deleted')
      return true
    } catch (error) {
      console.error('Error deleting confession:', error)
      toast.error('Failed to delete confession')
      throw error
    }
  }

  // React to a confession
  const reactToConfession = async (confessionId, reactionType) => {
    try {
      // Get the confession document
      const confessionRef = doc(db, 'confessions', confessionId)
      const confessionSnap = await getDoc(confessionRef)
      
      if (!confessionSnap.exists()) {
        throw new Error('Confession not found')
      }
      
      const confession = confessionSnap.data()
      
      // Update reactions
      const reactions = confession.reactions || {}
      
      // If user is logged in, track user reactions
      if (currentUser) {
        const userReactionsRef = doc(db, 'userReactions', `${currentUser.uid}_${confessionId}`)
        const userReactionSnap = await getDoc(userReactionsRef)
        
        if (userReactionSnap.exists()) {
          const previousReaction = userReactionSnap.data().type
          
          // If same reaction, remove it (toggle off)
          if (previousReaction === reactionType) {
            await deleteDoc(userReactionsRef)
            reactions[reactionType] = (reactions[reactionType] || 1) - 1
          } else {
            // Change reaction type
            await updateDoc(userReactionsRef, { type: reactionType })
            reactions[previousReaction] = (reactions[previousReaction] || 1) - 1
            reactions[reactionType] = (reactions[reactionType] || 0) + 1
          }
        } else {
          // New reaction
          await setDoc(userReactionsRef, { 
            userId: currentUser.uid,
            confessionId,
            type: reactionType,
            createdAt: serverTimestamp()
          })
          reactions[reactionType] = (reactions[reactionType] || 0) + 1
        }
      } else {
        // Anonymous reaction (simpler implementation)
        reactions[reactionType] = (reactions[reactionType] || 0) + 1
      }
      
      // Update the confession with new reaction counts
      await updateDoc(confessionRef, { 
        reactions,
        likeCount: reactions.like || 0,
        updatedAt: serverTimestamp()
      })
      
      // Update local state
      setConfessions(prevConfessions => 
        prevConfessions.map(c => 
          c.id === confessionId ? { ...c, reactions } : c
        )
      )
      
      return true
    } catch (error) {
      console.error('Error reacting to confession:', error)
      toast.error('Failed to add reaction')
      throw error
    }
  }

  const value = {
    confessions,
    loading,
    filter,
    setFilter,
    category,
    setCategory,
    sortBy,
    setSortBy,
    createConfession,
    getConfession,
    updateConfessionStatus,
    deleteConfession,
    reactToConfession
  }

  return (
    <ConfessionContext.Provider value={value}>
      {children}
    </ConfessionContext.Provider>
  )
}