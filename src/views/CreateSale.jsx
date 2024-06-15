import { FlatList, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import ProductSaleList from '../components/ProductSaleList'
import { useContext, useMemo, useState } from 'react'
import StyledTouchableHighlight from '../components/StyledTouchableHighlight'
import StyledText from '../components/StyledText'
import { GlobalContext } from '../context/global'
import { useIsFocused } from '@react-navigation/native'
import useProducts from '../hooks/useProducts'
import useUpdateProduct from '../hooks/useUpdateProduct'

export default function CreateSaleView ({ navigation }) {
  const [quantityList, setQuantityList] = useState({})
  const focused = useIsFocused()
  const products = useProducts([focused])
  const { registerProductSale } = useUpdateProduct()
  const { state } = useContext(GlobalContext)
  const { tax } = state

  const handleChangeQuantity = (productWithQuantity) => {
    setQuantityList(prev => ({
      ...prev,
      [productWithQuantity.id]: productWithQuantity
    }))
  }
  const handleRegisterSale = () => {
    const productsQuantity = Object.entries(quantityList)
    if (!productsQuantity.length) return

    registerProductSale(productsQuantity.map(([id, product]) => {
      const previousQuantity = products.products.find(product => product.id === Number(id)).quantity

      return {
        id,
        quantity: previousQuantity - product.quantity
      }
    })).then(response => response.ok && navigation.goBack())
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
        useProducts={products}
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
