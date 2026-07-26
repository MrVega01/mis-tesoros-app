import { useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import Dialog from 'react-native-dialog'
import { Product } from './Product'
import StyledText from './StyledText'
import useProducts, { useDeleteProduct, useRestockProduct } from '../hooks/useProducts'
import { useTaxRate } from '../hooks/useTax'
import { resolveErrorMessage } from '../utils/errorMessage'
import { theme } from '../theme'

export default function ProductList () {
  const [productToRestock, setProductToRestock] = useState(null)
  const [newQuantity, setNewQuantity] = useState('')
  const { t } = useTranslation()
  const tax = useTaxRate()
  const { data: products, isPending, isError, error } = useProducts()
  const deleteProduct = useDeleteProduct()
  const restockProduct = useRestockProduct()

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
        onPress: async () => {
          try {
            await deleteProduct.mutateAsync(id)
          } catch {}
        }
      }
    ])
  }
  const cancelRestockHandler = () => {
    setProductToRestock(null)
    setNewQuantity('')
  }
  const restockHandler = async () => {
    try {
      await restockProduct.mutateAsync({ id: productToRestock.id, quantity: newQuantity })
      setProductToRestock(null)
      setNewQuantity('')
    } catch {}
  }

  if (isPending) {
    return <StyledText align='center' style={styles.message}>{t('common.loading')}</StyledText>
  }

  if (isError) {
    return (
      <StyledText align='center' style={[styles.message, styles.error]}>
        {resolveErrorMessage(error, t)}
      </StyledText>
    )
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
        <Dialog.Button
          label='Actualizar'
          onPress={restockHandler}
          disabled={restockProduct.isPending}
        />
      </Dialog.Container>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <Product
            product={item}
            tax={tax}
            onLongPress={longPressHandler}
          />
        )}
        keyExtractor={item => item.id}
      />
    </>
  )
}

const styles = StyleSheet.create({
  message: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  error: {
    color: theme.colors.danger
  }
})
