import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

const AuthLayout = () => {
  const { currentUser } = useAuth()

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="large" />
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout