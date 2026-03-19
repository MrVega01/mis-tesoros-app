import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { GlobalContextProvider } from './src/context/global'
import Home from './src/routes/Home'
import AuthView from './src/views/core/Auth'
import CreateProductView from './src/views/company/CreateProduct'
import CreateCategoryView from './src/views/company/CreateCategory'
import CreateSaleView from './src/views/company/CreateSale'

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
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  )
}
