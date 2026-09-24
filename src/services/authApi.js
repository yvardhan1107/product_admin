import apiClient from '../lib/axios'

export const loginUser = async (username, password) => {
  const { data } = await apiClient.post('/auth/login', {
    username,
    password,
  })
  return data
}
