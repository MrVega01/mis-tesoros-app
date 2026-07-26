import { View, StyleSheet, TouchableHighlight } from 'react-native'
import StyledText from './StyledText'
import { theme } from '../theme'

export function Product ({ product, tax, onLongPress }) {
  const { name, price, category, quantity } = product

  return (
    <TouchableHighlight onLongPress={() => { onLongPress && onLongPress(product) }}>
      <View style={styles.container}>
        <View style={styles.textBox}>
          <StyledText size='title'>{name}</StyledText>
          {category?.name ? <StyledText size='sub' style={styles.description}>{category.name}</StyledText> : null}
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
