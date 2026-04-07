import { StyleSheet, View } from 'react-native'
import { useController } from 'react-hook-form'
import StyledText from './StyledText'
import StyledTextInput from './StyledTextInput'
import { theme } from '../theme'

export default function StyledTextInputWithLabel ({
  label,
  control,
  name,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry,
  style,
  inputStyle,
  ...props
}) {
  const { field, fieldState } = useController({
    control,
    name
  })

  const controlledValue = field.value ?? value ?? ''
  const errorMessage = fieldState.error ? fieldState.error.message : error

  return (
    <View style={[styles.wrapper, style]}>
      <StyledText style={styles.floatingLabel}>{label}</StyledText>
      <StyledTextInput
        name={name}
        value={controlledValue}
        onChangeText={(_, newValue) => {
          field.onChange(newValue)
          onChangeText && onChangeText(name, newValue)
        }}
        error={!!errorMessage}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputStyle]}
        {...props}
      />
      {errorMessage && <StyledText style={styles.errorText}>{errorMessage}</StyledText>}
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
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginTop: -4,
    marginBottom: 6,
    paddingHorizontal: 2
  }
})
