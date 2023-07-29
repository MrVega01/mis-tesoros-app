import { View, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import StyledText from './StyledText'
import { theme } from '../theme'
import { useDeleteProduct } from '../hooks/useDeleteProduct'

export function Product ({ product, tax }) {
  const { id, name, price, type, quantity } = product
  const { deleteProduct } = useDeleteProduct()
  const longPressHandler = () => {
    Alert.alert('Eliminar producto', `El producto "${name}" será eliminado`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => deleteProduct(id)
      }
    ])
  }

  return (
    <TouchableHighlight onLongPress={longPressHandler}>
      <View style={styles.container}>
        <View style={styles.textBox}>
          <StyledText size='title'>{name}</StyledText>
          {type !== null && <StyledText size='sub' style={styles.description}>{type}</StyledText>}
          {quantity !== null && <StyledText size='sub' style={styles.description}>{quantity} unidades</StyledText>}
        </View>
        <View style={styles.textBox}>
          <StyledText size='sub'>Precio en dolares</StyledText>
          <StyledText size='subheading'>{price.toFixed(2)}$</StyledText>
        </View>
        <View style={styles.textBox}>
          <StyledText size='sub'>Precio en bolívares</StyledText>
          <StyledText size='subheading'>{(price * tax).toFixed(2)}bs</StyledText>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: theme.colors.secondary,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 5
  },
  textBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold
  },
  description: {
    color: theme.appBar.primary
  }
})
