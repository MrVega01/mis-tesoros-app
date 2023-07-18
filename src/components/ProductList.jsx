import { FlatList } from 'react-native'
import { Product } from './Product'

const products = [
  {
    id: 3,
    name: 'Azucar',
    price: 24,
    type: 'Alimento',
    quantity: 103
  },
  {
    id: 4,
    name: 'Azucar',
    price: 24,
    type: 'Alimento',
    quantity: null
  }
]

export default function ProductList ({ tax }) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <Product product={item} tax={tax} />}
      keyExtractor={item => item.id}
    />
  )
}
