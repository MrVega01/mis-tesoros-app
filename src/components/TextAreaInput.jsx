import { TextInput, StyleSheet, View } from 'react-native'
import { useController } from 'react-hook-form'
import StyledText from './StyledText'
import { theme } from '../theme'

export default function TextAreaInput ({
  label,
  control,
  name,
  placeholder,
  minHeight = 100,
  maxLength,
  style,
  inputStyle
}) {
  const { field, fieldState } = useController({ control, name })

  return (
    <View style={[styles.wrapper, style]}>
      <StyledText style={styles.floatingLabel}>{label}</StyledText>
      <TextInput
        value={field.value ?? ''}
        onChangeText={(text) => field.onChange(text)}
        placeholder={placeholder}
        placeholderTextColor='rgba(255,255,255,0.3)'
        multiline
        textAlignVertical='top'
        maxLength={maxLength}
        allowFontScaling
        style={[
          styles.input,
          { minHeight },
          fieldState.error && styles.inputError,
          inputStyle
        ]}
      />
      {fieldState.error && (
        <StyledText style={styles.errorText}>{fieldState.error.message}</StyledText>
      )}
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
    marginTop: 6,
    fontSize: theme.fontSizes.body,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 10,
    color: theme.colors.textPrimary,
    letterSpacing: 0
  },
  inputError: {
    borderColor: theme.colors.danger
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginTop: -4,
    marginBottom: 6,
    paddingHorizontal: 2
  }
})
