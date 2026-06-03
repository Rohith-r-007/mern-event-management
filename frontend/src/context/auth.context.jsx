import React from 'react'
import api from '../utils/axios'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    
    React.useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token')
            if (!storedToken) {
                setLoading(false)
                return
            }

            try {
                const { data } = await api.get('/auth/me')
                const userData = data.user
                setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))
            } catch (error) {
                console.error('Session restore failed:', error)
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])


    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password })
            const userData = data.user || data
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            if (userData.token) localStorage.setItem('token', userData.token)
            return userData
        } catch (error) {
            console.error('Register failed:', error)
            throw error
        }
    }
    
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })
            const userData = data.user || data
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            if (userData.token) localStorage.setItem('token', userData.token)
            return userData

        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }
    
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp })
            const userData = data.user || data
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            if (userData.token) localStorage.setItem('token', userData.token)
            return userData
        } catch (error) {
            console.error('Verify OTP failed:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }
    
    return (
        // this acts like a storage that holds data and is accessible throughout the app
        <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}