import { useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalInitialState, globalReducer } from '../reducers/global'

export function useGlobalReducer () {
  const [state, dispatch] = useReducer(globalReducer, globalInitialState)

  const updateTax = (tax) => dispatch({
    type: 'UPDATE_TAX',
    payload: tax
  })
  const addRefreshProduct = (refresh) => dispatch({
    type: 'ADD_REFRESH_PRODUCT',
    payload: refresh
  })

  useEffect(() => {
    AsyncStorage.getItem('tax').then(value => value && updateTax(value))
  }, [])

  return {
    state,
    updateTax,
    addRefreshProduct
  }
}
