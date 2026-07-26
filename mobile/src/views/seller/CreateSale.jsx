import { FlatList, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../../theme'
import ProductSaleList from '../../components/ProductSaleList'
import { useMemo, useState } from 'react'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledText from '../../components/StyledText'
import { useTaxRate } from '../../hooks/useTax'
import useProducts, { useRegisterSale } from '../../hooks/useProducts'

export default function CreateSaleView ({ navigation }) {
  const [quantityList, setQuantityList] = useState({})
  const { data: products } = useProducts()
  const registerSale = useRegisterSale()
  const tax = useTaxRate()

  const handleChangeQuantity = (productWithQuantity) => {
    setQuantityList(prev => ({
      ...prev,
      [productWithQuantity.id]: productWithQuantity
    }))
  }
  const handleRegisterSale = async () => {
    // The stored entries carry the sold amount, so the current stock has to be
    // read back from the products cache to send the NEW absolute level.
    const soldItems = Object.entries(quantityList)
      .filter(([, product]) => product.quantity > 0)
      .map(([id, product]) => {
        const stored = (products ?? []).find(item => item.id === id)
        if (!stored) return null
        return { id, quantity: stored.quantity - product.quantity }
      })
      .filter(Boolean)
    if (!soldItems.length) return

    try {
      await registerSale.mutateAsync(soldItems)
      navigation.goBack()
    } catch {}
  }
  const totalCount = useMemo(() => {
    return Object.entries(quantityList).reduce((prev, curr) => {
      const currentPrice = curr[1] ? curr[1].quantity * curr[1].price : 0
      return prev + currentPrice
    }, 0)
  }, [quantityList])

  return (
    <View style={styles.container}>
      <ProductSaleList
        quantityList={quantityList}
        setQuantityList={handleChangeQuantity}
      />
      <View style={styles.containerInfo}>
        <View style={styles.containerInvoice}>
          <FlatList
            data={Object.entries(quantityList)}
            renderItem={({ item }) => {
              const [id, product] = item
              const { quantity, price, name } = product
              return (
                <StyledText
                  key={id}
                  color='primary'
                  size='subheading'
                >
                  - {quantity} x {name}: {(price * quantity * tax).toFixed(2)}bs
                </StyledText>
              )
            }}
            keyExtractor={item => item[0]}
          />
        </View>
        <View style={styles.containerTotal}>
          <View>
            <StyledText size='subheading'>Total:</StyledText>
            <StyledText size='title' bold>{(totalCount * tax).toFixed(2)}bs</StyledText>
          </View>
          <StyledTouchableHighlight
            title='Registrar'
            onPress={handleRegisterSale}
            disabled={registerSale.isPending}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20
  },
  containerInfo: {
    alignItems: 'center',
    maxHeight: '50%',
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.white}3f`,
    padding: 12,
    flexDirection: 'row'
  },
  containerInvoice: {
    flex: 3
  },
  containerTotal: {
    flex: 2,
    gap: 12
  }
})
