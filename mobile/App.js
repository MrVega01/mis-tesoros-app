import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './src/utils/queryClient'
import Home from './src/routes/Home'
import CreateProductView from './src/views/company/CreateProduct'
import CreateCategoryView from './src/views/company/CreateCategory'
import CreateSaleView from './src/views/company/CreateSale'
import LoginView from './src/views/auth/Login'
import SignUpView from './src/views/auth/SignUp'
import ForgotPasswordView from './src/views/auth/ForgotPassword'
import VerifyCodeView from './src/views/auth/VerifyCode'
import VerifySellerView from './src/views/auth/VerifySeller'
import ResetPasswordView from './src/views/auth/ResetPassword'
import FillSellerDataView from './src/views/auth/FillSellerData'
import FillCustomerDataView from './src/views/auth/FillCustomerData'
import OnboardingView from './src/views/auth/Onboarding'
import BootSplash from './src/components/BootSplash'
import { useI18n } from './src/hooks/useI18n'
import useAuthState from './src/hooks/useAuthState'
import useAuthSession from './src/hooks/useAuthSession'
import useOnboarding from './src/hooks/useOnboarding'
import { useTaxHydration } from './src/hooks/useTax'
import { useEffect } from 'react'
import { STATUS } from './src/utils/authConstants'

const Stack = createStackNavigator()

function resolveInitialRoute (status, hasSeenOnboarding) {
  if (status === STATUS.AUTHENTICATED) return 'Home'
  if (!hasSeenOnboarding) return 'Onboarding'
  return 'LogIn'
}

function RootNavigator () {
  const { status } = useAuthState()
  const { restoreSession } = useAuthSession()
  const { hasSeenOnboarding } = useOnboarding()

  useTaxHydration()

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
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      <Stack.Screen name='Create Product' component={CreateProductView} options={{ headerShown: false }} />
      <Stack.Screen name='Create Category' component={CreateCategoryView} options={{ headerShown: false }} />
      <Stack.Screen name='Create Sale' component={CreateSaleView} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default function App () {
  useI18n()

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style='light' />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  )
}
