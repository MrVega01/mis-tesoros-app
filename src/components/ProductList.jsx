import { FlatList } from 'react-native'
import { Product } from './Product'
import useProducts from '../hooks/useProducts'
import StyledText from './StyledText'

export default function ProductList ({ tax }) {
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
