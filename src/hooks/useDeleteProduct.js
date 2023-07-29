import { useContext, useEffect, useState } from 'react'
import { API_URL } from '../utils/constants'
import { GlobalContext } from '../context/global'

export function useDeleteProduct () {
  const [ID, setID] = useState(null)
  const { state } = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ID !== null) {
      setLoading(true)

      globalThis.fetch(`${API_URL}/products/${ID}`, { method: 'DELETE' })
        .then(response => {
          setLoading(false)
          state.refreshProducts()
        })
        .catch(e => console.log(e))
    }
  }, [ID])

  return { deleteProduct: setID, loading }
}
