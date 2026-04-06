import { useState, useEffect } from 'react'
import {
  Pressable,
  Platform,
  StyleSheet
} from 'react-native'
import StyledModal from './StyledModal'
import DateTimePicker from '@react-native-community/datetimepicker'
import StyledText from './StyledText'
import { theme } from '../theme'
import { dateToIsoTime } from '../utils/dateHelpers'

export default function TimePickerModal ({ visible, initialValue, onConfirm, onClose, confirmLabel }) {
  const [tempDate, setTempDate] = useState(initialValue ?? new Date())

  useEffect(() => {
    if (visible) {
      setTempDate(initialValue ?? new Date())
    }
  }, [visible, initialValue])

  if (Platform.OS === 'android') {
    if (!visible) return null
    return (
      <DateTimePicker
        value={initialValue}
        mode='time'
        display='default'
        onChange={(event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            onConfirm(dateToIsoTime(selectedDate))
          } else {
            onClose()
          }
        }}
      />
    )
  }

  return (
    <StyledModal
      visible={visible}
      onClose={onClose}
      animationType='fade'
      backdropColor='rgba(0,0,0,0.5)'
      cardPaddingBottom={24}
      dragHandleStyle={{ marginTop: 12, marginBottom: 4 }}
    >
      <DateTimePicker
        value={tempDate}
        mode='time'
        display='spinner'
        themeVariant='dark'
        textColor='#fefefe'
        style={{ width: '100%', alignSelf: 'stretch' }}
        onChange={(_, d) => d && setTempDate(d)}
      />

      <Pressable
        onPress={() => onConfirm(dateToIsoTime(tempDate))}
        style={styles.confirmButton}
        accessibilityRole='button'
        accessibilityLabel={confirmLabel}
      >
        <StyledText style={styles.confirmText}>{confirmLabel}</StyledText>
      </Pressable>
    </StyledModal>
  )
}

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: theme.colors.accent,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  confirmText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold'
  }
})
