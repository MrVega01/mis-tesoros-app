import { createContext } from 'react'
import { useGlobalReducer } from '../hooks/useGlobalReducer'

export const GlobalContext = createContext()

export function GlobalContextProvider ({ children }) {
  const { state, updateTax, addRefreshProduct } = useGlobalReducer()
  return (
    <GlobalContext.Provider value={{
      state,
      updateTax,
      addRefreshProduct
    }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
