import { StyleSheet, View } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'

const FEATURE_KEYS = ['discover', 'trade', 'manage']

function FeatureRow ({ title, description }) {
  return (
    <View style={styles.feature}>
      <View style={styles.bullet} />
      <View style={styles.featureText}>
        <StyledText bold style={styles.featureTitle}>{title}</StyledText>
        <StyledText size='sub' color='secondary' style={styles.featureDescription}>
          {description}
        </StyledText>
      </View>
    </View>
  )
}

export default function OnboardingIntroSlide ({ t, onNext }) {
  return (
    <View style={styles.slide}>
      <View style={styles.content}>
        <StyledText bold size='title' style={styles.title}>
          {t('onboarding.intro.title')}
        </StyledText>
        <StyledText color='secondary' style={styles.subtitle}>
          {t('onboarding.intro.subtitle')}
        </StyledText>

        <View style={styles.features}>
          {FEATURE_KEYS.map((key) => (
            <FeatureRow
              key={key}
              title={t(`onboarding.intro.features.${key}.title`)}
              description={t(`onboarding.intro.features.${key}.description`)}
            />
          ))}
        </View>
      </View>

      <StyledTouchableHighlight
        title={t('onboarding.actions.next')}
        onPress={onNext}
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
    marginBottom: 36
  },
  features: {
    gap: 22
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: theme.colors.accent
  },
  featureText: {
    flex: 1
  },
  featureTitle: {
    fontSize: theme.fontSizes.body,
    marginBottom: 4
  },
  featureDescription: {
    lineHeight: 19
  }
})
