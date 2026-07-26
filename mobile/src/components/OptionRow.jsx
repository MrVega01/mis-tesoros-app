import { Pressable, StyleSheet, View } from 'react-native'
import ChevronRightSVG from '../img/ChevronRight'
import StyledText from './StyledText'
import { theme } from '../theme'

// Generic "settings list" row: a label, an optional current value and a
// chevron hinting that tapping it opens something (dialog or screen).
export default function OptionRow ({ label, value, onPress, disabled = false, accessibilityHint }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, disabled && styles.rowDisabled]}
    >
      <View style={styles.texts}>
        <StyledText size='sub' color='secondary'>{label}</StyledText>
        {value != null && <StyledText>{value}</StyledText>}
      </View>
      <ChevronRightSVG color={theme.colors.textSecondary} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4
  },
  rowPressed: {
    opacity: 0.6
  },
  rowDisabled: {
    opacity: 0.5
  },
  texts: {
    flexShrink: 1,
    gap: 4
  }
})
