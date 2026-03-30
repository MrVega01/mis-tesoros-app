import { Pressable, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function LanguageSwitcher () {
  const { i18n } = useTranslation()
  const currentLang = i18n.language === 'en' ? 'en' : 'es'

  return (
    <View
      style={styles.container}
      accessibilityRole='toolbar'
      accessibilityLabel='Language selector'
    >
      <Pressable
        onPress={() => i18n.changeLanguage('es')}
        accessibilityRole='button'
        accessibilityLabel='Switch to Spanish'
        accessibilityHint='Sets the app language to Spanish'
        hitSlop={8}
      >
        <StyledText style={[styles.option, currentLang === 'es' && styles.active]}>
          ES
        </StyledText>
      </Pressable>

      <StyledText style={styles.dot}>·</StyledText>

      <Pressable
        onPress={() => i18n.changeLanguage('en')}
        accessibilityRole='button'
        accessibilityLabel='Switch to English'
        accessibilityHint='Sets the app language to English'
        hitSlop={8}
      >
        <StyledText style={[styles.option, currentLang === 'en' && styles.active]}>
          EN
        </StyledText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  option: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: theme.colors.textSecondary
  },
  active: {
    color: theme.appBar.primary
  },
  dot: {
    fontSize: 12,
    color: theme.colors.textSecondary
  }
})
