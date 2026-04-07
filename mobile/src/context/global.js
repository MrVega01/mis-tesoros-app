import { createContext } from 'react'
import { useGlobalReducer } from '../hooks/useGlobalReducer'

export const GlobalContext = createContext()

export function GlobalContextProvider ({ children }) {
  const { state, updateTax } = useGlobalReducer()
  return (
    <GlobalContext.Provider value={{
      state,
      updateTax
    }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
