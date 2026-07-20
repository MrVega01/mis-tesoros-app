import { create } from 'zustand'
import { STATUS } from '../utils/authConstants'

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  status: STATUS.LOADING,

  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  clearState: () => set({ accessToken: null, refreshToken: null, user: null, status: STATUS.UNAUTHENTICATED })
}))

export default useAuthStore
