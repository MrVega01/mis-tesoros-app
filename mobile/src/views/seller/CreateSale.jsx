import { FlatList, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../../theme'
import ProductSaleList from '../../components/ProductSaleList'
import { useMemo, useState } from 'react'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledText from '../../components/StyledText'
import { useTranslation } from 'react-i18next'
import { useTaxRate } from '../../hooks/useTax'
import { useCreateSale } from '../../hooks/useSales'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { SHOP_ERROR_KEYS } from '../../utils/constants'

export default function CreateSaleView ({ navigation }) {
  const [quantityList, setQuantityList] = useState({})
  const { t } = useTranslation()
  const createSale = useCreateSale()
  const tax = useTaxRate()

  const handleChangeQuantity = (productWithQuantity) => {
    setQuantityList(prev => ({
      ...prev,
      [productWithQuantity.id]: productWithQuantity
    }))
  }
  const handleRegisterSale = async () => {
    // Sold amounts, not stock levels: the server does the arithmetic and the
    // stock check in one transaction.
    const items = Object.entries(quantityList)
      .filter(([, product]) => product.quantity > 0)
      .map(([productId, product]) => ({ productId, quantity: product.quantity }))
    if (!items.length) return

    try {
      await createSale.mutateAsync(items)
      navigation.goBack()
    } catch {}
  }
  const totalCount = useMemo(() => {
    return Object.entries(quantityList).reduce((prev, curr) => {
      const currentPrice = curr[1] ? curr[1].quantity * curr[1].price : 0
      return prev + currentPrice
    }, 0)
  }, [quantityList])

  const errorMessage = resolveErrorMessage(
    createSale.error,
    t,
    SHOP_ERROR_KEYS.createSale
  )

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
          {errorMessage
            ? <StyledText size='sub' style={styles.error}>{errorMessage}</StyledText>
            : null}
          <StyledTouchableHighlight
            title='Registrar'
            onPress={handleRegisterSale}
            disabled={createSale.isPending}
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
  },
  error: {
    color: theme.colors.danger
  }
})
