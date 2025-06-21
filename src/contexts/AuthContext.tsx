import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { api } from '../utils/api'



interface User {
    _id: string
    name: string
    email: string
    isVerified: boolean
    isGoogleUser: boolean
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (user: User) => void
    logout: () => void
    isLoading: boolean
    updateUser: (user: User) => void
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState(true)
    

    useEffect(() => {
        const initAuth = async () => {
           
            try {
                setIsLoading(true)
                const response = await api.get('/auth/me', {
                    withCredentials: true,
                })
                setUser(response.data.data.user);
               
            
            } catch (error) {
               console.error('Error fetching user data:', error)
                // setToken(null)
            } finally { 
                setIsLoading(false)

            }
            
        }

        initAuth()
    }, [])

    const login = (newUser: User) => {
      
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const updateUser = (newUser: User) => {
        setUser(newUser)
    }

    const value = {
        user,
        token,
        login,
        logout,
        isLoading,
        updateUser,
        setUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}