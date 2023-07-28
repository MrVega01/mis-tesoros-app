import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useProducts () {
  const [products, setProducts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const loading = useRef(false)

  const refreshProducts = () => {
    setRefresh(oldValue => !oldValue)
  }

  useEffect(() => {
    loading.current = true

    globalThis.fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then(response => {
        setProducts(response)
        loading.current = true
      })
      .catch(e => console.log(e))
  }, [refresh])

  return { products, loading, refresh: refreshProducts }
}
