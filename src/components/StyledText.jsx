import { Text, StyleSheet } from 'react-native'
import { theme } from '../theme'

export default function StyledText ({
  children,
  style,
  bold,
  size,
  color,
  align,
  ...restOfProps
}) {
  const textStyles = [
    styles.text,
    bold && styles.bold,
    size === 'title' && styles.title,
    size === 'subheading' && styles.subheading,
    size === 'sub' && styles.sub,
    color === 'primary' && styles.colorPrimary,
    color === 'secondary' && styles.colorSecondary,
    color === 'white' && styles.white,
    align === 'center' && styles.alignCenter,
    style
  ]
  return <Text style={textStyles} {...restOfProps}>{children}</Text>
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.main
  },
  bold: {
    fontWeight: theme.fontWeights.bold
  },
  title: {
    fontSize: theme.fontSizes.title
  },
  subheading: {
    fontSize: theme.fontSizes.subheading
  },
  sub: {
    fontSize: theme.fontSizes.sub
  },
  colorPrimary: {
    color: theme.colors.textPrimary
  },
  colorSecondary: {
    color: theme.colors.textSecondary
  },
  white: {
    color: theme.colors.white
  },
  alignCenter: {
    textAlign: 'center'
  }
})
