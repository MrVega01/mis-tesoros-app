import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useTaxStore from '../stores/taxStore'
import { TAX_KEY } from '../utils/constants'

// Read selector (granular, like useAuthState).
export function useTaxRate () {
  return useTaxStore(state => state.tax)
}

// Action + persistence. Side effects live in the hook, not the store, so the
// store stays pure state. Number() is the single coercion point.
export function useTaxActions () {
  const setTax = useTaxStore(state => state.setTax)

  const updateTax = async (value) => {
    const tax = Number(value) || 0
    setTax(tax)
    try {
      await AsyncStorage.setItem(TAX_KEY, String(tax))
    } catch {}
  }

  return { updateTax }
}

// One-shot startup hydration (like restoreSession). Reads the persisted rate
// once and coerces it back to a number so state.tax is never a string.
export function useTaxHydration () {
  const setTax = useTaxStore(state => state.setTax)

  useEffect(() => {
    AsyncStorage.getItem(TAX_KEY)
      .then(value => { if (value != null) setTax(Number(value) || 0) })
      .catch(() => {})
  }, [])
}
