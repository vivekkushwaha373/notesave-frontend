import { Navigate } from 'react-router-dom'
import { AuthContext, useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import { useContext } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
   const auth = useContext(AuthContext);
   
       if (!auth) {
           throw new Error("AuthContext not found. Did you forget to wrap your component in <AuthProvider>?");
       }
   
       const { user, isLoading } = auth;

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/signin" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute