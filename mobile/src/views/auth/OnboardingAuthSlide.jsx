import { StyleSheet, View } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledTouchableLink from '../../components/StyledTouchableLink'
import OnboardingBackButton from './OnboardingBackButton'

export default function OnboardingAuthSlide ({ t, onCreateAccount, onLogin, onBack }) {
  return (
    <View style={styles.slide}>
      <OnboardingBackButton label={t('onboarding.actions.back')} onPress={onBack} />

      <View style={styles.content}>
        <StyledText bold size='title' align='center' style={styles.title}>
          {t('onboarding.auth.title')}
        </StyledText>
        <StyledText color='secondary' align='center' style={styles.subtitle}>
          {t('onboarding.auth.subtitle')}
        </StyledText>
      </View>

      <View style={styles.actions}>
        <StyledTouchableHighlight
          title={t('onboarding.auth.createAccount')}
          onPress={onCreateAccount}
        />
        <StyledTouchableLink
          title={t('onboarding.auth.login')}
          onPress={onLogin}
          style={styles.loginLink}
          accessibilityLabel={t('onboarding.auth.login')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    marginBottom: 12
  },
  subtitle: {
    fontSize: theme.fontSizes.subheading,
    lineHeight: 24,
    paddingHorizontal: 12
  },
  actions: {
    gap: 8
  },
  loginLink: {
    alignSelf: 'center'
  }
})
