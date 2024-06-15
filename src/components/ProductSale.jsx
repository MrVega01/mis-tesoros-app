import { View, StyleSheet, TouchableHighlight } from 'react-native'
import StyledText from './StyledText'
import { theme } from '../theme'
import { Product } from './Product'

export function ProductSale ({ product, tax, quantity, setQuantity }) {
  const handleIncrementQuantity = () => {
    setQuantity(quantity < product.quantity ? quantity + 1 : quantity)
  }
  const handleDecrementQuantity = () => {
    setQuantity(Math.abs(quantity - 1) === (quantity - 1) ? quantity - 1 : quantity)
  }
  return (
    <View style={styles.container}>
      <Product
        product={product}
        tax={tax}
      />
      <View style={styles.containerQuantity}>
        <StyledText style={{ flex: 2 }} size='subheading'>Cantidad: {quantity}</StyledText>
        <View style={styles.quantityButtonsContainer}>
          <TouchableHighlight
            style={styles.quantityButtons}
            onPress={handleDecrementQuantity}
          >
            <View>
              <StyledText size='subheading' bold>-</StyledText>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.quantityButtons}
            onPress={handleIncrementQuantity}
          >
            <View>
              <StyledText size='subheading' bold>+</StyledText>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: `${theme.colors.white}3f`,
    marginHorizontal: 10
  },
  containerQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.white}3f`
  },
  quantityButtonsContainer: {
    flexDirection: 'row',
    flex: 1
  },
  quantityButtons: {
    padding: 12,
    width: '50%',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: `${theme.colors.white}3f`
  }
})
