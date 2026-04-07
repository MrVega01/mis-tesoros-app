import { StyleSheet, View } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'
import LanguageSwitcher from './LanguageSwitcher'

export default function BrandHeader () {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.gem} />
        <StyledText style={styles.wordmark}>MIS TESOROS</StyledText>
      </View>

      <LanguageSwitcher />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  gem: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.appBar.primary,
    backgroundColor: 'rgba(221, 133, 31, 0.15)',
    transform: [{ rotate: '45deg' }]
  },
  wordmark: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: theme.colors.textSecondary
  }
})
