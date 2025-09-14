import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Chargement...</div>

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}