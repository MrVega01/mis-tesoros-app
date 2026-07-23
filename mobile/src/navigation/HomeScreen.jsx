import useAuthState from '../hooks/useAuthState'
import { USER_ROLE } from '../utils/constants'
import SellerTabs from './SellerTabs'
import CustomerTabs from './CustomerTabs'

export default function HomeScreen () {
  const { user } = useAuthState()
  return user?.role === USER_ROLE.SELLER ? <SellerTabs /> : <CustomerTabs />
}
