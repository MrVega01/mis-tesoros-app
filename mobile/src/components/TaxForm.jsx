import { View, StyleSheet } from 'react-native'
import StyledText from './StyledText'
import StyledTextInput from './StyledTextInput'
import { theme } from '../theme'

export default function TaxForm ({ taxState }) {
  const [tax, setTax] = taxState

  const handlerChangeText = (name, value) => setTax(value)

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte la tasa diaria</StyledText>
      <StyledTextInput keyboardType='numeric' onChangeText={handlerChangeText} name='tax'>{tax}</StyledTextInput>
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
