import { Button, StyleSheet, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledPicker from './StyledPicker'
import { theme } from '../theme'
import StyledText from './StyledText'
import { useContext, useEffect, useRef, useState } from 'react'
import useSaveProduct from '../hooks/useSaveProduct'
import { GlobalContext } from '../context/global'

export function ProductForm () {
  const [formValues, setFormValues] = useState({})
  const { state } = useContext(GlobalContext)
  const formRefs = useRef([])
  const { saveProduct, loading } = useSaveProduct()

  const submitHandler = () => {
    saveProduct(formValues)
  }
  const changeInputHandler = (name, value) => {
    setFormValues(oldValues => ({ ...oldValues, [name]: value }))
  }

  useEffect(() => {
    if (loading === true) formRefs.current.forEach(input => input.clear())
    else {
      const { refreshProducts } = state
      refreshProducts && refreshProducts()
    }
  }, [loading])

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte el nombre</StyledText>
      <StyledTextInput
        inputRef={el => { formRefs.current[0] = el }}
        name='name'
        onChangeText={changeInputHandler}
      />
      <StyledText style={styles.label}>Inserte el precio</StyledText>
      <StyledTextInput
        inputRef={el => { formRefs.current[1] = el }}
        name='price'
        onChangeText={changeInputHandler}
        keyboardType='numeric'
      />
      <StyledText style={styles.label}>Inserte el tipo</StyledText>
      <StyledPicker
        formValues={formValues}
        name='type'
        onChange={changeInputHandler}
        items={[
          ['Alimento', 1],
          ['Bebida', 2],
          ['Limpieza', 3],
          ['Cofitería', 4]
        ]}
      />
      <StyledText style={styles.label}>Inserte la cantidad</StyledText>
      <StyledTextInput
        inputRef={el => { formRefs.current[2] = el }}
        name='quantity'
        onChangeText={changeInputHandler}
        keyboardType='numeric'
      />
      <Button title='Subir' onPress={submitHandler} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: 3
  }
})
