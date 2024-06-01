import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { ProductForm } from '../components/ProductForm'
import { theme } from '../theme'

export default function CreateProductView () {
  return (
    <View style={styles.container}>
      <ProductForm />
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
