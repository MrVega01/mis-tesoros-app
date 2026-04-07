import { useContext } from 'react'
import { FlatList, View } from 'react-native'
import StyledText from './StyledText'
import { GlobalContext } from '../context/global'
import { ProductSale } from './ProductSale'

export default function ProductSaleList ({ quantityList, setQuantityList, useProducts }) {
  const { state } = useContext(GlobalContext)
  const { tax } = state
  const { products, loading } = useProducts

  return (
    <>
      {
        loading
          ? (<FlatList
              data={products}
              ItemSeparatorComponent={<View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <ProductSale
                  product={item}
                  tax={tax}
                  quantity={quantityList[item.id]?.quantity || 0}
                  setQuantity={
                    (newQuantity) => setQuantityList({ ...item, quantity: newQuantity })
                  }
                />
              )}
              keyExtractor={item => item.id}
             />)
          : <StyledText>Loading...</StyledText>
      }
    </>
  )
}
