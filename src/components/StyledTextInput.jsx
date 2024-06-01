import { TextInput, StyleSheet } from 'react-native'
import { theme } from '../theme'

export default function StyledTextInput ({ style = {}, error, children, value, onChangeText, name, inputRef, ...props }) {
  const inputStyle = [
    styles.textInput,
    error && styles.error,
    style
  ]
  return (
    <TextInput
      style={inputStyle}
      onChangeText={value => onChangeText && onChangeText(name, value)}
      value={value}
      ref={inputRef}
      {...props}
    >{children}
    </TextInput>
  )
}

const styles = StyleSheet.create({
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    color: theme.colors.textPrimary
  },
  error: {
    borderColor: 'rgba(255, 0, 0, 0.5)'
  }
})
