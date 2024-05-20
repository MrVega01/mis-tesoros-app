import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function StyledTouchableHighlight ({ title, onPress, style }) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={[styles.touchable, style]}>
        <StyledText style={styles.touchableText}>{title}</StyledText>
      </View>
    </TouchableHighlight>
  )
}
const styles = StyleSheet.create({
  touchable: {
    backgroundColor: theme.appBar.primary,
    padding: 12,
    alignItems: 'center',
    borderRadius: 1000
  },
  touchableText: {
    color: theme.colors.textPrimary
  }
})
