import { Button, StyleSheet, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledPicker from './StyledPicker'
import { theme } from '../theme'
import StyledText from './StyledText'
import { useState } from 'react'
import useSaveProduct from '../hooks/useSaveProduct'

export function ProductForm () {
  const [formValues, setFormValues] = useState({})
  const { saveProducts } = useSaveProduct()

  const submitHandler = () => {
    const { name, price } = formValues

    if (!name || !price) return
    saveProducts(formValues)
  }
  const changeInputHandler = (name, value) => {
    setFormValues(oldValues => ({ ...oldValues, [name]: value }))
  }
  console.log(formValues)
  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte el nombre</StyledText>
      <StyledTextInput name='name' onChangeText={changeInputHandler} />
      <StyledText style={styles.label}>Inserte el precio</StyledText>
      <StyledTextInput name='price' onChangeText={changeInputHandler} keyboardType='numeric' />
      <StyledText style={styles.label}>Inserte el tipo</StyledText>
      <StyledPicker formValues={formValues} name='type' onChange={changeInputHandler} items={['Alimento', 'Bebida', 'Limpieza', 'Cofitería']} />
      <StyledText style={styles.label}>Inserte la cantidad</StyledText>
      <StyledTextInput name='quantity' onChangeText={changeInputHandler} keyboardType='numeric' />
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
