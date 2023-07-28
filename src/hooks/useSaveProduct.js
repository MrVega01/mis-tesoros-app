import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useSaveProduct () {
  const [product, setProduct] = useState({})
  const loading = useRef(false)

  const saveProduct = (product) => {
    const { name, price } = product

    if (!name || !price || name === product.name) return false
    else {
      setProduct(product)
      return true
    }
  }

  useEffect(() => {
    loading.current = true
    const { name, price, type, quantity } = product
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
    }).then(() => {
      loading.current = false
    }).catch(e => console.log(e))
  }, [product])

  return { saveProduct, loading }
}
