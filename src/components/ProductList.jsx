import { useContext, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { Product } from './Product'
import useProducts from '../hooks/useProducts'
import StyledText from './StyledText'
import { GlobalContext } from '../context/global'
import { useIsFocused } from '@react-navigation/native'
import { useDeleteProduct } from '../hooks/useDeleteProduct'
import Dialog from 'react-native-dialog'
import useUpdateProduct from '../hooks/useUpdateProduct'

export default function ProductList () {
  const [productToRestock, setProductToRestock] = useState(null)
  const [newQuantity, setNewQuantity] = useState()
  const { state } = useContext(GlobalContext)
  const { tax } = state
  const focused = useIsFocused()
  const { products, loading, refresh } = useProducts([focused])
  const { updateProduct } = useUpdateProduct()
  const { deleteProduct } = useDeleteProduct()

  const longPressHandler = (product) => {
    const { id, name } = product
    Alert.alert('Eliminar producto', `El producto "${name}" será eliminado`, [
      {
        text: 'Reabastecer',
        onPress: () => {
          setProductToRestock(product)
        }
      },
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
  const cancelRestockHandler = () => {
    setProductToRestock(null)
    setNewQuantity(undefined)
  }
  const restockHandler = () => {
    updateProduct({ ...productToRestock, quantity: newQuantity }).then(() => {
      setProductToRestock(null)
      setNewQuantity(undefined)
      refresh()
    })
  }
  return (
    <>
      <Dialog.Container visible={!!productToRestock}>
        <Dialog.Title>Reabastecer inventario</Dialog.Title>
        <Dialog.Description>
          Actualmente el producto "{productToRestock?.name}" posee {productToRestock?.quantity} unidades.
        </Dialog.Description>
        <Dialog.Input
          keyboardType='numeric'
          value={newQuantity}
          label='Ingrese la nueva cantidad'
          onChangeText={value => setNewQuantity(value)}
        />
        <Dialog.Button label='Cancelar' onPress={cancelRestockHandler} />
        <Dialog.Button label='Actualizar' onPress={restockHandler} />
      </Dialog.Container>
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
