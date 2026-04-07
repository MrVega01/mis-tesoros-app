import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useProducts (fetchDependencies = []) {
  const [products, setProducts] = useState([])
  const [refresh, setRefresh] = useState(false)
  const loading = useRef(false)

  const refreshFetch = () => {
    setRefresh(refresh => !refresh)
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
  }, [...fetchDependencies, refresh])

  return { products, loading, refresh: refreshFetch }
}
