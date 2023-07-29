import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ProductsView from './src/views/Products'
import { theme } from './src/theme'
import TaxView from './src/views/Tax'
import ProductFormView from './src/views/ProductForm'
import { GlobalContextProvider } from './src/context/global'
import AddSVG from './src/img/Add'
import MoneySVG from './src/img/Money'
import StoreSVG from './src/img/Store'

const Tab = createMaterialBottomTabNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <StatusBar style='light' />
        <Tab.Navigator
          barStyle={barStyles}
          activeColor={theme.appBar.textPrimary}
          inactiveColor={theme.appBar.textSecondary}
        >
          <Tab.Screen
            name='Productos'
            component={ProductsView}
            options={{
              tabBarIcon: ({ color }) => (
                <StoreSVG color={color} />
              )
            }}
          />
          <Tab.Screen
            name='Tasa'
            component={TaxView}
            options={{
              tabBarIcon: ({ color }) => (
                <MoneySVG color={color} />
              )
            }}
          />
          <Tab.Screen
            name='Crear producto'
            component={ProductFormView}
            options={{
              tabBarIcon: ({ color }) => (
                <AddSVG color={color} />
              )
            }}
          />
        </Tab.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  )
}

const barStyles = {
  backgroundColor: theme.appBar.primary
}
