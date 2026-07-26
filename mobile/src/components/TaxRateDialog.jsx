import { StyleSheet } from 'react-native'
import Dialog from 'react-native-dialog'
import { theme } from '../theme'

// Body of the "edit tax rate" dialog. Explicit props on purpose: the parent
// owns the draft so a cancel can discard it without a save ever firing.
export default function TaxRateDialog ({
  visible,
  title,
  label,
  value,
  onChangeText,
  onCancel,
  onSubmit,
  cancelLabel,
  saveLabel,
  isPending,
  errorMessage
}) {
  return (
    <Dialog.Container visible={visible} onBackdropPress={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      {errorMessage
        ? <Dialog.Description style={styles.error}>{errorMessage}</Dialog.Description>
        : null}
      <Dialog.Input
        keyboardType='numeric'
        label={label}
        value={value}
        onChangeText={onChangeText}
        autoFocus
        accessibilityLabel={label}
      />
      <Dialog.Button label={cancelLabel} onPress={onCancel} />
      <Dialog.Button label={saveLabel} onPress={onSubmit} disabled={isPending} />
    </Dialog.Container>
  )
}

const styles = StyleSheet.create({
  error: {
    color: theme.colors.danger
  }
})
