import { useContext } from 'react'
import { Alert, FlatList } from 'react-native'
import { Product } from './Product'
import useProducts from '../hooks/useProducts'
import StyledText from './StyledText'
import { GlobalContext } from '../context/global'
import { useIsFocused } from '@react-navigation/native'
import { useDeleteProduct } from '../hooks/useDeleteProduct'

export default function ProductList () {
  const { state } = useContext(GlobalContext)
  const { tax } = state
  const focused = useIsFocused()
  const { products, loading, refresh } = useProducts([focused])
  const { deleteProduct } = useDeleteProduct()

  const longPressHandler = (product) => {
    const { id, name } = product
    Alert.alert('Eliminar producto', `El producto "${name}" será eliminado`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          deleteProduct(id)
          refresh()
        }
      }
    ])
  }
  return (
    <>
      {
        loading
          ? (<FlatList
              data={products}
              renderItem={({ item }) => (
                <Product
                  product={item}
                  tax={tax}
                  onLongPress={longPressHandler}
                />
              )}
              keyExtractor={item => item.id}
             />)
          : <StyledText>Loading...</StyledText>
      }
    </>
  )
}
