import { View, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StyledText from './StyledText'
import StyledTextInput from './StyledTextInput'
import { theme } from '../theme'

export default function TaxForm ({ taxState }) {
  const [tax, setTax] = taxState

  const handlerChangeText = (value) => {
    setTax(Number(value))
    AsyncStorage.setItem('tax', value)
  }

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte la tasa diaria</StyledText>
      <StyledTextInput keyboardType='numeric' onChangeText={handlerChangeText}>{tax}</StyledTextInput>
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
