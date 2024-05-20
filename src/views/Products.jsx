import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import ProductList from '../components/ProductList'
import StyledTouchableHighlight from '../components/StyledTouchableHighlight'

export default function ProductsView ({ navigation }) {
  const handleNavigateToCreateProduct = () => {
    navigation.navigate('CreateProduct')
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsFlex}>
          <StyledTouchableHighlight
            title='Crear Producto'
            onPress={handleNavigateToCreateProduct}
            style={styles.button}
          />
          <StyledTouchableHighlight
            title='Crear Categoria'
            onPress={handleNavigateToCreateProduct}
            style={styles.button}
          />
        </View>
        <StyledTouchableHighlight
          title='Registrar venta'
          onPress={handleNavigateToCreateProduct}
          style={styles.button}
        />
      </View>
      <ProductList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20
  },
  buttonsContainer: {
    gap: 12
  },
  buttonsFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  button: {
  }
})
