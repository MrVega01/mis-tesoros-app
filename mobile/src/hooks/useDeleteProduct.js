import { useEffect, useState } from 'react'
import { API_URL } from '../utils/constants'

export function useDeleteProduct () {
  const [ID, setID] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ID !== null) {
      setLoading(true)

      globalThis.fetch(`${API_URL}/products/${ID}`, { method: 'DELETE' })
        .then(response => {
          setLoading(false)
        })
        .catch(e => console.log(e))
    }
  }, [ID])

  return { deleteProduct: setID, loading }
}
