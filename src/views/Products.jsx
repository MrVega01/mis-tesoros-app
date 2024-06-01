import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import ProductList from '../components/ProductList'
import Header from '../components/Header'
import ExpandTouchable from '../components/ExpandTouchable'

export default function ProductsView ({ navigation }) {
  return (
    <View style={styles.container}>
      <ProductList />
      <Header
        title='Productos'
        rightComponent={
          <ExpandTouchable />
          }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    gap: 12,
    flexDirection: 'column-reverse'
  },
  buttonsContainer: {
    gap: 12
  },
  buttonsFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  }
})
