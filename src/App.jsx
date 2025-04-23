import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateConfession from './pages/CreateConfession'
import ConfessionDetails from './pages/ConfessionDetails'
import AdminDashboard from './pages/admin/Dashboard'
import AdminConfessions from './pages/admin/Confessions'
import AdminUsers from './pages/admin/Users'
import NotFound from './pages/NotFound'

// Guards
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth()
  return currentUser && isAdmin ? children : <Navigate to="/" />
}

function App() {
  const { checkAuthState } = useAuth()

  useEffect(() => {
    checkAuthState()
  }, [checkAuthState])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="confession/:id" element={<ConfessionDetails />} />
        <Route path="create" element={<CreateConfession />} />
      </Route>

      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="confessions" element={<AdminConfessions />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App