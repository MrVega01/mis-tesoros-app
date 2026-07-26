import { StyleSheet, View } from 'react-native'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StyledTextInput from './StyledTextInput'
import StyledPicker from './StyledPicker'
import StyledText from './StyledText'
import StyledTouchableHighlight from './StyledTouchableHighlight'
import useCategories from '../hooks/useCategories'
import { useSaveProduct } from '../hooks/useProducts'
import { resolveErrorMessage } from '../utils/errorMessage'
import { theme } from '../theme'

export function ProductForm () {
  const [formValues, setFormValues] = useState({})
  const formRefs = useRef([])
  const { t } = useTranslation()
  const { data: categories } = useCategories()
  const saveProduct = useSaveProduct()

  const pickerValues = useMemo(() => {
    return (categories ?? []).map(({ id, name }) => [name, id])
  }, [categories])

  const submitHandler = async () => {
    try {
      await saveProduct.mutateAsync(formValues)
      formRefs.current.forEach(input => input && input.clear())
      setFormValues({})
    } catch {}
  }
  const changeInputHandler = (name, value) => {
    setFormValues(oldValues => ({ ...oldValues, [name]: value }))
  }

  const errorMessage = resolveErrorMessage(saveProduct.error, t)

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
        name='categoryId'
        onChange={changeInputHandler}
        items={pickerValues}
      />
      <StyledText style={styles.label}>Inserte la cantidad</StyledText>
      <StyledTextInput
        inputRef={el => { formRefs.current[2] = el }}
        name='quantity'
        onChangeText={changeInputHandler}
        keyboardType='numeric'
      />
      {errorMessage ? (
        <StyledText style={styles.errorMessage}>{errorMessage}</StyledText>
      ) : null}
      <StyledTouchableHighlight
        title='Subir'
        onPress={submitHandler}
        disabled={saveProduct.isPending}
      />
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
  },
  errorMessage: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginBottom: 8
  }
})
