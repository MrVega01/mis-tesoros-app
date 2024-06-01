import { StyleSheet, TouchableHighlight } from 'react-native'
import { theme } from '../theme'

export default function IconTouchable ({ children, onPress }) {
  return (
    <TouchableHighlight onPress={onPress} style={styles.touchable}>
      {children}
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${theme.colors.white}3f`,
    padding: 8
  }
})
