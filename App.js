import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GlobalContextProvider } from './src/context/global'
import Home from './src/routes/Home'
import CreateProductView from './src/views/company/CreateProduct'
import CreateCategoryView from './src/views/company/CreateCategory'
import CreateSaleView from './src/views/company/CreateSale'
import LoginView from './src/views/auth/Login'
import SignUpView from './src/views/auth/SignUp'
import ForgotPasswordView from './src/views/auth/ForgotPassword'
import VerifyCodeView from './src/views/auth/VerifyCode'
import { useI18n } from './src/hooks/useI18n'

const Stack = createStackNavigator()

export default function App () {
  useI18n()

  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <StatusBar style='light' />
        <Stack.Navigator>
          <Stack.Screen
            name='LogIn'
            component={LoginView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SignUp'
            component={SignUpView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ForgotPassword'
            component={ForgotPasswordView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='VerifyCode'
            component={VerifyCodeView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Create Product'
            component={CreateProductView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Create Category'
            component={CreateCategoryView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Create Sale'
            component={CreateSaleView}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  )
}
