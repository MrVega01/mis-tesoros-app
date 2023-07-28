import { useContext, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Product } from './Product'
import useProducts from '../hooks/useProducts'
import StyledText from './StyledText'
import { GlobalContext } from '../context/global'

export default function ProductList () {
  const { state, addRefreshProduct } = useContext(GlobalContext)
  const { tax } = state
  const { products, loading, refresh } = useProducts()

  return (
    <>
      {
        loading
          ? (<FlatList
              data={products}
              renderItem={({ item }) => <Product product={item} tax={tax} />}
              keyExtractor={item => item.id}
             />)
          : <StyledText>Loading...</StyledText>
      }
    </>
  )
}
