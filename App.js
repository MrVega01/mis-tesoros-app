import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GlobalContextProvider } from './src/context/global'
import Home from './src/routes/Home'
import CreateProductView from './src/views/CreateProduct'
import CreateCategoryView from './src/views/CreateCategory'
import CreateSaleView from './src/views/CreateSale'
import HomeGuest from './src/views/HomeGuest'
import AuthView from './src/views/Auth'

const Stack = createStackNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <StatusBar style='light' />
        <Stack.Navigator>
          <Stack.Screen
            name='Auth'
            component={AuthView}
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
          <Stack.Screen
            name='Home Guest'
            component={HomeGuest}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  )
}
