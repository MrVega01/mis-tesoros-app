import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { theme } from '../theme'

export default function Settings () {
  return (
    <View style={styles.container} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20
  }
})
