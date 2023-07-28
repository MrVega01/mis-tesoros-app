import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import ProductList from '../components/ProductList'

export default function ProductsView () {
  return (
    <View style={styles.container}>
      <ProductList tax={0} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight
  }
})
