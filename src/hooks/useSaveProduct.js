import { useEffect, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useSaveProduct () {
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)

  const saveProduct = (newProduct) => {
    const { name, price } = newProduct

    if (!name || !price || name === product.name) return false
    else {
      setProduct(newProduct)
      return true
    }
  }

  useEffect(() => {
    const { name, price, type, quantity } = product
    if (name && price) {
      setLoading(true)
      const insertTo = JSON.stringify({
        name,
        price: Number(price) || 0,
        type_id: isNaN(Number(type)) ? null : Number(type),
        quantity: Number(quantity) || 0
      })

      globalThis.fetch(`${API_URL}/products`, {
        method: 'POST',
        body: insertTo,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => setLoading(false))
        .catch(e => console.log(e))
    }
  }, [product])

  return { saveProduct, loading }
}
