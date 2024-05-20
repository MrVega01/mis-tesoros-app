import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GlobalContextProvider } from './src/context/global'
import Home from './src/routes/Home'
import ProductFormView from './src/views/ProductForm'

const Stack = createStackNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <StatusBar style='light' />
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='CreateProduct'
            component={ProductFormView}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  )
}
