import { create } from 'zustand'

const useTaxStore = create((set) => ({
  tax: 0,
  setTax: (tax) => set({ tax })
}))

export default useTaxStore
