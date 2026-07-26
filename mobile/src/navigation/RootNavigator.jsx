import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './HomeScreen'
import CreateProductView from '../views/seller/CreateProduct'
import CreateCategoryView from '../views/seller/CreateCategory'
import CreateSaleView from '../views/seller/CreateSale'
import LoginView from '../views/auth/Login'
import SignUpView from '../views/auth/SignUp'
import ForgotPasswordView from '../views/auth/ForgotPassword'
import VerifyCodeView from '../views/auth/VerifyCode'
import VerifySellerView from '../views/auth/VerifySeller'
import ResetPasswordView from '../views/auth/ResetPassword'
import FillSellerDataView from '../views/auth/FillSellerData'
import FillCustomerDataView from '../views/auth/FillCustomerData'
import OnboardingView from '../views/auth/Onboarding'
import BootSplash from '../components/BootSplash'
import useAuthState from '../hooks/useAuthState'
import useAuthSession from '../hooks/useAuthSession'
import useOnboarding from '../hooks/useOnboarding'
import { useTaxSync } from '../hooks/useTax'
import { useEffect } from 'react'
import { STATUS } from '../utils/authConstants'

const Stack = createStackNavigator()

function resolveInitialRoute (status, hasSeenOnboarding) {
  if (status === STATUS.AUTHENTICATED) return 'Home'
  if (!hasSeenOnboarding) return 'Onboarding'
  return 'LogIn'
}

export default function RootNavigator () {
  const { status } = useAuthState()
  const { restoreSession } = useAuthSession()
  const { hasSeenOnboarding } = useOnboarding()

  useTaxSync()

  useEffect(() => {
    restoreSession()
  }, [])

  if (status === STATUS.LOADING || hasSeenOnboarding === null) return <BootSplash />

  return (
    <Stack.Navigator initialRouteName={resolveInitialRoute(status, hasSeenOnboarding)}>
      <Stack.Screen name='Onboarding' component={OnboardingView} options={{ headerShown: false }} />
      <Stack.Screen name='LogIn' component={LoginView} options={{ headerShown: false }} />
      <Stack.Screen name='SignUp' component={SignUpView} options={{ headerShown: false }} />
      <Stack.Screen name='VerifySeller' component={VerifySellerView} options={{ headerShown: false }} />
      <Stack.Screen name='ForgotPassword' component={ForgotPasswordView} options={{ headerShown: false }} />
      <Stack.Screen name='VerifyCode' component={VerifyCodeView} options={{ headerShown: false }} />
      <Stack.Screen name='ResetPassword' component={ResetPasswordView} options={{ headerShown: false }} />
      <Stack.Screen name='FillSellerData' component={FillSellerDataView} options={{ headerShown: false }} />
      <Stack.Screen name='FillCustomerData' component={FillCustomerDataView} options={{ headerShown: false }} />
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Create Product' component={CreateProductView} options={{ headerShown: false }} />
      <Stack.Screen name='Create Category' component={CreateCategoryView} options={{ headerShown: false }} />
      <Stack.Screen name='Create Sale' component={CreateSaleView} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
