import { useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useUpdateProduct () {
  const [loading, setLoading] = useState(false)

  const updateProduct = async (newProduct) => {
    const { id, name, price, type_id: type, quantity } = newProduct
    if (!name || !price || isNaN(Number(quantity))) return

    try {
      setLoading(true)
      const insertTo = JSON.stringify({
        name,
        price: Number(price) || 0,
        type_id: isNaN(Number(type)) ? null : Number(type),
        quantity: Number(quantity) || 0
      })

      return await globalThis.fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        body: insertTo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const registerProductSale = async (productQuantityArray) => {
    if (!productQuantityArray.length) return

    try {
      setLoading(true)
      const insertTo = JSON.stringify(productQuantityArray)
      console.log(insertTo, 'json')

      return await globalThis.fetch(`${API_URL}/products/sale`, {
        method: 'PUT',
        body: insertTo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { updateProduct, registerProductSale, loading }
}
