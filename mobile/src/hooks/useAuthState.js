import useAuthStore from '../stores/authStore'

export default function useAuthState () {
  const status = useAuthStore(state => state.status)
  const user = useAuthStore(state => state.user)
  const accessToken = useAuthStore(state => state.accessToken)
  return { status, user, accessToken }
}
