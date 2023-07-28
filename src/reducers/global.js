export const globalInitialState = {
  tax: 0,
  refreshProducts: null
}

export const globalReducer = (state, action) => {
  let newState
  const { type, payload } = action

  switch (type) {
    case 'UPDATE_TAX': newState = { ...state, tax: payload }
      break
    case 'ADD_REFRESH_PRODUCT': newState = { ...state, refreshProducts: payload }
      break

    default: throw new Error('Action type for Cart reducer is invalid')
  }
  return newState
}
