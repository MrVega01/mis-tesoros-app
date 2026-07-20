import { StyleSheet, TouchableHighlight } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function StyledTouchableHighlight ({ title, onPress, style, disabled = false }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      style={[styles.touchable, disabled && styles.touchableDisabled, style]}
      underlayColor={theme.colors.secondary}
      accessibilityRole='button'
      accessibilityLabel={title}
    >
      <StyledText style={styles.touchableText}>{title}</StyledText>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: theme.appBar.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchableText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: theme.fontSizes.subheading,
    textAlign: 'center'
  },
  touchableDisabled: {
    opacity: 0.5
  }
})
