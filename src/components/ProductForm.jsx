import { Button, StyleSheet, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledPicker from './StyledPicker'
import { theme } from '../theme'
import StyledText from './StyledText'
import { useRef, useState } from 'react'
import useSaveProduct from '../hooks/useSaveProduct'

export function ProductForm () {
  const [formValues, setFormValues] = useState({})
  const formRefs = useRef([])
  const { saveProduct } = useSaveProduct()

  const submitHandler = () => {
    saveProduct(formValues)
    formRefs.current.forEach(input => input.clear())
  }
  const changeInputHandler = (name, value) => {
    setFormValues(oldValues => ({ ...oldValues, [name]: value }))
  }
  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte el nombre</StyledText>
      <StyledTextInput
        ref={el => { formRefs.current[0] = el }}
        name='name'
        onChangeText={changeInputHandler}
      />
      <StyledText style={styles.label}>Inserte el precio</StyledText>
      <StyledTextInput
        ref={el => { formRefs.current[1] = el }}
        name='price'
        onChangeText={changeInputHandler}
        keyboardType='numeric'
      />
      <StyledText style={styles.label}>Inserte el tipo</StyledText>
      <StyledPicker
        formValues={formValues}
        name='type'
        onChange={changeInputHandler}
        items={['Alimento', 'Bebida', 'Limpieza', 'Cofitería']}
      />
      <StyledText style={styles.label}>Inserte la cantidad</StyledText>
      <StyledTextInput
        ref={el => { formRefs.current[2] = el }}
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
