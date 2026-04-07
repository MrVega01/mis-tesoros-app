import { StyleSheet, TouchableHighlight } from 'react-native'
import StyledText from './StyledText'
import { theme } from '../theme'

export default function StyledTouchableLink ({
  title,
  children,
  onPress,
  style,
  textStyle,
  underlined = true,
  color = 'secondary',
  accessibilityLabel,
  ...props
}) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.wrapper, style]}
      accessibilityRole='link'
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <StyledText
        style={[
          styles.text,
          underlined && styles.underlined,
          color === 'primary' && styles.colorPrimary,
          color === 'white' && styles.white,
          textStyle
        ]}
      >
        {title || children}
      </StyledText>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  text: {
    color: theme.colors.textSecondary
  },
  underlined: {
    textDecorationLine: 'underline'
  },
  colorPrimary: {
    color: theme.colors.textPrimary
  },
  white: {
    color: theme.colors.white
  }
})
