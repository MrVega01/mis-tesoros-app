import { StyleSheet, View } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import RoleSplitSelector from '../../components/RoleSplitSelector'
import OnboardingBackButton from './OnboardingBackButton'

export default function OnboardingRoleSlide ({ t, selectedRole, onSelectRole, onNext, onBack }) {
  return (
    <View style={styles.slide}>
      <OnboardingBackButton label={t('onboarding.actions.back')} onPress={onBack} />

      <View style={styles.content}>
        <StyledText bold size='title' style={styles.title}>
          {t('onboarding.role.title')}
        </StyledText>
        <StyledText color='secondary' style={styles.subtitle}>
          {t('onboarding.role.subtitle')}
        </StyledText>

        <RoleSplitSelector
          selectedRole={selectedRole}
          onSelect={onSelectRole}
          customer={{
            title: t('onboarding.role.customer.title'),
            description: t('onboarding.role.customer.description')
          }}
          seller={{
            title: t('onboarding.role.seller.title'),
            description: t('onboarding.role.seller.description')
          }}
        />
      </View>

      <StyledTouchableHighlight
        title={t('onboarding.actions.next')}
        onPress={onNext}
        disabled={!selectedRole}
      />
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
    marginBottom: 32
  }
})
