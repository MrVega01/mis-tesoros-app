import { CommonActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'
import { theme } from '../theme'
import MoneySVG from '../img/Money'
import StoreSVG from '../img/Store'
import SettingsSVG from '../img/Settings'
import MessageSVG from '../img/Message'
import { StyleSheet } from 'react-native'
import { BottomNavigation } from 'react-native-paper'
import ProductsView from '../views/seller/Products'
import Messages from '../views/core/Messages'
import ShopOptionsView from '../views/seller/ShopOptions'
import Settings from '../views/core/Settings'

const Tab = createBottomTabNavigator()

export default function SellerTabs () {
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          activeColor={theme.appBar.primary}
          inactiveColor={theme.appBar.textPrimary}
          style={barStyles.bar}
          theme={{ colors: { secondaryContainer: `${theme.appBar.primary}5f` } }}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (event.defaultPrevented) {
              preventDefault()
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key
              })
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key]
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 })
            }

            return null
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.title

            return label
          }}
        />
      )}
    >
      <Tab.Screen
        name='Productos'
        component={ProductsView}
        options={{
          headerShown: false,
          tabBarLabel: t('tabs.products'),
          tabBarIcon: ({ color }) => (
            <StoreSVG color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Opciones'
        component={ShopOptionsView}
        options={{
          headerShown: false,
          tabBarLabel: t('tabs.shopOptions'),
          tabBarIcon: ({ color }) => (
            <MoneySVG color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Mensajes'
        component={Messages}
        options={{
          headerShown: false,
          tabBarLabel: t('tabs.messages'),
          tabBarIcon: ({ color }) => (
            <MessageSVG color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Cuenta'
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: t('account.tabLabel'),
          tabBarIcon: ({ color }) => (
            <SettingsSVG color={color} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

const barStyles = StyleSheet.create({
  bar: {
    backgroundColor: theme.appBar.secondary,
    borderTopWidth: 1,
    borderColor: `${theme.colors.white}1f`
  }
})
