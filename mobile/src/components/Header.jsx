import { StyleSheet, View } from 'react-native'
import StyledText from './StyledText'
import { theme } from '../theme'

export default function Header ({ title, rightComponent }) {
  return (
    <View style={styles.container}>
      <StyledText size='title'>{title}</StyledText>
      {rightComponent}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderBottomColor: `${theme.colors.white}2f`,
    borderBottomWidth: 1
  }
})
