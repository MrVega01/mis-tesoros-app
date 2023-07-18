import { useEffect, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useSaveProduct () {
  const [saveProduct, setSaveProduct] = useState({})

  useEffect(async () => {
    const { name, price } = saveProduct
    if (name || price) {
      globalThis.fetch(`${API_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(saveProduct)
      }).catch(e => console.log(e))
    }
  }, saveProduct)

  return { saveProduct: setSaveProduct }
}
