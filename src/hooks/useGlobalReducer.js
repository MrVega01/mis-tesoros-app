import { useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalInitialState, globalReducer } from '../reducers/global'

export function useGlobalReducer () {
  const [state, dispatch] = useReducer(globalReducer, globalInitialState)

  const updateTax = (tax) => dispatch({
    type: 'UPDATE_TAX',
    payload: tax
  })

  useEffect(() => {
    AsyncStorage.getItem('tax').then(value => value && updateTax(value))
  }, [])

  return {
    state,
    updateTax
  }
}
