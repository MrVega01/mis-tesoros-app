import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ProductsView from './src/views/Products'
import { theme } from './src/theme'
import TaxView from './src/views/Tax'
import ProductFormView from './src/views/ProductForm'

const Tab = createMaterialBottomTabNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <StatusBar style='light' />
      <Tab.Navigator
        barStyle={barStyles}
        activeColor={theme.appBar.textPrimary}
        inactiveColor={theme.appBar.textSecondary}
      >
        <Tab.Screen
          name='Productos'
          component={ProductsView}
        />
        <Tab.Screen
          name='Tasa'
          component={TaxView}
        />
        <Tab.Screen
          name='Crear producto'
          component={ProductFormView}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const barStyles = {
  backgroundColor: theme.appBar.primary
}
