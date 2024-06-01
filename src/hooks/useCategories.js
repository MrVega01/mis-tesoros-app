import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../utils/constants'

export default function useCategories (fetchDependencies = []) {
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState(false)
  const loading = useRef(false)

  const refreshFetch = () => {
    setRefresh(refresh => !refresh)
  }

  useEffect(() => {
    loading.current = true

    globalThis.fetch(`${API_URL}/types`)
      .then(response => response.json())
      .then(response => {
        setCategories(response)
        loading.current = true
      })
      .catch(e => console.log(e))
  }, [...fetchDependencies, refresh])

  return { categories, loading, refresh: refreshFetch }
}
export function useSaveCategory () {
  const [loading, setLoading] = useState(false)

  const saveCategory = async (category) => {
    if (!category) return false
    try {
      setLoading(true)
      const insertTo = JSON.stringify({ type: category })

      globalThis.fetch(`${API_URL}/types`, {
        method: 'POST',
        body: insertTo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (e) {
      console.log(e)
      return e
    } finally {
      setLoading(false)
    }
  }
  return { saveCategory, loading }
}
