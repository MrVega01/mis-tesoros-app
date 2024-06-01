import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { theme } from '../theme'
import ProductList from '../components/ProductList'

export default function HomeGuest () {
  return (
    <View style={styles.container}>
      <ProductList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20
  }
})
