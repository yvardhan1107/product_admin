import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser } from '../services/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on initial load
    const savedToken = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse cached user data', e)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const data = await loginUser(username, password)
    // DummyJSON returns: { id, username, email, firstName, lastName, gender, image, accessToken, refreshToken }
    const accessToken = data.accessToken || data.token
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    }

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))

    setToken(accessToken)
    setUser(userData)

    return userData
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
