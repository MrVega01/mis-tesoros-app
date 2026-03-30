import { StyleSheet, TextInput, View } from 'react-native'
import { useController } from 'react-hook-form'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function CodeInput ({ control, name, placeholder }) {
  const { field, fieldState } = useController({ control, name })

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={field.value}
        onChangeText={(text) => field.onChange(text)}
        onBlur={() => field.onBlur()}
        placeholder={placeholder}
        placeholderTextColor='rgba(212, 212, 212, 0.35)'
        maxLength={6}
        keyboardType='number-pad'
        autoComplete='one-time-code'
        textContentType='oneTimeCode'
        style={[styles.input, fieldState.error && styles.inputError]}
        accessibilityLabel={placeholder}
        accessibilityHint='Enter the 6-digit verification code sent to your email'
        allowFontScaling
      />
      {fieldState.error && (
        <StyledText style={styles.errorText}>{fieldState.error.message}</StyledText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 8
  },
  input: {
    width: '72%',
    fontSize: 32,
    fontFamily: 'Courier',
    letterSpacing: 12,
    textAlign: 'center',
    color: theme.colors.textPrimary,
    borderWidth: 2,
    borderColor: theme.appBar.primary,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(221, 133, 31, 0.06)'
  },
  inputError: {
    borderColor: theme.colors.danger
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginTop: 8,
    textAlign: 'center'
  }
})
