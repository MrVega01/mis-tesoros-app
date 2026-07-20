import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { theme } from '../theme'
import BrandHeader from './BrandHeader'

export default function BootSplash () {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <BrandHeader />
      </View>
      <ActivityIndicator
        color={theme.appBar.primary}
        size='large'
        accessibilityLabel='Loading'
        accessibilityRole='progressbar'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24
  },
  brand: {
    width: '60%'
  }
})
