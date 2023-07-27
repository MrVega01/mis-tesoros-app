import { useEffect, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useSaveProduct () {
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)

  const saveProduct = (product) => {
    const { name, price } = product

    if (!name || !price) return false
    else {
      setProduct(product)
      return true
    }
  }

  useEffect(() => {
    setLoading(true)
    console.log(API_URL)
    const { name, price, type, quantity } = product
    const insertTo = JSON.stringify({
      name,
      price: Number(price) || 0,
      type,
      quantity: Number(quantity) || 0
    })

    globalThis.fetch(`${API_URL}/products`, {
      method: 'POST',
      body: insertTo,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => setLoading(false))
      .catch(e => console.log(e))
  }, [product])

  return { saveProduct, loading }
}
