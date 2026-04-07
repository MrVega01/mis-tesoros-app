import { StyleSheet, TouchableHighlight } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function StyledTouchableHighlight ({ title, onPress, style }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.touchable, style]}
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
  }
})
