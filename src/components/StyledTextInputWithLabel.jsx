import { StyleSheet, View } from 'react-native'
import StyledText from './StyledText'
import StyledTextInput from './StyledTextInput'
import { theme } from '../theme'

export default function StyledTextInputWithLabel ({
  label,
  name,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  inputStyle,
  ...props
}) {
  return (
    <View style={[styles.wrapper, style]}>
      <StyledText style={styles.floatingLabel}>{label}</StyledText>
      <StyledTextInput
        name={name}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputStyle]}
        {...props}
      />
      x
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative'
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sub,
    zIndex: 2
  },
  input: {
    marginTop: 6
  }
})
